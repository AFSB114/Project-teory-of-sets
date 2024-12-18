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
            conjunto.appendChild(objeto); 
            objetosCorrectos++; 

            // Verificar si todos los objetos están en su lugar
            if (objetosCorrectos === totalObjetos) {
                abrirPuerta(); 
            }
        } else {
            showMessage('Este objeto no pertenece a este conjunto.');
        }

        
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
        store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level3') // Redirigir al siguiente nivel
    });
}

// Control de clic en la puerta si no están todos los objetos
puerta.addEventListener('click', () => {
    if (objetosCorrectos < totalObjetos) {
        knock.play(); // Reproducir sonido de golpe
        showMessage('La puerta no se abrirá hasta que todos los objetos estén en sus conjuntos correctos.');
    }
});