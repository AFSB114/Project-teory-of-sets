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
const store = new StoreLevelCompleted(2)
store.addStartedLevel()

const conjuntoA = document.querySelector('.conjunto2'); // Conjunto de espejos
const conjuntoB = document.querySelector('.conjunto1'); // Conjunto de cuadros
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');

const espejos = ['espejo1', 'espejo2', 'espejo3'];
const cuadros = ['cuadro1', 'cuadro2', 'cuadro3', 'cuadro4'];

let objetosCorrectos = 0;
const totalObjetos = espejos.length + cuadros.length;

[conjuntoA, conjuntoB].forEach((conjunto) => {
    conjunto.addEventListener('dragover', (event) => {
        event.preventDefault();
        conjunto.classList.add('conjunto-hover');
    });

    conjunto.addEventListener('dragleave', () => {
        conjunto.classList.remove('conjunto-hover');
    });

    conjunto.addEventListener('drop', (event) => {
        event.preventDefault();
        const objetoId = event.dataTransfer.getData('text');
        const objeto = document.getElementById(objetoId);

        if (
            (conjunto === conjuntoA && espejos.includes(objetoId)) ||
            (conjunto === conjuntoB && cuadros.includes(objetoId))
        ) {
            conjunto.appendChild(objeto);
            objetosCorrectos++;

            if (objetosCorrectos === totalObjetos) {
                abrirPuerta();
            }
        } else {
            showMessage('Este objeto no pertenece a este conjunto.');
        }

        conjunto.classList.remove('conjunto-hover');
    });
});

const objetos = document.querySelectorAll('[draggable="true"]');
objetos.forEach((objeto) => {
    objeto.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
    });
});

function abrirPuerta() {
    console.log('¡Todos los objetos están en su lugar! La puerta se abre.');
    doorOpen.play();
    puerta.classList.add('abrir-puerta');

    puerta.addEventListener('click', () => {
        window.location.href = '../level3/index.html';
    });
}