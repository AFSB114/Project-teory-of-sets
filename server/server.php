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
    public function __construct(
        protected SplObjectStorage $clients = new SplObjectStorage(),
        protected array            $rooms = []
    )
    {
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);

        $queryString = $conn->httpRequest->getUri()->getQuery(); //
        parse_str($queryString, $queryParams);

        $conn->id = $queryParams['id'];
        $conn->token = $queryParams['token'];
        $conn->nickname = $queryParams['nickname'];

        if ($this->rooms["{$queryParams['code']}"]) {
            $this->rooms["{$queryParams['code']}"]->attach($conn);
        }

        echo "New connection ({$conn->nickname})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, true);

        switch ($data['action']) {
            case 'CREATE':
                $room = new Room($from->id, $data['numLevels'], $data['timePerLevel'], $from->token, new Connection());

                $code = $room->createRoom()['code'];
                $from->code = $code;

                $this->rooms["$code"] = new SplObjectStorage();
                $this->rooms["$code"]->attach($from);

                $from->send(json_encode(['action' => 'CREATE', 'code' => $code, 'nickname' => $from->nickname]));

                break;
            case 'JOIN':

                $from->code = $data['code'];

                $join = new JoinRoom($data['code'], $from->id, $from->token);

                if ($join->checkRoom()['status'] == 'OK') {
                    if ($join->joinRoom()['status'] == 'OK') {

                        $this->rooms["{$data['code']}"]->attach($from);

                        foreach ($this->rooms["{$data['code']}"] as $client) {
                            if ($client != $from) {
                                $client->send(json_encode(['action' => 'NEW_PLAYER', 'message' => 'New player has been joined!', 'nickname' => $from->nickname]));
                            }
                            $from->send(json_encode(['action' => 'JOIN', 'message' => 'Joined to room successfully!', 'nickname' => $client->nickname]));
                        }
                    }
                }

                break;
            case 'PLAY':

                foreach ($this->rooms["{$data['code']}"] as $client) {
                    $client->send(json_encode(['action' => 'PLAY', 'code' => $data['code']]));
                }
                case 'MESSAGE':
                    foreach ($this->rooms["{$data['code']}"] as $client) {
                        $client->send(json_encode(['action' => 'MESSAGE', 'id' => $from->id, 'nickname'=>$from->nickname, 'message' => $data['message']]));
                    }
        }

    }

    public function onClose(ConnectionInterface $conn): void
    {

        $this->rooms["{$conn->code}"]->detach($conn);
        $this->clients->detach($conn);

        echo "Exit ({$conn->nickname})\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "Un error ha ocurrido: {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MultiplayerServer()
        )
    ),
    8080
);

$server->run();