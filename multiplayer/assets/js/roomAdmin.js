import SocketConnection from './socket.js'
import AddPlayer from './addPlayers.js'

let players = new AddPlayer()

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

    const connection = new SocketConnection(`ws://localhost:8080?session_id=${sessionId}`)

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    let res = await fetch('../../../php/api/getDataSession.php').then(res => res.json())

    let numLevels = urlParams.get('numLevels')
    let timePerLevel = urlParams.get('timePerLevel')

    try {
        const socketConn = await connection.connect()

        connection.createRoom(res.id, numLevels, timePerLevel)

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

        switch (data.action) {
            case 'createdRoom':
                let code = `${data.data}`
                code = code.replace(/(\d{3})(\d{3})/g, '$1-$2')
                document.getElementById('code').innerHTML = code
                players.addPlayer()
                break
            case 'joined':
                alert(`${data.data} se ha unido a la sala`)
                players.addPlayer()
                break
            case 'play':
                window.location.href = `../../level1/index.html`
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
}

init()

window.addEventListener('load', async () => {
    await fetch('../../php/controller/log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'checkLogIn'
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.authenticated) {
                window.location.href = `./multiplayer/intro_multiplayer.html`
            } else {
                window.location.href = '../log/log_in.html?message=Debes estar logueado para poder jugar multijugador'
            }
        })
})