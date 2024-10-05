<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

include '../room/joinRoom.php';
include '../room/createRoom.php';
include '../room/getAdminRoom.php';
include '../room/getDataGuest.php';
include '../api/schemas/response.php';

include '../connection/connection-1.php';

require __DIR__ . '/vendor/autoload.php';

class room implements MessageComponentInterface
{
    protected SplObjectStorage $clients;
    protected array $rooms;
    private DatabaseConnection $dbConnection;

    public function __construct()
    {
        $this->clients = new SplObjectStorage;
        $this->rooms = [];
        $this->dbConnection = new DatabaseConnection();
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);

        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);
        $sessionId = $queryParams['session_id'];

        foreach ($this->clients as $client) {
            if (!isset($client->sessionId)) {
                $conn->sessionId = $sessionId;
            } elseif ($client->sessionId == $sessionId) {
                $this->clients->detach($conn);
                $conn = $client;
            }
        }

        echo "Nueva conexión! ($conn->sessionId)\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        foreach ($this->clients as $client) {
            if ($from == $client && isset($client->sessionId)) {
                $clientId = $client->sessionId;
                $from = $client;
            }
        }
//        echo "Este es él, id del cliente $clientId\n";

        $data = json_decode($msg, true);
        $userId = $data['id'];
        $codeRoom = $data['code'];
        $numLevels = $data['numLevels'];
        $timePerLevel = $data['timePerLevel'];

        if ($data['action'] === 'create') {
            $createRoom = new CreateRoom($userId, $timePerLevel, $numLevels, $clientId, $this->dbConnection);
            $create = $createRoom->createRoom();

            $from->send(json_encode(['action' => 'createdRoom', 'data' => $create->data]));

        } elseif ($data['action'] === 'join') {

            $joinRoom = new JoinRoom($codeRoom, $userId, $clientId, $this->dbConnection);
            $roomEnable = $joinRoom->checkRoom();

            if ($roomEnable->status == 'success') {

                $join = $joinRoom->joinRoom();

                $getAdmin = new GetAdminRoom($codeRoom, $this->dbConnection);
                $admin = $getAdmin->getAdminRoom();

                if ($join->status == 'error') {
                    echo 'No se pudo completar la union ' . $join->data;

                } else {

                    $from->send(json_encode(['action' => 'joinedRoom', 'data' => 'Joined correct']));

//                    echo "Esto es el admin de la sala " . $admin['data'];
                    $getDataGuest = new GetDataGuest($clientId, $codeRoom, $this->dbConnection);
                    $dataGuest = $getDataGuest->getDataGuest();

                    foreach ($this->clients as $client) {
                        if ($admin['data'] == $client->sessionId) {
                            $client->send(json_encode(['action' => 'joined', 'data' => $dataGuest['nickname']]));
                            break;
                        }
                    }
                }

            } else {
                $from->send(json_encode(['action' => 'error', 'mensaje' => 'Sala no encontrada']));
            }
        } elseif ($data['action'] === 'play') {

            foreach ($this->rooms[$data['code']]['members'] as $guest) {
                $guest['from']->send(json_encode(['action' => 'play']));
            }

        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
        echo "Conexión $conn->resourceId se ha desconectado\n";
    }

    public function onError(ConnectionInterface $conn, Exception $e): void
    {
        echo "Un error ha ocurrido: {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new room()
        )
    ),
    8080
);

$server->run();