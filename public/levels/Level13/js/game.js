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
const store = new StoreLevelCompleted(12)
store.addStartedLevel()


document.addEventListener('DOMContentLoaded', () => {
    // Variables del primer ejercicio
    const modalAsk = document.getElementById('modal-ask');
    const items = document.querySelectorAll('.hover');
    const correctItems = Array.from(items).filter(item => item.getAttribute('data-correct') === 'true');
    let selectedCorrect = 0;
    let primerEjercicioCompletado = false; // Controla si se completó el primer ejercicio

    const errorSound = document.getElementById('error-sound');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isCorrect = item.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                if (!item.classList.contains('selected')) {
                    item.classList.add('selected');
                    item.style.borderColor = 'limegreen';
                    selectedCorrect++;

                    if (selectedCorrect === correctItems.length) {
                        primerEjercicioCompletado = true; // Marca como completado
                        setTimeout(() => {
                            modalAsk.style.display = 'none';
                        }, 1000);
                    }
                }
            } else {
                errorSound.play().catch(err => {
                    console.log('Error al reproducir el sonido:', err);
                });
                item.style.borderColor = 'red';
                setTimeout(() => {
                    item.style.borderColor = '';
                }, 1000);
            }
        });
    });

    // Variables del segundo ejercicio (máquina de coser)
    const radio = document.getElementById('radio');
    const audioPista = document.getElementById('audio-pista');
    const hilos = document.querySelectorAll('.hilo');
    const modalCosedora = document.getElementById('modal-cosedora');
    const puerta = document.getElementById('puerta');
    const knock = document.getElementById('close'); // Sonido de golpear puerta
    const doorOpen = document.getElementById('open'); // Sonido de puerta abriéndose

    let passTrue = false;
    let secuenciaUsuario = [];

    const secuenciaCorrecta = [
        'blanco', 'blanco', 'negro', 'verde',
        'azul', 'rojo', 'rojo',
        'amarillo', 'rosado', 'morado', 'morado'
    ];

    // Reproducir pista al hacer clic en el radio
    radio.addEventListener('click', () => {
        if (primerEjercicioCompletado) {
            audioPista.play().catch(err => console.log('Error al reproducir la pista:', err));
        } else {
            console.log('Completa el primer ejercicio para desbloquear el siguiente.');
        }
    });

    // Manejador de clics en los hilos
    hilos.forEach(hilo => {
        hilo.addEventListener('click', () => {
            if (!primerEjercicioCompletado) {
                console.log('No puedes interactuar con los hilos hasta completar el primer ejercicio.');
                return;
            }

            const color = hilo.getAttribute('data-color');

            if (secuenciaUsuario.length < secuenciaCorrecta.length) {
                secuenciaUsuario.push(color);
                hilo.classList.add('selected');
            }

            const esCorrecto = secuenciaUsuario.every((color, index) => color === secuenciaCorrecta[index]);

            if (!esCorrecto) {
                secuenciaUsuario = [];
                hilos.forEach(h => h.classList.remove('selected'));
                console.log('Secuencia incorrecta. Inténtalo de nuevo.');
            } else if (secuenciaUsuario.length === secuenciaCorrecta.length) {
                passTrue = true;
                console.log('¡Secuencia correcta! Abriendo la puerta...');
                setTimeout(() => {
                    doorOpen.play();
                    modalCosedora.style.display = 'none';
                }, 2000);
            }
        });
    });

    // Interacción con la puerta
    puerta.addEventListener('click', () => {
        if (!passTrue) {
            knock.play(); // Sonido si no se ha completado la secuencia
        } else {
            console.log('¡Puerta abierta!');
            puerta.classList.add('abierta');
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level14');
        }
    });
});
