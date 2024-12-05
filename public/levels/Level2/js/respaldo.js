const conjuntoA = document.querySelector('.conjunto2'); // Conjunto de espejos
const conjuntoB = document.querySelector('.conjunto1'); // Conjunto de cuadros
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');

// Objetos para cada categoría
const espejos = ['espejo1', 'espejo2'];
const cuadros = ['cuadro1', 'cuadro2', 'cuadro3'];

let objetosCorrectos = 0;
const totalObjetos = espejos.length + cuadros.length;

[conjuntoA, conjuntoB].forEach((conjunto) => {
    conjunto.addEventListener('dragover', (event) => {
        event.preventDefault(); 
        conjunto.classList.add('conjunto-hover'); 
    });

    conjunto.addEventListener('dragleave', () => {
        conjunto.classList.remove('conjunto-hover'); 
    });

    conjunto.addEventListener('drop', (event) => {
        event.preventDefault();
        const objetoId = event.dataTransfer.getData('text');
        const objeto = document.getElementById(objetoId);

        if (
            (conjunto === conjuntoA && espejos.includes(objetoId)) ||
            (conjunto === conjuntoB && cuadros.includes(objetoId))
        ) {
            conjunto.appendChild(objeto); 
            objetosCorrectos++; 

            // Verificar si todos los objetos están en su lugar
            if (objetosCorrectos === totalObjetos) {
                abrirPuerta(); 
            }
        } else {
            alert('Este objeto no pertenece a este conjunto.');
        }

        
    });
});

// Hacer los objetos arrastrables
const objetos = document.querySelectorAll('[draggable="true"]');
objetos.forEach((objeto) => {
    objeto.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
    });
});

// Función para abrir la puerta
function abrirPuerta() {
    console.log('¡Todos los objetos están en su lugar! La puerta se abre.');
    doorOpen.play(); // Reproducir sonido de apertura
    puerta.classList.add('abrir-puerta'); // Aplicar animación

    // Permitir abrir la puerta al hacer clic
    puerta.addEventListener('click', () => {
        window.location.href = '../level3/index.html'; // Redirigir al siguiente nivel
    });
}

// Control de clic en la puerta si no están todos los objetos
puerta.addEventListener('click', () => {
    if (objetosCorrectos < totalObjetos) {
        knock.play(); // Reproducir sonido de golpe
        alert('La puerta no se abrirá hasta que todos los objetos estén en sus conjuntos correctos.');
    }
});
