<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/vendor/autoload.php';

class SalaChat implements MessageComponentInterface {
    protected $clients;
    protected $salas;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->salas = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nueva conexión! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        
        if ($data['action'] === 'create') {
            $codigoSala = $this->generarCodigoSala();
            $this->salas[$codigoSala] = ['host' => $from, 'miembros' => []];
            $from->send(json_encode(['action' => 'salaCreada', 'codigo' => $codigoSala]));
        } elseif ($data['action'] === 'join') {
            if (isset($this->salas[$data['codigo']])) {
                $this->salas[$data['codigo']]['miembros'][] = $from;
                $from->send(json_encode(['action' => 'unidoASala', 'codigo' => $data['codigo']]));
                $this->salas[$data['codigo']]['host']->send(json_encode(['action' => 'nuevoMiembro', 'id' => $from->resourceId]));
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

    private function generarCodigoSala() {
        return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyz', ceil(6/strlen($x)) )),1,6);
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new SalaChat()
        )
    ),
    8080
);

$server->run();