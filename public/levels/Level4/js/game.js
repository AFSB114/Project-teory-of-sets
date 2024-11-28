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
const store = new StoreLevelCompleted(4)
store.addStartedLevel()

const stickers = Array.from(document.getElementsByClassName('sticker'));
let passSticker = ['', '', ''];
const passStickerCorrect = ['stickerNino', 'stickerNina', 'stickerMontana'];
const cuadros = Array.from(document.getElementsByClassName('cuadro'));
let pass = [''];
const passCorrect = ['cuadro-1'];
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
let passStickerTrue = false;
let passTrue = false;

stickers.forEach(sticker => {
    sticker.addEventListener('click', () => {
        sticker.classList.add('desactivado');

        for (let i = 0; i < passSticker.length; i++) {
            if (passSticker[i] === '') {
                passSticker[i] = sticker.id;
                break;
            }
        }

        if (passSticker.join('') === passStickerCorrect.join('')) {
            cuadros.forEach(div => {
                if (div.classList.length === 3) {
                    div.classList.remove(div.classList.item(div.classList.length - 1)); // Elimina la última clase
                    div.classList.add('hover');
                }
            });
            cuadros.forEach((div, index) => {
                div.id = `cuadro-${index + 1}`; // Asigna un id único como "cuadro1", "cuadro2", etc.
            });
            passStickerTrue = true;
        }
    });
});

horno.addEventListener('click', () => {
    if (!passStickerTrue) {
        stickers.forEach(sticker => {
            sticker.classList.remove('desactivado');
        });
        passSticker.fill('');
    } else {
        null;
    }
});

cuadros.forEach(cuadro => {
    cuadro.addEventListener('click', () => {
        console.log(cuadro.id);
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
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level5')
        }
    }
});