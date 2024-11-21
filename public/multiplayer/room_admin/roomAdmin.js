import SocketConnection from '../assets/js/socket.js'
import AddPlayer from '../assets/js/addPlayers.js'
import TextToSpeech from '../assets/js/readText.js'
const tts = new TextToSpeech()
let players = new AddPlayer()

const links = document.getElementsByTagName('link')

for (let link of links) {
    if (link.rel === 'stylesheet') {
        console.log(link.href)
    }
}

async function init() {

    // Función para obtener el valor de una cookie por su nombre
    function getCookie(nombre) {
        // Dividir las cookies en un array
        const cookies = document.cookie.split(';');

        // Iterar sobre las cookies
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim(); // Eliminar espacios en blanco

            // Verificar si la cookie comienza con el nombre deseado
            if (cookie.startsWith(nombre + '=')) {
                // Retornar el valor de la cookie
                return cookie.substring(nombre.length + 1); // Extraer el valor
            }
        }

        // Retornar null si la cookie no se encuentra
        return null;
    }

    const sessionId = getCookie('PHPSESSID')

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

    const connection = new SocketConnection(`ws://localhost:8080?token=${sessionId}&id=${res.id}&nickname=${res.nickname}`)

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    let numLevels = urlParams.get('numLevels')
    let timePerLevel = urlParams.get('timePerLevel')

    try {
        const socketConn = await connection.connect()

        connection.createRoom(numLevels, timePerLevel)

    } catch (err) {
        console.error('No se pudo establecer conexión', err)
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
                players.addPlayer(data.nickname)
                break
            case 'NEW_PLAYER':
                players.addPlayer(data.nickname)
                break
            case 'PLAY':
                window.location.href = `../../levels/${data.levels[0].name}/?code=${data.code}`
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
}

init()
