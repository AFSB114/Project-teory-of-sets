<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require_once 'connection/connection.php';
require_once 'controller/createRoom.php';
require_once 'controller/joinRoom.php';

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
        if ($this->clients->contains($conn)) {
            return;
        }

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
        $this->clients->detach($conn);
        $this->logDisconnection($conn);
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

        $conn->id = $queryParams['id'];
        $conn->token = $queryParams['token'];
        $conn->nickname = $queryParams['nickname'];

        $this->clients->attach($conn);

        if (isset($queryParams['code']) && isset($this->rooms[$queryParams['code']])) {
            $this->rooms[$queryParams['code']]['players']->attach($conn);
        }
    }

    private function handleCreateRoom(ConnectionInterface $from, array $data): void
    {
        $room = new Room(
            $from->id,
            $data['timePerLevel'],
            $data['numLevels'],
            $from->token,
            new Connection()
        );

        $code = $room->createRoom()['code'];
        $from->code = $code;

        $this->rooms[$code] = [
            'settings' => [
                'levels' => $room->levelsToRoom($code),
                'maxTime' => $data['timePerLevel']
            ],
            'players' => new SplObjectStorage()
        ];

        $this->rooms[$code]['players']->attach($from);

        $this->sendResponse($from, [
            'action' => 'CREATE',
            'code' => $code,
            'nickname' => $from->nickname
        ]);
    }

    private function handleJoinRoom(ConnectionInterface $from, array $data): void
    {
        $from->code = $data['code'];
        $join = new JoinRoom($data['code'], $from->id, $from->token);

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
            'code' => $roomCode,
            'levels' => $this->rooms[$roomCode]['settings']['levels']
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
        // Implementar lógica para manejar el paso de nivel
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
                    'nickname' => $newPlayer->nickname
                ]);
            }

            $this->sendResponse($newPlayer, [
                'action' => 'JOIN',
                'message' => 'Joined to room successfully!',
                'nickname' => $client->nickname
            ]);
        }
    }

    private function broadcastToRoom(string $roomCode, array $message): void
    {
        foreach ($this->rooms[$roomCode]['players'] as $client) {
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