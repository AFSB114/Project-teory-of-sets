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
const store = new StoreLevelCompleted(3)
store.addStartedLevel()

const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
const silla = document.querySelector('.silla');
const mesa = document.querySelector('.mesa');
const cande = document.querySelector('.cande');
const puerta = document.getElementById('puerta');
let passTrue = false;


function cambiarImagen(elemento, nuevaClase) {
    elemento.classList.add(nuevaClase);
    verificarCambio();
}


function verificarCambio() {
    const sillaCambiada = silla.classList.contains('silla-cambiada');
    const mesaCambiada = mesa.classList.contains('mesa-cambiada');
    const candeCambiada = cande.classList.contains('cande-cambiada');

    if (sillaCambiada && mesaCambiada && candeCambiada) {
        passTrue = true;
        doorOpen.play();
    } else {
        passTrue = false;
    }
}

silla.addEventListener('click', function () {
    cambiarImagen(silla, 'silla-cambiada');
});

mesa.addEventListener('click', function () {
    cambiarImagen(mesa, 'mesa-cambiada');
});

cande.addEventListener('click', function () {
    cambiarImagen(cande, 'cande-cambiada');
});

puerta.addEventListener('click', () => {
    if (!passTrue) {
        knock.play();
    } else {
        store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level9')
    }
});


const cofre = document.getElementById('cofre');

cofre.addEventListener('click', () => {
    cofre.classList.add('moved');
    document.getElementById('modal-ask').classList.add('show-ask')
});


