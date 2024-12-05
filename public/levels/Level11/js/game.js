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
const store = new StoreLevelCompleted(11)
store.addStartedLevel()

document.addEventListener('DOMContentLoaded', () => {
    const noteModal = document.querySelector('.contenido-modal-ask');
    const buscarButton = document.querySelector('#buscar');
    const allItems = document.querySelectorAll('.sofa, .objeto1-2, .objeto1-3');
    let itemsSelected = false; 
    let lampObjectsSelected = false;
    let clockSolved = false;
    let gameCompleted = false;

    const relojElement = document.querySelector('#reloj');
    const modalReloj = document.getElementById('modal-reloj');
    const relojImagen = document.getElementById('relojImagen');
    const seleccionarHoraBtn = document.getElementById('seleccionarHora');
    const puerta = document.getElementById('puerta');
    const closeSound = document.getElementById('close');
    const openSound = document.getElementById('open');

    const imagenesHoras = [
        'images/hora1.png', 'images/hora2.png', 'images/hora3.png', 'images/hora4.png', 
        'images/hora5.png', 'images/hora6.png', 'images/hora7.png', 'images/hora8.png', 
        'images/hora9.png', 'images/hora10.png', 'images/hora11.png', 'images/hora12.png'
    ];

    let horaActual = 0; 

    if (relojElement) relojElement.classList.add('non-selectable');

    function openNoteModal() {
        if (!itemsSelected) { 
            if (noteModal) noteModal.style.display = 'block';
            disableSelection();
        }
    }

    function closeNoteModal(event) {
        if (event.target === noteModal || event.target.classList.contains('btn-close')) {
            if (noteModal) noteModal.style.display = 'none';
        }
    }

    function disableSelection() {
        allItems.forEach(item => item.classList.add('non-selectable'));
    }

    function enableSelection() {
        allItems.forEach(item => {
            item.classList.remove('non-selectable');
            item.addEventListener('click', selectNoteItem);
            item.classList.add('highlight-enabled'); 
        });
    }

    function selectNoteItem(event) {
        const selectedItems = document.querySelectorAll('.selected');
        
        if (selectedItems.length < 3 && !event.currentTarget.classList.contains('selected')) {
            event.currentTarget.classList.add('selected');
            event.currentTarget.style.filter = 'brightness(0.6)'; 
            
            event.currentTarget.removeEventListener('click', selectNoteItem);
            
            checkNoteSelectedItems(); 
        }
    }

    function checkNoteSelectedItems() {
        const selectedItems = document.querySelectorAll('.selected');
        if (selectedItems.length === 3) {
            itemsSelected = true; 
            enableLamp(); 
        }
    }

    const note = document.querySelector('.nota');
    if (note) note.addEventListener('click', openNoteModal);

    if (noteModal) noteModal.addEventListener('click', closeNoteModal);

    if (buscarButton) buscarButton.addEventListener('click', () => {
        closeNoteModal({ target: noteModal });
        enableSelection(); 
    });

    function enableLamp() {
        const lamp = document.getElementById('lampara');
        if (lamp) {
            lamp.classList.add('highlight-enabled');
            lamp.addEventListener('click', showLampModal);
        }
    }

    function showLampModal() {
        const lampModal = document.getElementById('lamp-modal');
        if (lampModal) lampModal.style.display = 'flex';
    }

    const buscarBtn = document.querySelector('.btn-close-lamp');
    const objeto1 = document.querySelector('.objeto1');
    const deco = document.querySelector('.deco');
    const cuadroo = document.querySelector('.cuadroo');

    const lampSeleccionables = [objeto1, deco, cuadroo];
    let lampSeleccionHabilitada = false;

    function checkLampObjects() {
        const selectedLampObjects = lampSeleccionables.filter(element => 
            element.classList.contains('selected')
        );
        
        if (selectedLampObjects.length === 3) {
            lampObjectsSelected = true;
            
            lampSeleccionables.forEach(element => {
                if (element.classList.contains('selected')) {
                    element.removeEventListener('click', selectLampObject);
                }
            });
            
            if (itemsSelected && relojElement) {
                relojElement.classList.remove('non-selectable');
                relojElement.classList.add('highlight-enabled');
            }
        }
    }

    function selectLampObject(event) {
        const selectedLampObjects = lampSeleccionables.filter(element => 
            element.classList.contains('selected')
        );

        if (selectedLampObjects.length < 3 && !event.currentTarget.classList.contains('selected')) {
            event.currentTarget.classList.add('selected');
            event.currentTarget.style.filter = 'brightness(0.6)'; 
            
            event.currentTarget.removeEventListener('click', selectLampObject);
            
            checkLampObjects();
        }
    }

    if (buscarBtn) buscarBtn.addEventListener('click', () => {
        lampSeleccionHabilitada = true;
        lampSeleccionables.forEach(element => {
            element.classList.add('highlight-enabled');
            element.addEventListener('click', selectLampObject);
        });
        const modal1 = document.querySelector('.modal1');
        if (modal1) modal1.style.display = 'none';
    });

    function closeLampModal() {
        const lampModal = document.getElementById('lamp-modal');
        if (lampModal) lampModal.style.display = 'none';
    }

    const lampModal = document.getElementById('lamp-modal');
    const closeLampButton = lampModal ? lampModal.querySelector('.btn-close-lamp') : null;
    if (closeLampButton) closeLampButton.addEventListener('click', closeLampModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === lampModal) {
            closeLampModal();
        }
    });

    if (puerta) puerta.addEventListener('click', () => {
        if (gameCompleted) {
            window.location.href = "../Level12/index.html";
        } else {
            if (closeSound) closeSound.play();  
        }
    });

    function cambiarImagenHora() {
        const img = document.createElement('img');
        img.src = imagenesHoras[horaActual];
        img.alt = `Hora ${horaActual + 1}`;
        
        if (relojImagen) {
            relojImagen.innerHTML = '';
            relojImagen.appendChild(img);
        }

        img.addEventListener('click', () => {
            horaActual = (horaActual + 1) % imagenesHoras.length; 
            cambiarImagenHora();
        });
    }

    function checkGameCompletion() {
        if (itemsSelected && lampObjectsSelected && clockSolved) {
            gameCompleted = true; 
            abrirPuerta();
        }
    }

    function abrirPuerta() {
        if (puerta) {
            puerta.classList.add('abierta');  
            if (openSound) openSound.play();  
        }
    }

    function seleccionarHora() {
        if (horaActual === 6) {
            clockSolved = true;
            if (modalReloj) modalReloj.style.display = 'none';

            if (openSound) openSound.play();
            
            if (relojElement) relojElement.classList.add('solved');
            
            checkGameCompletion();
        } else {
            const errorModal = document.getElementById('error-modal');
            if (errorModal) {
                errorModal.style.display = 'block';
                setTimeout(() => {
                    errorModal.style.display = 'none';
                }, 2000);
            }
        }
    }

    if (relojElement) relojElement.addEventListener('click', (event) => {
        if (!relojElement.classList.contains('non-selectable')) {
            if (modalReloj) modalReloj.style.display = 'flex'; 
            horaActual = 0; 
            cambiarImagenHora();
        }
    });

    if (seleccionarHoraBtn) seleccionarHoraBtn.addEventListener('click', seleccionarHora);

    const closeRelojModal = document.getElementById('closeRelojModal');
    if (closeRelojModal) closeRelojModal.addEventListener('click', () => {
        if (modalReloj) modalReloj.style.display = 'none'; 
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalReloj) {
            if (modalReloj) modalReloj.style.display = 'none';
        }
    });
});
