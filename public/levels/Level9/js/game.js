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
const store = new StoreLevelCompleted(9)
store.addStartedLevel()

let seleccionado = false;
let acertijoResuelto = false;

const modalCompletado = document.getElementById('modal-completado');
const objetosModal = [
    document.getElementById('objeto11'),
    document.getElementById('objeto12'),
    document.getElementById('objeto13'),
    document.getElementById('objeto14')
];


document.getElementById('selectButton').addEventListener('click', function() {
    seleccionado = true;

    document.getElementById('modal-ask').style.display = 'none';
    document.getElementById('cuadro-blanco').classList.add('mostrar');
    document.getElementById('cuadro-gris').classList.add('mostrar');

    deshabilitarObjetos();
});


const cuadroBlanco = document.getElementById('cuadro-blanco');
const cuadroGris = document.getElementById('cuadro-gris');
const cuadroDerecha = document.getElementById('cuadro-derecha');

const objetosBlanco = [
    document.getElementById('objeto1'),
    document.getElementById('objeto2'),
    document.getElementById('objeto3'),
    document.getElementById('objeto4')
];

const objetosGris = [
    document.getElementById('objeto6'),
    document.getElementById('objeto7'),
    document.getElementById('objeto8'),
    document.getElementById('objeto9')
];

objetosBlanco.forEach(objeto => {
    objeto.classList.add('objeto-blanco');
    objeto.addEventListener('click', function() {
        seleccionarObjeto(objeto, 'blanco');
    });
});

objetosGris.forEach(objeto => {
    objeto.classList.add('objeto-gris');
    objeto.addEventListener('click', function() {
        seleccionarObjeto(objeto, 'gris');
    });
});

let seleccionBlanco = 0;
let seleccionGris = 0;

function agregarChulito(cuadro) {
    const chulito = document.createElement('div');
    chulito.classList.add('chulito');
    cuadro.appendChild(chulito);
}

function seleccionarObjeto(objeto, cuadro) {
    if (!seleccionado) return;

    if (cuadro === 'blanco' && objetosBlanco.includes(objeto) && !objeto.classList.contains('seleccionado')) {
        objeto.classList.add('seleccionado');
        seleccionBlanco++;
    } else if (cuadro === 'gris' && objetosGris.includes(objeto) && !objeto.classList.contains('seleccionado')) {
        objeto.classList.add('seleccionado');
        seleccionGris++;
    }

    if (seleccionBlanco === objetosBlanco.length) {
        agregarChulito(cuadroBlanco);
        deshabilitarSeleccion('blanco');
    }
    if (seleccionGris === objetosGris.length) {
        agregarChulito(cuadroGris);
        deshabilitarSeleccion('gris');
    }
    
    if (seleccionBlanco === objetosBlanco.length && seleccionGris === objetosGris.length) {
        mostrarModalConRetraso(); 
    }
}

function deshabilitarSeleccion(cuadroSeleccionado) {
    if (cuadroSeleccionado === 'blanco') {
        objetosBlanco.forEach(objeto => {
            objeto.style.pointerEvents = 'none';
        });
    } else if (cuadroSeleccionado === 'gris') {
        objetosGris.forEach(objeto => {
            objeto.style.pointerEvents = 'none';
        });
    }
}

function habilitarSeleccion(cuadroSeleccionado) {
    if (cuadroSeleccionado === 'blanco') {
        objetosBlanco.forEach(objeto => {
            objeto.style.pointerEvents = 'auto';
        });
    } else if (cuadroSeleccionado === 'gris') {
        objetosGris.forEach(objeto => {
            objeto.style.pointerEvents = 'auto';
        });
    }
}

function deshabilitarObjetos() {
    objetosBlanco.forEach(objeto => {
        objeto.style.pointerEvents = 'none';
    });
    objetosGris.forEach(objeto => {
        objeto.style.pointerEvents = 'none';
    });
}

cuadroBlanco.addEventListener('click', function() {
    habilitarSeleccion('blanco');
    deshabilitarSeleccion('gris');
});

cuadroGris.addEventListener('click', function() {
    habilitarSeleccion('gris');
    deshabilitarSeleccion('blanco');
});

cuadroDerecha.addEventListener('click', function() {
    mostrarModal();
});

function mostrarModalConRetraso() {
    setTimeout(() => {
        mostrarModal();
    }, 1000); 
}

function mostrarModal() {
    const modal = document.getElementById('modal-completado');
    modal.style.display = 'block';
}


const modal = document.getElementById('modal-completado');
const span = document.getElementsByClassName('close')[0];


span.onclick = function() {
    if (acertijoResuelto) {
        modal.style.display = 'none';
    }
}


window.onclick = function(event) {
    if (event.target == modal && acertijoResuelto) {
        modal.style.display = 'none';
    }
}

const puerta = document.getElementById('puerta');
const closeSound = document.getElementById('close');

puerta.addEventListener('click', function() {
    if (!acertijoResuelto) {
       
        if (closeSound) closeSound.play();
    } else {
        
        this.classList.add('abierta');
        window.location.href = "../Level10/index.html";
    }
});

objetosModal.forEach(objeto => {
    objeto.addEventListener('click', function() {
        if (acertijoResuelto) return; 

        if (objeto.id === 'objeto11' || objeto.id === 'objeto14') {
            objeto.classList.add('seleccionado'); 
            
            const objetosCorrectos = document.querySelectorAll('#objeto11.seleccionado, #objeto14.seleccionado');
            
            if (objetosCorrectos.length === 2) {
                acertijoResuelto = true;
                deshabilitarObjetos();
                
                
                const openSound = document.getElementById('open');
                if (openSound) openSound.play();
                
               
                puerta.classList.add('abierta');
            }
        }
    });
});

