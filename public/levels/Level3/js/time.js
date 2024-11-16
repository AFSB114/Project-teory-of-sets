document.addEventListener("DOMContentLoaded", () => {
    startTimer(); // Inicia el temporizador al cargar la página
});

var timer = document.getElementById('timer');
var interval;

function startTimer() {
    let time = 0;
    interval = setInterval(() => {
        let minutes = String(Math.floor(time / 60)).padStart(2, '0');
        let seconds = String(time % 60).padStart(2, '0');
        timer.innerHTML = `${minutes}:${seconds}`;
        time++;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}