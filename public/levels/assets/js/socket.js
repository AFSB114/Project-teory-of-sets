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
                console.log(event.data)
             }
        })
    }
}

export default Socket