const characterLoader = document.getElementById('animation-loader');
const numsFrameLoader = 4;
const widthFrameLoader = characterLoader.clientWidth;
let frameLoader = 0;
let animationCounterLoader = 0;
const animationSpeedLoader = 21; // Cuanto mayor sea este valor, más lenta será la animación
let isRunning = true;

function updateAnimationFrame() {
    characterLoader.style.backgroundPosition = `-${frameLoader * widthFrameLoader}px 0`;
    frameLoader = (frameLoader + 1) % numsFrameLoader;
}

function animationLoader() {
    if (++animationCounterLoader >= animationSpeedLoader) {
        updateAnimationFrame();
        animationCounterLoader = 0;
    }
}

function loopLoader() {
    if (!isRunning) return; // Detener el bucle si isRunning es falso
    animationLoader();
    requestAnimationFrame(loopLoader);
}

function stopLoader() {
    isRunning = false;
}

loopLoader();

window.addEventListener('load',() => {
    setTimeout(() => {
        document.getElementById('loader').classList.toggle('loader2');
        stopLoader();
    }, 1000);
});