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

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                // console.log(data)
                switch (data.action) {
                    case 'createdRoom':
                        let code = `${data.data}`
                        code = code.replace(/(\d{3})(\d{3})/g, '$1-$2')
                        document.getElementById('code').innerHTML = code
                        break
                    case 'joinedRoom':
                        console.log(`Unido a la sala ${data.data}`)
                        break
                    case 'joined':
                        alert(`${data.data} se ha unido a la sala`)
                        break
                    case 'play':
                        alert('Jugador juega')
                        break
                    case 'error':
                        alert(data.mensaje)
                        break
                    default:
                        console.log(data)
                        break
                }
            }
        })
    }

    createRoom(id, numLevels, timePerLevel) {
        this.socket.send(JSON.stringify({
            action: 'create',
            id: id,
            numLevels: numLevels,
            timePerLevel: timePerLevel
        }))
    }

    joinRoom(code, id) {
        this.socket.send(JSON.stringify({
            action: 'join',
            code: code,
            id: id
        }))
    }

    play(code) {
        this.socket.send(JSON.stringify({
            action: 'play',
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