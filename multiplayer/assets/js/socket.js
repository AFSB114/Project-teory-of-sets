class SocketConnection {

    constructor(url) {
        this.url = url
        this.socket = null
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url)

            this.socket.onopen = () => {
                console.log('Conexión establecida')
                resolve(this.socket)
            }

            this.socket.onclose = (event) => {
                if (event.wasClean) {
                    console.log(`Conexión cerrada limpiamente, código=${event.code} razón=${event.reason}`)
                } else {
                    console.log('Conexión murió')
                }
            }

            this.socket.onerror = (error) => {
                console.error('Error en la conexión:', error)
                reject(error)
            }

            this.socket.onmessage = (event) => {}
        })
    }

    createRoom(numLevels, timePerLevel) {
        this.socket.send(JSON.stringify({
            action: 'CREATE',
            numLevels: numLevels,
            timePerLevel: timePerLevel
        }))
    }

    joinRoom(code) {
        this.socket.send(JSON.stringify({
            action: 'JOIN',
            code: code
        }))
    }

    play(code) {
        this.socket.send(JSON.stringify({
            action: 'PLAY',
            code: code
        }))
    }

    // Puedes agregar más métodos para manejar eventos del socket
    // sendMessage(message) {
    //     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
    //         this.socket.send(message)
    //     } else {
    //         console.error('El socket no está abierto')
    //     }
    // }
}

export default SocketConnection