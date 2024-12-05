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

const cuadros = Array.from(document.getElementsByClassName('cuadro'));
let pass = ['', '', ''];
const passCorrect = ['cuadro-1', 'cuadro-2', 'cuadro-3'];
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
let passTrue = false;

cuadros.forEach(cuadro => {
    cuadro.addEventListener('click', () => {
        cuadro.style.filter = 'drop-shadow(0 0 2vh rgba(255, 255, 255, 0.249))';
        
        for (let i = 0; i < pass.length; i++) {
            if (pass[i] === '') {
                pass[i] = cuadro.id;
                break;
            }
        }

        if (pass.join('') === passCorrect.join('')) {
            doorOpen.play();
            passTrue = true;
        }
    });
});

puerta.addEventListener('click', () => {
    if (!passTrue) {
        knock.play();
        cuadros.forEach(cuadro => {
            cuadro.style.filter = '';
        });
        pass.fill('');
    } else {
        if (play) {
            socket.sendPassLevel(indexLevel)
        } else {
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level13')
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-ask');
    const items = document.querySelectorAll('.hover');
    const correctItems = Array.from(items).filter(item => item.getAttribute('data-correct') === 'true');
    let selectedCorrect = 0;


    function showMessage(message) {
        const messageContainer = document.getElementById('message-container');
        const mensajeError = document.getElementById('mensaje-error');
    
        mensajeError.textContent = message;
        messageContainer.classList.remove('hide'); 
        messageContainer.classList.add('show');
    
        setTimeout(() => {
            messageContainer.classList.add('hide');
            setTimeout(() => {
                messageContainer.classList.remove('show');
            }, 500);
        }, 2000); 
    }
    


    items.forEach(item => {
        item.addEventListener('click', () => {
            const isCorrect = item.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                if (!item.classList.contains('selected')) {
                    item.classList.add('selected');
                    item.style.borderColor = 'limegreen'; // Resaltar correctos
                    selectedCorrect++;

                   
                    if (selectedCorrect === correctItems.length) {
                        showMessage('Seleccionaste todos los elementos correctos!');
                        setTimeout(() => {
                            modal.style.display = 'none';
                        }, 2000);
                     
                    }
                }
            } else {
                showMessage('Seleccionaste un objeto incorrecto. Reintenta.');
                item.style.borderColor = 'red'; // Indicar incorrecto
                setTimeout(() => {
                    item.style.borderColor = ''; // Restaurar color después de un tiempo
                }, 1000);
            }
        });
    });

});

