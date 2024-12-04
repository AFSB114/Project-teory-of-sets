import Socket from '../../assets/js/socket.js';

const urlParams = new URLSearchParams(window.location.search);
const play = JSON.parse(urlParams.get('play'));
const id = parseInt(urlParams.get('id'));
const indexLevel = parseInt(urlParams.get('indexLevel'));

let socket = null;

if (play) {
    socket = new Socket(`ws://localhost:8080?&id=${id}`)
    socket.connect()
}

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

import StoreLevelCompleted from '../../assets/js/storeLevelCompleted.js'
const store = new StoreLevelCompleted(2)
store.addStartedLevel()

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
            objeto.classList.add('newposition');
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

let Dragging = false;
let objetoArrastrado = null;
let posicionInicial = {};
let setX, setY;

objetos.forEach(objeto => {
    objeto.addEventListener('touchstart', (event) => {
        console.log('Arrastrando objeto');
        const touch = event.touches[0]; // Obtener el primer toque
        const rect = objeto.getBoundingClientRect();

        posicionInicial[objeto.id] = { left: objeto.style.left, top: objeto.style.top };
    
        // Calcular la diferencia entre la posición del toque y la posición del elemento
        setX = touch.clientX - rect.left;
        setY = touch.clientY - rect.top;
    
        Dragging = true;
        objetoArrastrado = objeto;
        event.preventDefault(); // Prevenir comportamientos por defecto
    });
});

[conjuntoA, conjuntoB].forEach((conjunto) => {
    document.addEventListener('touchmove', (event) => {
        if (Dragging) {
            const touch = event.touches[0];

            const leftPosition = touch.clientX - setX - 400; 
            const topPosition = touch.clientY - setY - 200;
    
            // Mover la llave a la posición calculada
            objetoArrastrado.style.position = 'absolute';
            objetoArrastrado.style.left = leftPosition + 'px';
            objetoArrastrado.style.top = topPosition + 'px';
    
            event.preventDefault();
        }
    });
    document.addEventListener('touchend', (event) => {
        if (Dragging) {
            console.log("Objeto soltado");
            const objetoId = objetoArrastrado.id;
            const touch = event.changedTouches[0];
    
            // Verificar en qué conjunto se ha soltado el objeto
            let conjuntoCorrecto = null;
    
            [conjuntoA, conjuntoB].forEach((conjunto) => {
                const conjuntoRect = conjunto.getBoundingClientRect();
                if (
                    touch.clientX >= conjuntoRect.left && touch.clientX <= conjuntoRect.right && 
                    touch.clientY >= conjuntoRect.top && touch.clientY <= conjuntoRect.bottom
                ) {
                    conjuntoCorrecto = conjunto;
                }
                else {
                    objetoArrastrado.style.left = posicionInicial[objetoId].left;
                    objetoArrastrado.style.top = posicionInicial[objetoId].top;
                }
            });
    
            if (conjuntoCorrecto) {
                // Verificar si el objeto pertenece al conjunto correcto
                if (
                    (conjuntoCorrecto === conjuntoA && espejos.includes(objetoId)) ||
                    (conjuntoCorrecto === conjuntoB && cuadros.includes(objetoId))
                ) {
                    conjuntoCorrecto.appendChild(objetoArrastrado);  // Añadir objeto al conjunto
                    objetosCorrectos++;  // Incrementar contador de objetos correctos
                    objetoArrastrado.classList.add('newposition1');
    
                    // Verificar si todos los objetos están en sus conjuntos correctos
                    if (objetosCorrectos === totalObjetos) {
                        abrirPuerta();  // Llamar a la función para abrir la puerta
                    }
                } else {
                    alert('Este objeto no pertenece a este conjunto.');
                    // Restablecer la posición inicial del objeto
                    objetoArrastrado.style.left = posicionInicial[objetoId].left;
                    objetoArrastrado.style.top = posicionInicial[objetoId].top;
                    }
            }
    
            Dragging = false;
            objetoArrastrado = null;

            event.preventDefault();
        }
    });
});


// Función para abrir la puerta
function abrirPuerta() {
    console.log('¡Todos los objetos están en su lugar! La puerta se abre.');
    doorOpen.play(); // Reproducir sonido de apertura
    puerta.classList.add('abrir-puerta'); // Aplicar animación

    // Permitir abrir la puerta al hacer clic
    puerta.addEventListener('click', () => {
        if (play) {
            socket.sendPassLevel(indexLevel)
        } else {
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level3')
        }
    });
}

// Control de clic en la puerta si no están todos los objetos
puerta.addEventListener('click', () => {
    if (objetosCorrectos < totalObjetos) {
        knock.play(); // Reproducir sonido de golpe
        alert('La puerta no se abrirá hasta que todos los objetos estén en sus conjuntos correctos.');
    }
});