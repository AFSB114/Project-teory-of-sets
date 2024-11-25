import Socket from '../../assets/js/socket.js';
import Game from '../../assets/js/game.js';

// Inicializar el juego cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
    new Game(0);
});

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

const cajaA = document.querySelector('.caja1');  // Caja de los Muebles
const cajaB = document.querySelector('.caja2');  //Caja de los Decorativos
const cajaC = document.querySelector('.caja3');  // Caja de  Leer/Beber
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');  
const doorOpen = document.getElementById('open');

const muebles = ['almohada', 'mesa', 'escritorio', 'sofas', 'silla'];
const decorativos = ['florero', 'cuadro', 'espejo', 'lampara'];
const leerBeber = ['revista', 'libro', 'copa', 'taza'];

let objetosCorrectos = 0;
const totalObjetos = muebles.length + decorativos.length + leerBeber.length;

let passTrue = false;

// Hacer que las cajas permitan el soltar los objetos
[cajaA, cajaB, cajaC].forEach(caja => {
    caja.addEventListener('dragover', (event) => {
        event.preventDefault(); 
        caja.classList.add('caja-hover'); 
    });

    caja.addEventListener('dragleave', () => {
        caja.classList.remove('caja-hover'); 
    });

    caja.addEventListener('drop', (event) => {
        event.preventDefault();
        const objetoId = event.dataTransfer.getData('text');
        const objeto = document.getElementById(objetoId);

        // Verifica si el objeto pertenece a la caja correcta
        if (
            (caja === cajaA && muebles.includes(objetoId)) ||
            (caja === cajaB && decorativos.includes(objetoId)) ||
            (caja === cajaC && leerBeber.includes(objetoId))
        ) {
            caja.appendChild(objeto);  // Añadir objeto a la caja
            objeto.style.display = 'none';  // Oculta el objeto para que no aparezca en la pantalla
            objetosCorrectos++;  // Incrementar contador de objetos correctos

            // Este condicional basicamente verifica si todos los objetos están en sus cajas correctas
            if (objetosCorrectos === totalObjetos) {
                abrirPuerta();  // Esto me llama la funcion para abrir la puerta
            }
        } else {
            alert('Este objeto no pertenece a esta caja.');
        }
        caja.classList.remove('caja-hover');  // Quitar estilo de hover
    });
});

// Hacer los objetos arrastrables
const objetos = document.querySelectorAll('[draggable="true"]');
objetos.forEach(objeto => {
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

[cajaA, cajaB, cajaC].forEach(caja => {
    document.addEventListener('touchmove', (event) => {
        if (Dragging) {
            const touch = event.touches[0];
            
            const leftPosition = touch.clientX - setX - 400; 
            const topPosition = touch.clientY - setY - 250;
    
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
    
            // Verificar en qué caja se ha soltado el objeto
            let cajaCorrecta = null;
    
            [cajaA, cajaB, cajaC].forEach(caja => {
                const cajaRect = caja.getBoundingClientRect();
                if (
                    touch.clientX >= cajaRect.left && touch.clientX <= cajaRect.right && 
                    touch.clientY >= cajaRect.top && touch.clientY <= cajaRect.bottom
                ) {
                    cajaCorrecta = caja;
                }
            });
    
            if (cajaCorrecta) {
                // Verificar si el objeto pertenece a la caja correcta
                if (
                    (cajaCorrecta === cajaA && muebles.includes(objetoId)) ||
                    (cajaCorrecta === cajaB && decorativos.includes(objetoId)) ||
                    (cajaCorrecta === cajaC && leerBeber.includes(objetoId))
                ) {
                    cajaCorrecta.appendChild(objetoArrastrado);  // Añadir objeto a la caja
                    objetoArrastrado.style.display = 'none';  // Ocultar el objeto
                    objetosCorrectos++;  // Incrementar contador de objetos correctos
    
                    // Verificar si todos los objetos están en sus cajas correctas
                    if (objetosCorrectos === totalObjetos) {
                        abrirPuerta();  // Llamar a la función para abrir la puerta
                    }
                } else {
                    alert('Este objeto no pertenece a esta caja.');
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

// Función para abrir la puerta cuando se colocan todos los objetos correctamente
function abrirPuerta() {
    console.log('¡Todos los objetos están en su lugar! La puerta se abre.');
    doorOpen.play(); 
    passTrue = true;  
    puerta.classList.add('abrir-puerta');  // Aplica animación al abrir la puerta
}

puerta.addEventListener('click', () => {
    if (!passTrue) {  
        knock.play();
        alert('La puerta no se abrirá hasta que todos los objetos estén en sus cajas correctas.');
    } else {
        if (play) {
            socket.sendPassLevel(indexLevel)
        } else {
            window.location.href = '../../levels/Level4/';
        }
    }
});