import SocketConnection from '../assets/js/socket.js'
import Players from '../assets/js/addPlayers.js'
let players = new Players()

async function init() {

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    let id = parseInt(urlParams.get('id'))

    const connection = new SocketConnection(`ws://localhost:8080?&id=${id}`)

    try {
        const socketConn = await connection.connect()
    } catch (err) {
        window.location.href = '../start/?message=No se pudo establecer conexión con el servidor'
    }

    

    connection.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)

        switch (data.action) {
            case 'CHARGE_DATA':
                connection.socket.send(JSON.stringify({
                    action: 'RANKING'
                }))
                console.log(data.message)
                break;
            case 'RANKING':
                players.addToRanking(data.players)
                break
            case 'GUEST_LEFT':
                players.removePlayer(data.id)
                break
            case 'ADMIN_LEFT':
                window.location.href = `../start/?message=${data.message}`
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
            case 'ERROR':
                alert(data.message)
                break
            default:
                console.log(data)
                break
        }
    }
}

init()