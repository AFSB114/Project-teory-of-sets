window.addEventListener("DOMContentLoaded", function() {
    const backgroundMusic = document.getElementById("backgroundMusic");

    // Cargar el tiempo de reproducción guardado si existe
    const savedTime = localStorage.getItem("musicTime");
    if (savedTime) {
        backgroundMusic.currentTime = parseFloat(savedTime);
    }

    // Intenta reproducir la música en cuanto se cargue la página
    backgroundMusic.play().catch(error => {
        console.warn("La reproducción automática está bloqueada.");
    });

    // Guardar el tiempo de reproducción antes de cerrar o cambiar la página
    window.addEventListener("beforeunload", function() {
        localStorage.setItem("musicTime", backgroundMusic.currentTime);
    });
});
