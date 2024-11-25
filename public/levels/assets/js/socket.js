class Socket {
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
                console.log(data)

                switch (data.action) {
                    case 'NEXT_LEVEL':
                        window.location.href = `../../levels/${data.level}/?play=true&id=${data.id}&indexLevel=${data.indexLevel}`
                        break
                    default:
                        console.log(data)
                        break
                }
            }
        })
    }

    sendPassLevel(indexLevel) {
        this.socket.send(JSON.stringify({
            action: 'PASS_LEVEL',
            indexLevel: indexLevel,
            time: document.getElementById('timer').innerHTML
        }))
    }
}

export default Socket