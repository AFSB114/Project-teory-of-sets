import SocketConnection from '../assets/js/socket.js'
import Players from '../assets/js/addPlayers.js'
import TextToSpeech from '../assets/js/readText.js'
const tts = new TextToSpeech()
let players = new Players()

async function init() {
    // Variable para rastrear si la sala está activa
    let salaActiva = false;

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

    const connection = new SocketConnection(`ws://localhost:8080?&id=${res.id}`)

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    let numLevels = urlParams.get('numLevels')
    let timePerLevel = urlParams.get('timePerLevel')

    try {
        const socketConn = await connection.connect()

        connection.createRoom(numLevels, timePerLevel)
        salaActiva = true;

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
                // Marcar que se está navegando intencionalmente
                salaActiva = false;
                window.location.href = `../../levels/${data.level.name}/?play=true&id=${data.id}&indexLevel=${data.indexLevel}e`
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
        let res = confirm('¿Estás seguro de que deseas abandonar la sala?\n¡Si lo haces, se cerrará la sala!')
        if (res) {
            salaActiva = false;
            connection.leftRoom()
            window.location.href = '../start/'
        } else {
            return
        }
    })

    window.addEventListener('beforeunload', (event) => {
        if (salaActiva) {
            event.preventDefault()
            event.returnValue = '';
            return '¿Estás seguro de que deseas salir? La sala se cerrará.';
        }
    });
}

init()