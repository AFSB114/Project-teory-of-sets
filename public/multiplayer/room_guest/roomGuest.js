import SocketConnection from '../assets/js/socket.js'
import Players from '../assets/js/addPlayers.js'
import TextToSpeech from '../assets/js/readText.js'
const tts = new TextToSpeech()
let players = new Players()

async function init() {

    let res = await fetch('../../../php/controller/log.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getData'
            })
        }
    ).then(res => res.json())

    const connection = new SocketConnection(`ws://localhost:8080?id=${res.id}`)

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    let code = urlParams.get('code')

    try {
        const socketConn = await connection.connect()

        connection.joinRoom(code)

    } catch (err) {
        window.location.href = '../start/?message=No se pudo establecer conexión con el servidor'

    }

    if (!code.includes('-')) {
        code = code.replace(/(\d{3})(\d{3})/g, '$1-$2')
    }

    document.getElementById('code').innerHTML = code

    connection.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        switch (data.action) {
            case 'JOIN':
                players.addPlayer({ id: data.id, nickname: data.nickname, avatar: data.avatar })
                break
            case 'NEW_PLAYER':
                players.addPlayer({ id: data.id, nickname: data.nickname, avatar: data.avatar })
                break
            case 'GUEST_LEFT':
                players.removePlayer(data.id)
                break
            case 'ADMIN_LEFT':
                window.location.href = `../start/?message=${data.message}`
                break
            case 'PLAY':
                window.location.href = `../../levels/${data.level.name}/?play=true&id=${data.id}&indexLevel=${data.indexLevel}`
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
        connection.leftRoom()
        window.location.href = '../start/'
    })

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault()
        let res = confirm('Si haces esta accion saldras de la sala.\n¿Estás seguro?')
        if (res) {
            connection.leftRoom()
            window.location.href = '../start/'
        }
    })
}

init()