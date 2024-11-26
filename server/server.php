<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require_once 'connection/connection.php';
require_once 'controller/createRoom.php';
require_once 'controller/joinRoom.php';
require_once 'controller/dataUsers.php';

require __DIR__ . '/vendor/autoload.php';

class MultiplayerServer implements MessageComponentInterface
{
    private const ACTIONS = [
        'CREATE' => 'handleCreateRoom',
        'JOIN' => 'handleJoinRoom',
        'PLAY' => 'handlePlay',
        'MESSAGE' => 'handleMessage',
        'PASS_LEVEL' => 'handlePassLevel'
    ];


    public function __construct(
        // Guarda las conexiones de los clientes
        protected SplObjectStorage $clients = new SplObjectStorage(),
        // Guarda las salas con sus datos
        protected array            $rooms = [],
        // Almacena datos persistentes
        protected array            $persistentConnections = []
    )
    {
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);

        $conn->id = (int)$queryParams['id'];

        // Verificar si hay una conexión persistente para este ID
        $this->checkAndRestorePersistentConnection($conn);

        $this->initializeConnection($conn);
        $this->logConnectionStatus($conn);

    }

    private function checkAndRestorePersistentConnection(ConnectionInterface $conn): void
    {
        if (isset($this->persistentConnections[$conn->id])) {

            echo "Recover user's data\n";

            $persistentData = $this->persistentConnections[$conn->id];

            // Restaurar propiedades específicas
            $conn->code = $persistentData['code'] ?? null;
            $conn->time = $persistentData['time'] ?? '';
            $conn->play = true;

            // Opcional: Eliminar la entrada persistente si ya no es necesaria
            unset($this->persistentConnections[$conn->id]);
        }
    }

    private function initializeConnection(ConnectionInterface $conn): void
    {
        $dataUser = new DataUsers(
            $conn->id,
            new Connection()
        );

        echo "Getting user's data\n";

        $res = $dataUser->getData();

        if ($res['status']) {
            $conn->nickname = $res['data']['nickname'];
            $conn->avatar = $res['data']['avatar'];
        } else {
            $conn->send(json_encode($res));
        }

        $this->clients->attach($conn);

        if (isset($conn->code)) {
            $this->rooms[$conn->code]['players']->attach($conn);
        }
    }

    private function logConnectionStatus(ConnectionInterface $conn): void
    {
        echo "New connection ({$conn->nickname})\n";
        echo "Number of players: {$this->clients->count()}\n\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, true);
        $action = $data['action'] ?? '';

        if (isset(self::ACTIONS[$action])) {
            $method = self::ACTIONS[$action];
            $this->$method($from, $data);
        }
    }

    private function handleCreateRoom(ConnectionInterface $from, array $data): void
    {
        $room = new Room(
            $from->id,
            $data['timePerLevel'],
            $data['numLevels'],
            new Connection()
        );

        $code = $room->createRoom()['code'];

        $from->code = $code;
        $from->rol = 'ADMIN';
        var_dump($code);
        $from->time = '';

        $this->rooms[$code] = [
            'settings' => [
                'numLevels' => (int)$data['numLevels'],
                'levels' => $room->levelsToRoom($code),
                'maxTime' => $data['timePerLevel']
            ],
            'players' => new SplObjectStorage()
        ];

        $this->rooms[$code]['players']->attach($from);

        $this->sendResponse($from, [
            'action' => 'CREATE',
            'code' => $code,
            'nickname' => $from->nickname,
            'avatar' => $from->avatar
        ]);
    }

    private function handleJoinRoom(ConnectionInterface $from, array $data): void
    {
        $from->code = $data['code'];
        $join = new JoinRoom($data['code'], $from->id);

        if (!$this->isValidJoin($join)) {
            return;
        }

        $from->rol = 'GUEST';

        $this->rooms[$data['code']]['players']->attach($from);
        $this->notifyRoomParticipants($from, $data['code']);
    }

    private function isValidJoin(JoinRoom $join): bool
    {
        return $join->checkRoom()['status'] === 'OK' &&
            $join->joinRoom()['status'] === 'OK';
    }

    private function notifyRoomParticipants(ConnectionInterface $newPlayer, string $roomCode): void
    {
        foreach ($this->rooms[$roomCode]['players'] as $client) {
            if ($client !== $newPlayer) {
                $this->sendResponse($client, [
                    'action' => 'NEW_PLAYER',
                    'message' => 'New player has been joined!',
                    'nickname' => $newPlayer->nickname,
                    'avatar' => $newPlayer->avatar
                ]);
            }

            $this->sendResponse($newPlayer, [
                'action' => 'JOIN',
                'message' => 'Joined to room successfully!',
                'nickname' => $client->nickname,
                'avatar' => $client->avatar
            ]);
        }
    }

    private function handlePlay(ConnectionInterface $from, array $data): void
    {
        $roomCode = $data['code'];
        $response = [
            'action' => 'PLAY',
            'level' => $this->rooms[$roomCode]['settings']['levels'][0],
            'indexLevel' => 0
        ];

        $this->broadcastToRoom($roomCode, $response);
    }

    private function handleMessage(ConnectionInterface $from, array $data): void
    {
        $response = [
            'action' => 'MESSAGE',
            'id' => $from->id,
            'nickname' => $from->nickname,
            'message' => $data['message']
        ];

        $this->broadcastToRoom($data['code'], $response);
    }

    private function handlePassLevel(ConnectionInterface $from, array $data): void
    {
        $indexLevel = (int)$data['indexLevel'];

        $this->sumTime($from, $data['time']);

        $code = $from->code;

        $indexLevel += 1;

        $from->indexLevel = $indexLevel;

        if (isset($this->rooms[$code])) {
            if ($indexLevel < (int)$this->rooms[$code]['settings']['numLevels']) {
                $response = [
                    'action' => 'NEXT_LEVEL',
                    'level' => $this->rooms[$code]['settings']['levels'][$indexLevel],
                    'indexLevel' => $indexLevel,
                    'id' => $from->id
                ];
            } else {
                $response = [
                    'action' => 'FINISHED'
                ];
            }
        } else {
            $response = ['message' => 'no existe la sala', 'sala' => $this->rooms];
        }

        $this->sendResponse($from, $response);
    }

    private function sumTime(ConnectionInterface $from, string $time): void
    {
        list($newMin, $newSec) = explode(':', $time);
        list($currentMin, $currentSec) = explode(':', $from->time);

        $totNewSecs = (int)$newMin * 60 + (int)$newSec;
        $totCurrentSecs = (int)$currentMin * 60 + (int)$currentSec;

        $totSecs = $totNewSecs + $totCurrentSecs;

        $mins = floor($totSecs / 60);
        $secs = $totSecs % 60;


        $from->time = str_pad($mins, 2, '0', STR_PAD_LEFT) . ':' . str_pad($secs, 2, '0', STR_PAD_LEFT);

        echo "Time: {$from->time}\n";
    }

    private function broadcastToRoom(string $roomCode, array $message): void
    {
        foreach ($this->rooms[$roomCode]['players'] as $client) {
            if ($message['action'] === 'PLAY') {
                $client->play = true;
                $client->indexLevel = $message['indexLevel'];
                $message['id'] = $client->id;
            }
            $this->sendResponse($client, $message);
        }
    }

    private function sendResponse(ConnectionInterface $client, array $data): void
    {
        $client->send(json_encode($data));
    }

    public function onClose(ConnectionInterface $conn): void
    {
        // Condición para persistir la conexión
        if ($this->shouldPersistConnection($conn)) {
            $this->persistConnection($conn);
        } else {
            $this->clients->detach($conn);
            $this->logDisconnection($conn);
        }
    }

    private function shouldPersistConnection(ConnectionInterface $conn): bool
    {
        // Condición para persistir:
        return
            isset($conn->code) &&
            $conn->play &&                 // 1. No ha terminado el juego
            $this->isActiveInRoom($conn);   // 2. Está en una sala de juego
    }

    private function isActiveInRoom(ConnectionInterface $conn): bool
    {
        // Verificar si la conexión está activa en alguna sala
        return isset($this->rooms[$conn->code]) &&
            $this->rooms[$conn->code]['players']->contains($conn);
    }

    private function persistConnection(ConnectionInterface $conn): void
    {
        // Guardar datos relevantes para la reconexión
        $this->persistentConnections[$conn->id] = [
            'code' => $conn->code ?? null,
            'time' => $conn->time ?? ''
        ];

        // Opcional: Establecer la conexión como 'play' para evitar desconexión
        $conn->play = false;
        $this->onClose($conn);
    }

    private function logDisconnection(ConnectionInterface $conn): void
    {
        echo "Exit ({$conn->nickname})\n\n";
    }

    public function onError(ConnectionInterface $conn, Exception $e): void
    {
        error_log("Error occurred: {$e->getMessage()}");
        $conn->close();
    }
}

// Server initialization
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MultiplayerServer()
        )
    ),
    8080
);

$server->run();