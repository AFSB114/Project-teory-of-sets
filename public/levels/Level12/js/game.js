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

document.addEventListener('DOMContentLoaded', (event) => {
    const modalAsk = document.getElementById('modal-ask');
    const modalEscoba = document.getElementById('modal-escoba');
    const escoba = document.getElementById('escoba');
    const papel = document.getElementById('papel');
    const selectCajonesButton = document.getElementById('selectCajonesButton');
    const cajon1 = document.getElementById('cajon1');
    const cajon2 = document.getElementById('cajon2');
    const cajon3 = document.getElementById('cajon3');
    const cajones = [cajon1, cajon2, cajon3];
    
    const puerta = document.getElementById('puerta');
    const closeSound = document.getElementById('close');
    const openSound = document.getElementById('open');

    let isPapelModalOpened = false;
    let isCajonesSelectable = false;
    let cajonesSelectionCompleted = false;
    let selectedCajones = [];


    function disableCajonSelection() {
        cajones.forEach(cajon => {
            cajon.classList.remove('cajon', 'cajon-hover', 'selected');
            cajon.style.pointerEvents = 'none';
        });
    }

    function enableCajonSelection() {
        cajones.forEach(cajon => {
            cajon.classList.add('cajon', 'cajon-hover');
            cajon.style.pointerEvents = 'auto';
        });
    }

    disableCajonSelection();

    papel.onclick = function() {
        if (!cajonesSelectionCompleted) {
            modalAsk.style.display = "block";
            isPapelModalOpened = true;
        }
    }


    escoba.onclick = function() {
        if (isPapelModalOpened && !cajonesSelectionCompleted) {
            modalEscoba.style.display = "block";
        }
    }

    selectCajonesButton.onclick = function() {
        modalEscoba.style.display = "none";
        enableCajonSelection();
        isCajonesSelectable = true;
        cajones.forEach(cajon => {

            cajon.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.classList.add('hover');
                }
            });

            cajon.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.classList.remove('hover');
                }
            })

            cajon.onclick = function() {
                if (!isCajonesSelectable) return;


                if (!this.classList.contains('selected')) {

                    if (selectedCajones.length < 3) {
                        this.classList.add('selected');
                        this.classList.remove('hover');
                        selectedCajones.push(this.id);
                    }
                }

                if (selectedCajones.length === 3) {
                    console.log('Selected cajones:', selectedCajones);

                    isCajonesSelectable = false;
                    cajonesSelectionCompleted = true;


                    if (openSound) openSound.play();
                }
            };
        });
    }

    puerta.addEventListener('click', () => {
        if (cajonesSelectionCompleted) {
            puerta.classList.add('abierta');
            window.location.href = "../Level13/index.html";
        } else {

            if (closeSound) closeSound.play();
        }
    });


    window.onclick = function(event) {
        if (!cajonesSelectionCompleted) {
            if (event.target == modalAsk) {
                modalAsk.style.display = "none";
            }
            if (event.target == modalEscoba) {
                modalEscoba.style.display = "none";
            }
        }
    }
});