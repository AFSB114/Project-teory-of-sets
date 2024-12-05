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
const store = new StoreLevelCompleted(10)
store.addStartedLevel()

document.addEventListener("DOMContentLoaded", () => {
    const modalAsk = document.getElementById("modal-ask");
    const closeModal = document.getElementById("close-modal");
    const listaSeleccionada = document.getElementById("lista-seleccionada");

    const cuadro1 = document.getElementById("cuadro1");
    const cuadro2 = document.getElementById("cuadro2");
    const cuadro3 = document.getElementById("cuadro3");
    const cojin1 = document.getElementById("cojin1");
    const cojin2 = document.getElementById("cojin2");
    const cojin3 = document.getElementById("cojin3");
    const cojin4 = document.getElementById("cojin4");

    const itemsLista1 = ["Cuadro 1", "Cuadro 2", "Cuadro 3"];
    const itemsLista2 = ["Cojín 1", "Cojín 2", "Cojín 3", "Cojín 4"];
    let itemsSeleccionados = [];
    let listaActiva = null;
    let acertijoResuelto1 = false;
    let acertijoResuelto2 = false;

    function inicializarLista() {
        listaSeleccionada.innerHTML = '<ul></ul>';
        listaSeleccionada.style.display = 'block';
        modalAsk.style.display = 'none';
    }

    function actualizarListaSeleccionada() {
        const ul = listaSeleccionada.querySelector('ul');
        ul.innerHTML = itemsSeleccionados.map(item => `<li>${item}</li>`).join('');
    }

    function manejarSeleccion(item) {
        if (!itemsSeleccionados.includes(item)) {
            itemsSeleccionados.push(item);
            actualizarListaSeleccionada();
            verificarCompletitud();
        }
    }

    function verificarCompletitud() {
        if (listaActiva === 'lista1' && itemsSeleccionados.length === itemsLista1.length) {
            acertijoResuelto1 = true;
            desactivarLista(document.getElementById('lista1'));
            desactivarCuadros();
            console.log("Acertijo resuelto para lista1");
        } else if (listaActiva === 'lista2' && itemsSeleccionados.length === itemsLista2.length) {
            acertijoResuelto2 = true;
            desactivarLista(document.getElementById('lista2'));
            desactivarCojines();
            console.log("Acertijo resuelto para lista2");
        }

        if (acertijoResuelto1 && acertijoResuelto2) {
            const openSound = document.getElementById('open');
            if (openSound) openSound.play(); 
        }
    }

    function desactivarLista(lista) {
        lista.removeEventListener("click", inicializarLista1);
        lista.removeEventListener("click", inicializarLista2);
        lista.style.pointerEvents = 'none'; 
        lista.style.opacity = '0.5'; 
    }

    function desactivarCuadros() {
        cuadro1.removeEventListener("click", manejarCuadro1);
        cuadro2.removeEventListener("click", manejarCuadro2);
        cuadro3.removeEventListener("click", manejarCuadro3);
    }

    function desactivarCojines() {
        cojin1.removeEventListener("click", manejarCojin1);
        cojin2.removeEventListener("click", manejarCojin2);
        cojin3.removeEventListener("click", manejarCojin3);
        cojin4.removeEventListener("click", manejarCojin4);
    }

    function manejarCuadro1() {
        if (listaActiva === 'lista1') manejarSeleccion(itemsLista1[0]);
    }

    function manejarCuadro2() {
        if (listaActiva === 'lista1') manejarSeleccion(itemsLista1[1]);
    }

    function manejarCuadro3() {
        if (listaActiva === 'lista1') manejarSeleccion(itemsLista1[2]);
    }

    function manejarCojin1() {
        if (listaActiva === 'lista2') manejarSeleccion(itemsLista2[0]);
    }

    function manejarCojin2() {
        if (listaActiva === 'lista2') manejarSeleccion(itemsLista2[1]);
    }

    function manejarCojin3() {
        if (listaActiva === 'lista2') manejarSeleccion(itemsLista2[2]);
    }

    function manejarCojin4() {
        if (listaActiva === 'lista2') manejarSeleccion(itemsLista2[3]);
    }

    function inicializarLista1() {
        itemsSeleccionados = [];
        listaActiva = 'lista1';
        inicializarLista();
    }

    function inicializarLista2() {
        itemsSeleccionados = [];
        listaActiva = 'lista2';
        inicializarLista();
    }

    const puerta = document.getElementById('puerta');
    if (puerta) {
        puerta.addEventListener('click', function() {
            if (acertijoResuelto1 && acertijoResuelto2) {
                this.classList.add('abierta'); 
                store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level11')
            } else {
                const closeSound = document.getElementById('close');
                if (closeSound) closeSound.play();
            }
        });
    }

    const lista1 = document.getElementById('lista1');
    const lista2 = document.getElementById('lista2');

    if (lista1) lista1.addEventListener("click", inicializarLista1);
    if (lista2) lista2.addEventListener("click", inicializarLista2);

    if (cuadro1) cuadro1.addEventListener("click", manejarCuadro1);
    if (cuadro2) cuadro2.addEventListener("click", manejarCuadro2);
    if (cuadro3) cuadro3.addEventListener("click", manejarCuadro3);

    if (cojin1) cojin1.addEventListener("click", manejarCojin1);
    if (cojin2) cojin2.addEventListener("click", manejarCojin2);
    if (cojin3) cojin3.addEventListener("click", manejarCojin3);
    if (cojin4) cojin4.addEventListener("click", manejarCojin4);

    if (closeModal) {
        closeModal.addEventListener("click", (event) => {
            event.preventDefault();
            modalAsk.style.display = 'none';
        });
    }
});
