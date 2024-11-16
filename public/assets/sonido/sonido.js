window.addEventListener("DOMContentLoaded", function() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    const slider = document.getElementById("slider");

    // Cargar el tiempo de reproducción y el volumen guardado si existen
    const savedTime = localStorage.getItem("musicTime");
    const savedVolume = localStorage.getItem("musicVolume");
    if (savedTime) {
        backgroundMusic.currentTime = parseFloat(savedTime);
    }else{
        Error;
    }
    
    if (savedVolume) {
        backgroundMusic.volume = parseFloat(savedVolume);
        slider.value = savedVolume * 100;  // Actualiza el slider
    } else {
        // Configura un volumen inicial si no hay un volumen guardado
        backgroundMusic.volume = slider.value / 100;
    }

    // Intenta reproducir la música en cuanto se cargue la página
    backgroundMusic.play().catch(error => {
        console.warn("La reproducción automática está bloqueada.");
    });

    // Guardar el tiempo de reproducción antes de cerrar o cambiar la página
    window.addEventListener("beforeunload", function() {
        localStorage.setItem("musicTime", backgroundMusic.currentTime);
        localStorage.setItem("musicVolume", backgroundMusic.volume);  // Guarda el volumen actual
    });

    // Ajustar el volumen según el slider y guardarlo en localStorage
    slider.addEventListener("input", function() {
        const volume = slider.value / 100;
        backgroundMusic.volume = volume;
        localStorage.setItem("musicVolume", volume);  // Guarda el volumen actual
    });
});
