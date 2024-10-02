<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/vendor/autoload.php';

class room implements MessageComponentInterface {
    protected $clients;
    public $rooms;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->rooms = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nueva conexión! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        
        if ($data['action'] === 'create') {
            
            $codeRoom = $data['code'];
            $this->rooms[$codeRoom] =  ['host' => $from, 'id' => $data['id'], 'members' => []];

            $from->send(json_encode(['action' => 'createdRoom', 'code' => $codeRoom]));

        } elseif ($data['action'] === 'join') {

            if (isset($this->rooms[$data['code']])) {
                
                $this->rooms[$data['code']]['members'][] = ['$from' => $from, 'id' => $data['id']];
                $from->send(json_encode(['action' => 'joinRoom', 'code' => $data['code']]));
                
                $this->rooms[$data['code']]['host']->send(json_encode(['action' => 'newMember', 'id' => $data['id']]));

            } else {
                $from->send(json_encode(['action' => 'error', 'mensaje' => 'Sala no encontrada']));
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Conexión {$conn->resourceId} se ha desconectado\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
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