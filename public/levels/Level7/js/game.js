const espejos = document.querySelectorAll('.espejo1, .espejo2, .espejo3, .espejo4, .cuadro1, .cuadro2, .cuadro3');
const puerta = document.getElementById('puerta');
let espejosSeleccionados = 0;

espejos.forEach((espejo) => {
    espejo.addEventListener('click', () => {
        // Agregar clase 'seleccionado' y 'activo' al elemento clicado
        if (!espejo.classList.contains('seleccionado')) {
            espejo.classList.add('seleccionado');
            espejo.classList.add('activo'); // Mantener el filtro activo
            espejosSeleccionados++;

            // Si todos los espejos y cuadros han sido seleccionados, abrir la puerta
            if (espejosSeleccionados === espejos.length) {
                abrirPuerta();
            }
        }
    });
});

function abrirPuerta() {
    puerta.classList.add('abierta');
    document.getElementById('open').play();
  
    puerta.addEventListener('click', irAlNivel8);
}

function irAlNivel8() {
    window.location.href = "../Level8/index.html"; 
}

document.getElementById('radio').addEventListener('click', function() {
    let audioElement = document.getElementById('radio-audio');
    audioElement.play().catch(error => {
        console.error("Error al intentar reproducir el audio:", error);
    });
});
