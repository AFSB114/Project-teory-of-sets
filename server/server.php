<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

include 'controller/joinRoom.php';
include 'controller/createRoom.php';
include 'controller/getAdminRoom.php';
include 'controller/getDataGuest.php';
include 'controller/getRoomGuest.php';
include 'controller/deletePlayer.php';

include 'connection/connection.php';

require __DIR__ . '/vendor/autoload.php';

class Multiplayer implements MessageComponentInterface
{
    public function __construct(
        protected SplObjectStorage $clients = new SplObjectStorage,
        private DatabaseConnection $dbConnection = new DatabaseConnection(),
        private array $clientLookup = [] // Inicializar el array
    ) {}

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);
        $this->clientLookup[$conn->sessionId] = $conn; // Almacenar el cliente por sessionId

        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);
        $sessionId = $queryParams['session_id'];

        if (!isset($this->clientLookup[$sessionId])) {
            $conn->sessionId = $sessionId;
        } else {
            // Si el cliente ya existe, desconectar la nueva conexión
            $this->clients->detach($conn);
            $conn = $this->clientLookup[$sessionId];
        }

        echo "Nueva conexión! ($conn->sessionId)\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $from->send(json_encode(['action' => 'error', 'message' => 'Mensaje malformado']));
            return;
        }

        $userId = $data['id'] ?? null;
        $codeRoom = $data['code'] ?? null;
        $numLevels = $data['numLevels'] ?? null;
        $timePerLevel = $data['timePerLevel'] ?? null;
        $clientData = $from->sessionId;

        switch ($data['action']) {
            case 'create':
                $from->rol = 'ADMIN';

                $createRoom = new Room($userId, $timePerLevel, $numLevels, $clientData, $this->dbConnection);
                $create = $createRoom->createRoom();
                $from->send(json_encode(['action' => 'createdRoom', 'data' => $create->data]));
                $from->codeRoom = $create->data;
                break;

            case 'join':
                $from->rol = 'GUEST';
                $from->codeRoom = $codeRoom;
                $joinRoom = new JoinRoom($codeRoom, $userId, $clientData, $this->dbConnection);
                $roomEnable = $joinRoom->checkRoom();
                if ($roomEnable->status == 'success') {
                    $join = $joinRoom->joinRoom();
                    $getAdmin = new GetAdminRoom($codeRoom, $this->dbConnection);
                    $admin = $getAdmin->getAdminRoom();
                    if ($join->status == 'error') {
                        echo 'No se pudo completar la unión: ' . $join->data;
                    } else {
                        $from->send(json_encode(['action' => 'joinedRoom', 'data' => 'Joined correct']));
                        $getDataGuest = new GetDataGuest($clientData, $codeRoom, $this->dbConnection);
                        $dataGuest = $getDataGuest->getDataGuest();
                        if (isset($this->clientLookup[$admin['data']])) {
                            $this->clientLookup[$admin['data']]->send(json_encode(['action' => 'joined', 'data' => $dataGuest['nickname']]));
                        }
                    }
                } else {
                    $from->send(json_encode(['action' => 'error', 'mensaje' => 'Sala no encontrada']));
                }
                break;

            case 'play':
                $roomGuests = new GetRoomGuest($codeRoom, $this->dbConnection);
                $guests = $roomGuests->getRoomGuest();
                $from->send(json_encode(['action' => 'play']));
                foreach ($guests as $guest) {
                    if (isset($this->clientLookup[$guest['data']])) {
                        $this->clientLookup[$guest['data']]->send(json_encode(['action' => 'play', 'message' => 'Empieza el juego']));
                    }
                }
                break;
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $deletePlayer = new DeletePlayer($conn->sessionId, $conn->codeRoom, $this->dbConnection);
        $message = '';

        switch ($conn->rol) {
            case 'ADMIN':
                $deletePlayer->leftAdmin();
                $message = json_encode(['action' => 'closed', 'message' => 'El admin ha cerrado la sala']);
                break;
            case 'GUEST':
                $deletePlayer->leftGuest();
                $message = json_encode(['action' => 'exit', 'message' => 'El guest ha salido de la sala']);
                break;
        }

        $roomGuests = new GetRoomGuest($conn->codeRoom, $this->dbConnection);
        $guests = $roomGuests->getRoomGuest();
        foreach ($guests as $guest) {
            if (isset($this->clientLookup[$guest['data']])) {
                $this->clientLookup[$guest['data']]->send($message);
            }
        }

        $conn->send($message);
        $this->clients->detach($conn);
        unset($this->clientLookup[$conn->sessionId]); // Eliminar del lookup
        echo "Conexión $conn->sessionId se ha desconectado\n";
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
            new Multiplayer()
        )
    ),
    8080
);
$server->run();
