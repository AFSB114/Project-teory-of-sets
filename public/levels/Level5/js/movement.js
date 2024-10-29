const character = document.getElementById('character');
const speed = 10;

const scenariosContainer = document.getElementById('scenarios')

let scenarios, numScenarios;
let height, width, limitLeft, limitRight;
let posX, posY;
const limitsCaracter = [character.clientWidth / 4.6, character.clientHeight * 2.24];
let camera = 0;
let animationFrameId = null;
let frame = 0;
const numsFrame = 3;
const widthFrame = character.clientWidth;
let keysPress = {};
const directionsKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS'];

let animationSpeed = 5; // Cuanto mayor sea este valor, más lenta será la animación
let animationCounter = 0; // Contador para controlar la velocidad de la animación

function initialize() {
    scenarios = document.getElementsByClassName('scenario');
    const rect = scenarios[0].getBoundingClientRect();
    height = rect.height;
    width = rect.width;
    limitsCaracter.push(height - character.clientHeight - character.clientHeight / 3.4);
    posY = character.getBoundingClientRect().y;
    numScenarios = scenarios.length;
    limitsCaracter.push(width * numScenarios - character.clientWidth - character.clientWidth / 4.6);
    limitLeft = width / 2 - character.clientWidth / 2;
    limitRight = width * numScenarios - width / 2 - character.clientWidth / 2;
    character.style.left = `${limitRight + character.clientWidth / 1}px`;
    posX = character.getBoundingClientRect().x - (window.innerWidth * 0.15);
    scenariosContainer.style.transform = `translateX(-${posX - width * 0.651}px)`;
}

function move() {
    if (keysPress['ArrowLeft'] || keysPress['KeyA']) {
        posX -= speed;
    }
    if (keysPress['ArrowRight'] || keysPress['KeyD']) {
        posX += speed;
    }
    // if (keysPress['ArrowUp'] || keysPress['KeyW']) {
    //     posY -= speed;
    // }
    // if (keysPress['ArrowDown'] || keysPress['KeyS']) {
    //     posY += speed;
    // }

    posX = Math.max(limitsCaracter[0], Math.min(limitsCaracter[3], posX));
    // posY = Math.max(limitsCaracter[1], Math.min(limitsCaracter[2], posY));

    if (posX > limitRight) {
        camera = limitRight - limitLeft;
    } else {
        camera = posX - limitLeft;
    }

    scenariosContainer.style.transform = `translateX(-${camera}px)`;

    character.style.left = `${posX}px`;
    // character.style.top = `${posY}px`;
}

function animation() {
    if (keysPress['KeyA'] || keysPress['ArrowLeft']) {
        character.style.transform = 'scaleX(-1)';
    } else if (keysPress['KeyD'] || keysPress['ArrowRight']) {
        character.style.transform = 'scaleX(1)';
    }

    animationCounter++;
    if (animationCounter >= animationSpeed) {
        character.style.backgroundPosition = `-${frame * widthFrame}px 0`;
        frame = (frame + 1) % numsFrame;
        animationCounter = 0;
    }
}

function loop() {
    move();
    animation();
    animationFrameId = requestAnimationFrame(loop);
}

function start() {
    if (!animationFrameId) {
        loop();
    }
}

function stop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        character.style.backgroundPosition = '0 0';
    }
}

document.addEventListener('keydown', (key) => {
    if (directionsKeys.includes(key.code)) {
        keysPress[key.code] = true;
        start();
    }
});

document.addEventListener('keyup', (key) => {
    if (directionsKeys.includes(key.code)) {
        keysPress[key.code] = false;
        if (!directionsKeys.some(keyPress => keysPress[keyPress])) {
            stop();
        }
    }
});

window.addEventListener('DOMContentLoaded', initialize);
