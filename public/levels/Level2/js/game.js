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

// Objetos para cada categoría
const espejos = ['espejo1', 'espejo2'];
const cuadros = ['cuadro1', 'cuadro2', 'cuadro3'];

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
            // Posiciona el objeto en las coordenadas del evento drop
            const rect = conjunto.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;

            objeto.style.position = 'absolute';
            objeto.style.left = `${offsetX - objeto.offsetWidth / 2}px`;
            objeto.style.top = `${offsetY - objeto.offsetHeight / 2}px`;

            conjunto.appendChild(objeto);
            objetosCorrectos++;

            // Verificar si todos los objetos están en su lugar
            if (objetosCorrectos === totalObjetos) {
                abrirPuerta();
            }
        } else {
            mostrarMensajeError('Este objeto no pertenece a este conjunto.');
        }

        conjunto.classList.remove('conjunto-hover');
    });
});

// Hacer los objetos arrastrables
const objetos = document.querySelectorAll('[draggable="true"]');
objetos.forEach((objeto) => {
    objeto.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
    });
});

// Función para abrir la puerta
function abrirPuerta() {
    console.log('¡Todos los objetos están en su lugar! La puerta se abre.');
    doorOpen.play(); // Reproducir sonido de apertura
    puerta.classList.add('abrir-puerta'); // Aplicar animación

    // Permitir abrir la puerta al hacer clic
    puerta.addEventListener('click', () => {
        if (play) {
            socket.sendPassLevel(indexLevel)
        } else {
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level3')
        }
    });
}


function mostrarMensajeError(mensaje) {
    const mensajeError = document.getElementById('mensaje-error');
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove('oculto');

    setTimeout(() => {
        mensajeError.classList.add('oculto');
    }, 1000);
}
