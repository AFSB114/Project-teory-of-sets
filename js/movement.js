const objeto = document.getElementById("objeto");
const escenario1 = document.getElementById("escenario1");
const escenario2 = document.getElementById("escenario2");

const altoVentana = escenario1.getBoundingClientRect().height
const anchoVentana = escenario1.getBoundingClientRect().width

let posX = 100;
let posY = 280;
const velocidad = 5; // Velocidad de movimiento (pixeles por tiempo)

let numEscenarios = 2

const limiteIzq = anchoVentana / 2 - 47;
const limiteDer = anchoVentana * ((1 + 2 * (numEscenarios - 1)) / 2) - 47;
let camara = 0;

function mover() {


    if (teclasPulsadas['ArrowLeft'] || teclasPulsadas['KeyA']) {
        posX -= velocidad;
    } else {
        null
    }
    if (teclasPulsadas['ArrowRight'] || teclasPulsadas['KeyD']) {
        posX += velocidad;
    } else {
        null
    }
    if (teclasPulsadas['ArrowUp'] || teclasPulsadas['KeyW']) {
        posY -= velocidad;
    } else {
        null
    }
    if (teclasPulsadas['ArrowDown'] || teclasPulsadas['KeyS']) {
        posY += velocidad;
    } else {
        null
    }

    // límites de movimiento
    posX = Math.max(55, Math.min(anchoVentana * numEscenarios - 203, posX));
    posY = Math.max(310, Math.min(altoVentana - 365, posY));

    // seguimiento de camara
    if (posX >= limiteIzq && posX <= limiteDer) {
        camara = posX - limiteIzq;
    } else if (posX <= limiteIzq) {
        camara = 0;
    } else if (posX >= limiteDer) {
        camara = limiteDer - limiteIzq;
    }

    // Movimiento de objeto
    objeto.style.left = `${posX - camara}px`;
    objeto.style.top = `${posY}px`;

    // movimiento escenarios(camara)
    escenario1.style.left = -camara + 'px';
    escenario2.style.left = (anchoVentana - camara) + 'px';
}

let intervalId1 = null;
let intervalId2 = null;

let currentFrame = 0;
const frameCount = 4;
const frameWidth = 166.25;
const velocidadAni = 50;

function updateFrame() {
    if (teclasPulsadas['KeyA'] || teclasPulsadas['ArrowLeft']) {
        objeto.style.transform = 'scaleX(-1)'
    } else if (teclasPulsadas['KeyD'] || teclasPulsadas['ArrowRight']) {
        objeto.style.transform = 'scaleX(1)'
    }
    objeto.style.backgroundPosition = `-${currentFrame * frameWidth}px 0px`;
    currentFrame = (currentFrame + 1) % frameCount;
}


function iniciarMovimiento() {
    if (!intervalId1) {
        intervalId2 = setInterval(updateFrame, velocidadAni);
        intervalId1 = setInterval(mover, 1000 / 120); // 120 FPS
    }
}

function detenerMovimiento() {
    if (intervalId1 !== null) {
        clearInterval(intervalId1);
        intervalId1 = null;
        clearInterval(intervalId2);
        intervalId2 = null;
        objeto.style.backgroundPosition = `0 0`
    }
}

let teclasPulsadas = {};
const flechas = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS'];

document.addEventListener('keydown', (evento) => {
    if (flechas.includes(evento.code)) {
        teclasPulsadas[evento.code] = true;
        iniciarMovimiento();
    }
});

document.addEventListener('keyup', (evento) => {
    if (flechas.includes(evento.code)) {
        teclasPulsadas[evento.code] = false;
        if (!flechas.some(tecla => teclasPulsadas[tecla])) {
            detenerMovimiento();
        }
    }
});
