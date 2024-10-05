import SocketConnection from './socket.js'

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


    const socket = new SocketConnection(`ws://localhost:8080?session_id=${sessionId}`)

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    let res = await fetch('../../../php/api/getDataSession.php').then(res => res.json())

    let numLevels = urlParams.get('numLevels')
    let timePerLevel = urlParams.get('timePerLevel')

    console.log(numLevels, timePerLevel)

    try {
        const socketConn = await socket.connect()

        socket.createRoom(res.id, numLevels, timePerLevel)

    } catch (err) {
        console.error('No se pudo establecer conexión', err)
    }

    document.getElementById('play').addEventListener('click', async () => {
        socket.play(code)
    })
}

init()

