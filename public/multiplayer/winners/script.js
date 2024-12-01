import SocketConnection from '../assets/js/socket.js'

async function init() {

    function showWinners(players) {

        let fondo = document.querySelector('.fondo')
        let jugadores = document.querySelector('.jugadores')

        for (let i = 0; i < players.length; i++) {

            if (i < 3) {
                let posicion = document.createElement('div')
                posicion.classList.add('posicion')

                let recuadro = document.createElement('div')
                recuadro.classList.add('recuadro')

                let personaje = document.createElement('div')
                personaje.classList.add('personaje')
                personaje.style.backgroundImage = `url('../../assets/character/${players[i].avatar}')`

                recuadro.appendChild(personaje)
                posicion.appendChild(recuadro)

                let nombre = document.createElement('div')
                nombre.classList.add('nombre')
                nombre.innerText = players[i].nickname

                posicion.appendChild(nombre)

                if (i === 0) {
                    posicion.classList.add('oro')
                } else if (i === 1) {
                    posicion.classList.add('plata')
                } else if (i === 2) {
                    posicion.classList.add('bronce')
                }

                fondo.appendChild(posicion)
            } else {

                let jugador = document.createElement('div')
                jugador.classList.add('jugador')

                let nombre = document.createElement('div')
                nombre.classList.add('nombre1')
                nombre.innerText = players[i].nickname

                let tiempo = document.createElement('div')
                tiempo.classList.add('tiempo')
                tiempo.innerText = players[i].time

                jugador.appendChild(nombre)
                jugador.appendChild(tiempo)

                jugadores.appendChild(jugador)
            }

        }

    }

    const urlParams = new URLSearchParams(window.location.search)

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    const id = parseInt(urlParams.get('id'))

    const connection = new SocketConnection(`ws://localhost:8080?&id=${id}`)

    try {
        const socketConn = await connection.connect()

        connection.socket.send(JSON.stringify({
            action: 'WINNERS'
        }))

    } catch (err) {
        window.location.href = '../start/?message=No se pudo establecer conexión con el servidor'
    }

    connection.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        switch (data.action) {
            case 'WINNERS':
                showWinners(data.sortedPlayers)
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