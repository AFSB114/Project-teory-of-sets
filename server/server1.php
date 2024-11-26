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

    protected SplObjectStorage $clients;
    protected array $rooms;

    public function __construct()
    {
        $this->clients = new SplObjectStorage();
        $this->rooms = [];
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->initializeConnection($conn);
        $this->logConnectionStatus($conn);
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

    public function onClose(ConnectionInterface $conn): void
    {
        if (!$conn->play) {
            $this->clients->detach($conn);
            $this->logDisconnection($conn);
        }else{
            echo "\n\nNo se desconectó\n\n";
        }
    }

    public function onError(ConnectionInterface $conn, Exception $e): void
    {
        error_log("Error occurred: {$e->getMessage()}");
        $conn->close();
    }

    private function initializeConnection(ConnectionInterface $conn): void
    {
        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);

        $conn->id = (int)$queryParams['id'];

        echo "\n\nEste es el id de la persona: $conn->id\n\n";

        foreach ($this->clients as $client) {
            echo "\n\nEmpezo a recorrer todos los clientes conectados\n\n";
            var_dump($client->id);
            if ($conn->id === $client->id) {
                $conn->code = $client->code;
                echo "\n\nEste es el codigo de la sala en donde esta el usuario: $conn->code\n\n";
                $conn->times = $client->times;

                $this->clients->detach($client);
                $client->play = true;
                $client->close();
                break;
            }
        }

        $dataUser = new DataUsers(
            $conn->id,
            new Connection()
        );

        $res = $dataUser->getData();

        if ($res['status']) {
            $conn->nickname = $res['data']['nickname'];
            $conn->avatar = $res['data']['avatar'];
            $conn->play = false;
        } else {
            $conn->send(json_encode($res));
        }


        $this->clients->attach($conn);

        if (isset($conn->code)) {
            $this->rooms["$conn->code"]['players']->attach($conn);
            echo "\n\nEste es el id de la persona: {$this->rooms["$conn->code"]['players']->count()}\n\n";
        }
    }

    private function handleCreateRoom(ConnectionInterface $from, array $data): void
    {
        echo "Se esta creando la sala\n";
        $room = new Room(
            $from->id,
            $data['timePerLevel'],
            $data['numLevels'],
            new Connection()
        );

        $code = $room->createRoom()['code'];

        $from->code = $code;

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

        $this->rooms[$data['code']]['players']->attach($from);
        $this->notifyRoomParticipants($from, $data['code']);
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
        $from->times[(int)$data['indexLevel']] = $data['time'];

        $code = $from->code;

        echo "\n\nEste es el codigo de la sala: $code\n\n";

        $indexLevel = (int)$data['indexLevel'] + 1;

        if ($indexLevel <= $this->rooms[$code]['settings']['numLevels']) {
            $response = [
                'action' => 'NEXT_LEVEL',
                'level' => $this->rooms[$code]['settings']['levels'][$indexLevel],
                'indexLevel' => $indexLevel,
                'id' => $from->id
            ];
        } else {
            echo "Ha finalizado\n";
            $response = [
                'action' => 'FINISHED'
            ];
        }

        $this->sendResponse($from, $response);
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

    private function broadcastToRoom(string $roomCode, array $message): void
    {
        foreach ($this->rooms[$roomCode]['players'] as $client) {
            if ($message['action'] === 'PLAY') {
                $client->play = true;
                $message['id'] = $client->id;
            }
            $this->sendResponse($client, $message);
        }
    }

    private function sendResponse(ConnectionInterface $client, array $data): void
    {
        $client->send(json_encode($data));
    }

    private function logConnectionStatus(ConnectionInterface $conn): void
    {
        echo "New connection ({$conn->nickname})\n";
        echo "Number of players: {$this->clients->count()}\n";
    }

    private function logDisconnection(ConnectionInterface $conn): void
    {
        echo "Exit ({$conn->nickname})\n";
    }

    // Metodo para limpiar conexiones persistentes antiguas
    public function cleanupPersistentConnections(): void
    {
        $now = time();
        foreach ($this->persistentConnections as $id => $data) {
            // Eliminar conexiones persistentes después de 1 hora
            if ($now - $data['timestamp'] > 3600) {
                unset($this->persistentConnections[$id]);
            }
        }
    }

    public function forcePersistentConnectionCleanup(): void
    {
        $this->cleanupPersistentConnections();
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