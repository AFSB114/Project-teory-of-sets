import Socket from '../../assets/js/socket.js';
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

if (code) {

    let res = await fetch('../../../php/controller/log.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getData'
            })
        }
    ).then(res => res.json())

    // Función para obtener el valor de una cookie por su nombre
    function getCookie(nombre) {
        // Dividir las cookies en un array
        const cookies = document.cookie.split(';');

        // Iterar sobre las cookies
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim(); // Eliminar espacios en blanco

            // Verificar si la cookie comienza con el nombre deseado
            if (cookie.startsWith(nombre + '=')) {
                // Retornar el valor de la cookie
                return cookie.substring(nombre.length + 1); // Extraer el valor
            }
        }

        // Retornar null si la cookie no se encuentra
        return null;
    }

    const sessionId = getCookie('PHPSESSID')

    const socket = new Socket(`ws://192.168.94.201:8080?token=${sessionId}&id=${res.id}&nickname=${res.nickname}&code=${code}`)

    socket.connect()
}

import StoreLevelCompleted from '../../assets/js/storeLevelCompleted.js'
const store = new StoreLevelCompleted(1)
store.addStartedLevel()
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
const error = document.getElementById('error');
const correct = document.getElementById('correct');

puerta.addEventListener('click', () => {
    if (!passTrue) {
        knock.play();
    } else {
        store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level2')
    }
});

const botellas = document.getElementById('botellas');
const silla = document.getElementById('silla');
const florero = document.getElementById('florero');

const images = [document.getElementById('botellas'),document.getElementById('silla'),document.getElementById('florero')];

const numeros = document.getElementsByClassName('btn-numbers');

let count = 1;
let correctPass = [4, 3, 1]
let pass = []
let passTrue = false;

for (const num of numeros) {
    num.addEventListener('click', () => {
        if (count === 1) {
            images[0].classList.add('num');
            images[0].innerHTML = num.innerHTML;
            pass.push(parseInt(num.innerHTML));
            count++;
        } else if (count === 2) {
            images[1].classList.add('num');
            images[1].innerHTML = num.innerHTML;
            pass.push(parseInt(num.innerHTML));
            count++
        } else if (count === 3) {
            images[2].classList.add('num');
            images[2].innerHTML = num.innerHTML;
            pass.push(parseInt(num.innerHTML))
            console.log(pass);
            checkPass();
        }
    });
}

function checkPass() {
    if (JSON.stringify(pass) !== JSON.stringify(correctPass)) {
        error.play()
        images.forEach(image => {
            image.classList.add('incorrect');
            setTimeout(() => {
                image.classList.remove('incorrect');
                image.innerHTML = '';
                image.classList.remove('num');
            }, 500);
            
        });
        count = 1;
        pass = [];
    } else {
        images.forEach(image => {
            image.classList.add('correct');
        })
        doorOpen.play();
        passTrue = true;
        correct.play();
        stopTimer()
    }
}