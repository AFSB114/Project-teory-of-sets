import Socket from '../../assets/js/socket.js';

const urlParams = new URLSearchParams(window.location.search);
const play = JSON.parse(urlParams.get('play'));
const id = parseInt(urlParams.get('id'));
const indexLevel = parseInt(urlParams.get('indexLevel'));

let socket = null;

if (play) {
    socket = new Socket(`ws://localhost:8080?&id=${id}`)
    socket.connect()
    document.getElementById('restart').style.display = 'none'
    document.getElementById('map').style.display = 'none'
}

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

import StoreLevelCompleted from '../../assets/js/storeLevelCompleted.js'
const store = new StoreLevelCompleted(7)
store.addStartedLevel()

const espejos = document.querySelectorAll('.espejo1, .espejo2, .espejo3, .espejo4, .cuadro1, .cuadro2, .cuadro3');
const puerta = document.getElementById('puerta');
let radioClicked = false;
let espejosSeleccionados = 0;


espejos.forEach((espejo) => {
    espejo.style.pointerEvents = 'none';
    espejo.classList.add('disabled');
});

radio.addEventListener('click', function() {
    let audioElement = document.getElementById('radio-audio');
    audioElement.play().catch(error => {
        console.error("Error al intentar reproducir el audio:", error);
    });


    espejos.forEach((espejo) => {
        espejo.style.pointerEvents = 'auto';
        espejo.classList.remove('disabled');
    });

    radioClicked = true;
});

espejos.forEach((espejo) => {
    espejo.addEventListener('click', () => {

        if (!radioClicked) {
            console.log('Primero debes hacer clic en la radio');
            return;
        }

        if (!espejo.classList.contains('seleccionado')) {
            espejo.classList.add('seleccionado');
            espejo.classList.add('activo');
            espejosSeleccionados++;

            if (espejosSeleccionados === espejos.length) {
                abrirPuerta();
            } else {
                console.log(`Espejos seleccionados: ${espejosSeleccionados}`);
            }
        } else {
            console.log('Este objeto ya está seleccionado.');
        }
    });
});

function abrirPuerta() {
    puerta.classList.add('abierta');
    document.getElementById('open').play();
  
    puerta.addEventListener('click', irAlNivel8);
}

function irAlNivel8() {
    window.location.href = "../Level8/index.html";
}