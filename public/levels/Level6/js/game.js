
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
const store = new StoreLevelCompleted(6)
store.addStartedLevel()

const colorSelectA = document.getElementById('colorSelectA');
const colorSelectB = document.getElementById('colorSelectB');
const selectColorButton = document.getElementById('selectColorButton');
const items = document.querySelectorAll('.item');
const verifyButton = document.getElementById('verifyButton');
const errorMessage = document.getElementById('error-message');
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
const teatro = document.getElementById('teatro');

let selectedColorA = colorSelectA.value;
let selectedColorB = colorSelectB.value;
let activeColor = null;
let selectedItems = [];
let passTrue = false;

selectColorButton.addEventListener('click', () => {
    selectedColorA = colorSelectA.value;
    selectedColorB = colorSelectB.value;
    activeColor = selectedColorA; // Inicialmente, se selecciona el color A
    items.forEach(item => {
        item.style.borderColor = '';
        item.classList.remove('selected');
    });
    selectedItems = [];
    errorMessage.textContent = '';
});

items.forEach(item => {
    item.addEventListener('click', () => {
        const itemSet = item.getAttribute('data-set');
        if ((activeColor === selectedColorA && itemSet === 'A') ||
            (activeColor === selectedColorB && itemSet === 'B')) {
            if (selectedItems.includes(item)) {
                item.classList.remove('selected');
                item.style.borderColor = 'transparent';
                selectedItems = selectedItems.filter(i => i !== item);
            } else {
                item.classList.add('selected');
                item.style.borderColor = activeColor;
                selectedItems.push(item);
            }
        } else {
            errorMessage.textContent = 'Seleccionaste un objeto incorrecto. Reintenta.';
        }
    });
});

verifyButton.addEventListener('click', () => {

    const setAItems = Array.from(items).filter(item => item.getAttribute('data-set') === 'A');
    const setBItems = Array.from(items).filter(item => item.getAttribute('data-set') === 'B');

    const allASelected = setAItems.every(item => selectedItems.includes(item));
    const allBSelected = setBItems.every(item => selectedItems.includes(item));

    if (activeColor === selectedColorA && allASelected) {
        activeColor = selectedColorB;
        errorMessage.textContent = 'Ahora selecciona los objetos del Conjunto B.';
    } else if (activeColor === selectedColorB && allBSelected) {
        passTrue = true;
        doorOpen.play();
        errorMessage.textContent = '¡Selección correcta! Ahora puedes abrir la puerta.';

        // Abre el telón añadiendo la clase 'active' al elemento teatro
        teatro.classList.add('active');
    } else {
        errorMessage.textContent = 'No todos los elementos están seleccionados correctamente. Intenta de nuevo.';
    }
});

puerta.addEventListener('click', () => {
    if (!passTrue) {
        knock.play();
    } else {
        if (play) {
            socket.sendPassLevel(indexLevel)
        } else {
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level7')
        }
    }
});

