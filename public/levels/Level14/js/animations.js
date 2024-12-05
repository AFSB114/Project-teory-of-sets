const clock = document.getElementById('reloj');
const numsFrameClock = 4;
const widthFrameClock = clock.clientWidth;
let frameClock = 0;
let animationCounterClock = 0;
const animationSpeedClock = 60; // Cuanto mayor sea este valor, más lenta será la animación
let isRunningClock = true;

function updateAnimationFrameClock() {
    clock.style.backgroundPosition = `-${frameClock * widthFrameClock}px 0`;
    frameClock = (frameClock + 1) % numsFrameClock;
}

function animationClock() {
    if (++animationCounterClock >= animationSpeedClock) {
        updateAnimationFrameClock();
        animationCounterClock = 0;
    }
}

function loopClock() {
    if (!isRunningClock) return; // Detener el bucle si isRunning es falso
    animationClock();
    requestAnimationFrame(loopClock);
}

function stopClock() {
    isRunningClock = false;
}

loopClock();

window.addEventListener('DOMContentLoaded', loopClock);