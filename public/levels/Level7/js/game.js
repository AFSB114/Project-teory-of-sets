import Socket from '../../assets/js/socket.js';

const urlParams = new URLSearchParams(window.location.search);
const play = JSON.parse(urlParams.get('play'));
const id = parseInt(urlParams.get('id'));
const indexLevel = parseInt(urlParams.get('indexLevel'));

let socket = null;

if (play) {
    socket = new Socket(`ws://localhost:8080?&id=${id}`)
    socket.connect()
}

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

import StoreLevelCompleted from '../../assets/js/storeLevelCompleted.js'
const store = new StoreLevelCompleted(7)
store.addStartedLevel()

const espejos = document.querySelectorAll('.espejo1, .espejo2, .espejo3, .espejo4, .cuadro1, .cuadro2, .cuadro3');
const puerta = document.getElementById('puerta');
let espejosSeleccionados = 0;

espejos.forEach((espejo) => {
    espejo.addEventListener('click', () => {
        // Agregar clase 'seleccionado' y 'activo' al elemento clicado
        if (!espejo.classList.contains('seleccionado')) {
            espejo.classList.add('seleccionado');
            espejo.classList.add('activo'); // Mantener el filtro activo
            espejosSeleccionados++;

            // Si todos los espejos y cuadros han sido seleccionados, abrir la puerta
            if (espejosSeleccionados === espejos.length) {
                abrirPuerta();
            }
        }
    });
});

function abrirPuerta() {
    puerta.classList.add('abierta');
    document.getElementById('open').play();
  
    puerta.addEventListener('click', irAlNivel8);
}

function irAlNivel8() {
    if (play) {
        socket.sendPassLevel(indexLevel)
    } else {
        store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level8')
    }
}

document.getElementById('radio').addEventListener('click', function() {
    let audioElement = document.getElementById('radio-audio');
    audioElement.play().catch(error => {
        console.error("Error al intentar reproducir el audio:", error);
    });
});
