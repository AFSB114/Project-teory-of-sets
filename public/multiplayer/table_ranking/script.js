import SocketConnection from '../assets/js/socket.js'

async function init() {

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    

    const connection = new SocketConnection(`ws://localhost:8080?&id=${res.id}`)

    const urlParams = new URLSearchParams(window.location.search)

    try {
        const socketConn = await connection.connect()

        connection.createRoom(numLevels, timePerLevel)

    } catch (err) {
        window.location.href = '../start/?message=No se pudo establecer conexión con el servidor'
    }

    document.getElementById('play').addEventListener('click', async () => {
        let code = document.getElementById('code').innerHTML
        code = code.replace('-', '')
        code = parseInt(code)
        connection.play(code)
    })

    connection.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)

        switch (data.action) {
            case 'CREATE':
                let code = `${data.code}`
                code = code.replace(/(\d{3})(\d{3})/g, '$1-$2')
                document.getElementById('code').innerHTML = code
                players.addPlayer({ id: data.id, nickname: data.nickname, avatar: data.avatar })
                break
            case 'NEW_PLAYER':
                players.addPlayer({ id: data.id, nickname: data.nickname, avatar: data.avatar })
                break
            case 'GUEST_LEFT':
                players.removePlayer(data.id)
                break
            case 'PLAY':
                // window.location.href = `../../levels/level-test/?play=true`
                break
            case 'MESSAGE':
                let message = document.createElement('div')
                if (res.id == data.id) {
                    message.classList.add('me')
                    message.innerHTML = `${data.message} <strong>:TÚ</strong>`
                } else {
                    message.innerHTML = `<strong>${data.nickname}:</strong> ${data.message}`
                    tts.speak(data.message)
                }
                document.getElementById('messages').appendChild(message)
                document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight
                break
            case 'exit':
                alert(data.message)
                break
            case 'error':
                alert(data.message)
                break
            default:
                console.log(data)
                alert(data.message)
                break
        }
    }

    document.getElementById('send').addEventListener('click', async (event) => {
        event.preventDefault()
        const message = document.getElementById('message').value
        document.getElementById('message').value = ''
        let code = document.getElementById('code').innerHTML
        code = code.replace('-', '')
        connection.sendMessage(message, code)
    })

    document.getElementById('btn-back').addEventListener('click', (e) => {
        e.preventDefault()
        let res = confirm('¿Estás seguro de que deseas abandonar la sala?\n¡Si lo haces, se cerrará la sala!')
        if (res) {
            connection.leftRoom()
            window.location.href = '../start/'
        } else {
            return
        }
    })

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault()
        let res = confirm('Si haces esta accion se cerrará la sala.\n¿Estás seguro?')
        if (res) {
            connection.leftRoom()
            window.location.href = '../start/'
        }
    })
}

init()