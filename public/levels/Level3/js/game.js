import Socket from '../../assets/js/socket.js';
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

if (code) {

    let res = await fetch('../../../php/controller/log.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getData'
            })
        }
    ).then(res => res.json())

    // Función para obtener el valor de una cookie por su nombre
    function getCookie(nombre) {
        // Dividir las cookies en un array
        const cookies = document.cookie.split(';');

        // Iterar sobre las cookies
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim(); // Eliminar espacios en blanco

            // Verificar si la cookie comienza con el nombre deseado
            if (cookie.startsWith(nombre + '=')) {
                // Retornar el valor de la cookie
                return cookie.substring(nombre.length + 1); // Extraer el valor
            }
        }

        // Retornar null si la cookie no se encuentra
        return null;
    }

    const sessionId = getCookie('PHPSESSID')

    const socket = new Socket(`ws://localhost:8080?token=${sessionId}&id=${res.id}&nickname=${res.nickname}&code=${code}`)

    socket.connect()
}

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
        window.location.href = '../../levels/Level4/';
    }
});
