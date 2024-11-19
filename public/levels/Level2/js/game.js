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

    const socket = new Socket(`ws://192.168.94.201:8080?token=${sessionId}&id=${res.id}&nickname=${res.nickname}&code=${code}`)

    socket.connect()
}

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
            // Posiciona el objeto en las coordenadas del evento drop
            const rect = conjunto.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;

            objeto.style.position = 'absolute';
            objeto.style.left = `${offsetX - objeto.offsetWidth / 2}px`;
            objeto.style.top = `${offsetY - objeto.offsetHeight / 2}px`;

            conjunto.appendChild(objeto);
            objetosCorrectos++;

            // Verificar si todos los objetos están en su lugar
            if (objetosCorrectos === totalObjetos) {
                abrirPuerta();
            }
        } else {
            alert('Este objeto no pertenece a este conjunto.');
        }

        conjunto.classList.remove('conjunto-hover');
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
