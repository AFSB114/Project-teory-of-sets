import Socket from '../../assets/js/socket.js';

const urlParams = new URLSearchParams(window.location.search);
const play = JSON.parse(urlParams.get('play'));
const id = parseInt(urlParams.get('id'));
const indexLevel = parseInt(urlParams.get('indexLevel'));

let socket = null;

if (play) {
    socket = new Socket(`ws://localhost:8080?&id=${id}`)
    socket.connect()
    document.getElementById('restart').style.display = 'none'
    document.getElementById('map').style.display = 'none'
}

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

import StoreLevelCompleted from '../../assets/js/storeLevelCompleted.js'
const store = new StoreLevelCompleted(13)
store.addStartedLevel()

const paper = document.getElementById('paper');
const partidura = document.getElementById('partidura');
const gramofono = document.getElementById('gramofono');
const discoRosa = document.querySelector('.disco_rosa');
const discoMorado = document.querySelector('.disco_morado');
const discoAzul = document.querySelector('.disco_azul');
const disco1 = ['sol', 'la', 'si', 'sol', 'sol', 're', 'mi'];
const disco2 = ['re', 'la', 'si', 'fa-sostenido', 'fa-sostenido', 'sol', 'mi'];
const disco3 = ['mi', 'si', 'la', 'sol-sostenido', 'sol-sostenido-5', 'la', 'si'];
const notes = Array.from(document.getElementsByClassName('note'));
let passPiano = ['','','','','','','','',''];
const passPianoCorrect = ['mi-5', 're-sostenido-5', 'mi-5', 're-sostenido-5', 'mi-5', 'si', 're-5', 'do-5', 'la'];
let pass = ['', '', ''];
const passCorrect = ['A4', 'E4', 'B4'];
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
const fallFrame = document.getElementById('fall');
const keys = document.querySelectorAll('.key');
let passTrue = false;
let passPianoTrue = false;
let hasPlayed = false;

gramofono.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log("Sobre el gramofono");
});

gramofono.addEventListener('drop', (event) => {
    event.preventDefault();
    console.log("disco en el gramofono");
    const discoId = event.dataTransfer.getData('text');
    const discoElement = document.getElementById(discoId);
    gramofono.appendChild(keyElement);
    
   discoUsado = true;
    discoElement.style.display = 'none';
});

gramofono.addEventListener('dragover', (event) => {
    event.preventDefault();
    gramofono.classList.add('gramofono-hover');
});

gramofono.addEventListener('dragleave', () => {
    gramofono.classList.remove('gramofono-hover');
});

gramofono.addEventListener('drop', (event) => {
    event.preventDefault();
    const discoId = event.dataTransfer.getData('text');
    const disco = document.getElementById(discoId);

    // Verifica si el objeto pertenece a la gramofono correcta
    if ((discoId === 'disco_rosa') || (discoId === 'disco_morado') || (discoId === 'disco_azul')) {
        const discoGramofono = gramofono.querySelector('div');
        if (discoGramofono) {
            console.log("Gramofono ocupado");
        } else {
            console.log("Gramofono desocupado");
        }
        gramofono.classList.add('gramofonoOcupado');
        gramofono.appendChild(disco)
        disco.style.display = 'none';
        let indice = 0;

        let secuencia;
        if (discoId === 'disco_rosa') {
            secuencia = disco1;
        } else if (discoId === 'disco_morado') {
            secuencia = disco2;
        } else if (discoId === 'disco_azul') {
            secuencia = disco3;
        } else {
            console.log('no sé encontró ningún disco disponible');
        }

        const ondasDiv = document.querySelector('.ondas');

        function reproducirNotas() {
            const discoGramofono = gramofono.querySelector('div');
            if (!discoGramofono) {
                console.log("El disco fue removido, deteniendo la reproducción.");
                return; // Detener la función si no hay disco en el gramófono
            }
            if (indice < secuencia.length) {
                const audioSecuencia = document.getElementById(secuencia[indice]);
                ondasDiv.textContent = audioSecuencia.className;
                audioSecuencia.play();
    
                // Esperar 7 segundos antes de reproducir el siguiente audio
                setTimeout(() => {
                    audioSecuencia.pause();  // Pausar el audio después de 7 segundos (opcional)
                    audioSecuencia.currentTime = 0;  // Reiniciar el audio (opcional para futuras reproducciones)
                    ondasDiv.textContent = '';
                    indice++;
                    reproducirNotas();
                }, 2000); // 7000 ms = 7 segundos
            }
        }
    
        reproducirNotas(); // Iniciar la secuencia

    } else {
        alert('Este disco no está definido');
    }
    gramofono.classList.remove('gramofono-hover');  // Quitar estilo de hover
});


// Hacer los objetos arrastrables
const discos = document.querySelectorAll('[draggable="true"]');
discos.forEach(disco => {
    disco.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
    });
});


let Dragging = false;
let discoArrastrado = null;
let posicionInicial = {};
let setX, setY;


discos.forEach(disco => {
    disco.addEventListener('touchstart', (event) => {
        console.log('Arrastrando disco');
        const touch = event.touches[0]; // Obtener el primer toque
        const rect = disco.getBoundingClientRect();

        posicionInicial[disco.id] = { left: disco.style.left, top: disco.style.top };
    
        // Calcular la diferencia entre la posición del toque y la posición del elemento
        setX = touch.clientX - rect.left;
        setY = touch.clientY - rect.top;
    
        Dragging = true;
        discoArrastrado = disco;
        event.preventDefault(); // Prevenir comportamientos por defecto
    });
});

document.addEventListener('touchmove', (event) => {
    if (Dragging) {
        const touch = event.touches[0];
        
        const leftPosition = touch.clientX - setX - 400; 
        const topPosition = touch.clientY - setY - 5;

        discoArrastrado.style.position = 'absolute';
        discoArrastrado.style.left = leftPosition + 'px';
        discoArrastrado.style.top = topPosition + 'px';

        event.preventDefault();
    }
});

document.addEventListener('touchend', (event) => {
    if (Dragging) {
        console.log("disco soltado");
        const discoId = discoArrastrado.id;
        const touch = event.changedTouches[0];

        // Verificar en qué gramofono se ha soltado el disco
        let gramofonoCorrecto = null;

        const gramofonoRect = gramofono.getBoundingClientRect();
        if (
            touch.clientX >= gramofonoRect.left && touch.clientX <= gramofonoRect.right && 
            touch.clientY >= gramofonoRect.top && touch.clientY <= gramofonoRect.bottom
        ) {
            if ((discoId === 'disco_rosa') || (discoId === 'disco_morado') || (discoId === 'disco_azul')) {
                const discoGramofono = gramofono.querySelector('div');
                if (discoGramofono) {
                    console.log("Gramofono ocupado");
                } else {
                    console.log("Gramofono desocupado");
                }
                gramofono.classList.add('gramofonoOcupado');
                gramofono.appendChild(discoArrastrado);
                discoArrastrado.style.display = 'none';
    
                let indice = 0;
                let secuencia;
    
                if (discoId === 'disco_rosa') {
                    secuencia = disco1;
                } else if (discoId === 'disco_morado') {
                    secuencia = disco2;
                } else if (discoId === 'disco_azul') {
                    secuencia = disco3;
                } else {
                    console.log('Este disco no está definido');
                    return; // Detener la ejecución si el disco no es válido
                }
    
                const ondasDiv = document.querySelector('.ondas');
        
                function reproducirNotas() {
                    const discoGramofono = gramofono.querySelector('div');
                    if (!discoGramofono) {
                        console.log("El disco fue removido, deteniendo la reproducción.");
                        return; // Detener la función si no hay disco en el gramófono
                    }
                    if (indice < secuencia.length) {
                        const audioSecuencia = document.getElementById(secuencia[indice]);
                        ondasDiv.textContent = audioSecuencia.className;
                        audioSecuencia.play();
            
                        // Esperar 7 segundos antes de reproducir el siguiente audio
                        setTimeout(() => {
                            audioSecuencia.pause();  // Pausar el audio después de 7 segundos (opcional)
                            audioSecuencia.currentTime = 0;  // Reiniciar el audio (opcional para futuras reproducciones)
                            ondasDiv.textContent = '';
                            indice++;
                            reproducirNotas();
                        }, 2000); // 7000 ms = 7 segundos
                    }
                }
            
                reproducirNotas(); // Iniciar la secuencia
        
            } else {
                alert('Este disco no está definido');
            }
        }
        else {
            discoArrastrado.style.left = posicionInicial[discoId].left;
            discoArrastrado.style.top = posicionInicial[discoId].top;
        }

        Dragging = false;
        discoArrastrado = null;

        event.preventDefault();
    }
});




gramofono.addEventListener('click', () => {
    const discoGramofono = gramofono.querySelector('div');
    if (discoGramofono) {
        gramofono.classList.remove('gramofonoOcupado');
        // Si ya hay un disco, restaurar su posición inicial
        const discoId = discoGramofono.id;
        const posicionInicialDisco = posicionInicial[discoId]; // Obtener la posición inicial del disco

        if (posicionInicialDisco) {
            // Restaurar la posición inicial del disco
            discoGramofono.style.left = posicionInicialDisco.left;
            discoGramofono.style.top = posicionInicialDisco.top;
        }

        // Mover el disco fuera del gramófono al contenedor original
        const contenedorOriginal = document.getElementById('scenario4'); // Obtener el contenedor original por su ID
        contenedorOriginal.appendChild(discoGramofono); // Mover el disco fuera del gramófono
        discoGramofono.style.display = 'block'; // Mostrar el disco original de nuevo cuando salga
        gramofono.removeChild(discoGramofono);
    }
});


notes.forEach(note => {
    note.addEventListener('click', () => {
        note.style.filter = 'drop-shadow(0 0 2vh rgba(255, 255, 255, 0.249))';
        
        for (let i = 0; i < pass.length; i++) {
            if (pass[i] === '') {
                pass[i] = note.id;
                break;
            }
        }

        if (!hasPlayed && pass.length === passCorrect.length && pass.every(note => passCorrect.includes(note))) {
            fallFrame.play();
            passTrue = true;
            cuadro_nota.classList.add('cuadro-caido');
            hasPlayed = true;
        }
    });
});



keys.forEach((key) => {
    key.addEventListener('click', () => {
        // Encuentra el audio dentro de la tecla
        const audio = key.querySelector('audio');
        if (audio) {
            audio.currentTime = 0; // Reinicia el audio
            audio.play();         // Reproduce el audio
        }
        if (passTrue && partidura.display !== 'none') {
            for (let i = 0; i < passPiano.length; i++) {
                if (passPiano[i] === '') {
                    passPiano[i] = audio.id;
                    break;
                }
            }
            console.log(passPiano.join(''));
            console.log(passPianoCorrect.join(''));
    
            if (passPiano.join('') === passPianoCorrect.join('')) {
                doorOpen.play();
                passPianoTrue = true;
                stopTimer()
            }
        }
    });
});

paper.addEventListener('click', () => {
    paper.style.display = 'none';
    partidura.style.display = 'grid';
});

puerta.addEventListener('click', () => {
    if (!passPianoTrue) {
        knock.play();
        keys.forEach(key => {
            key.style.filter = '';
        });
        passPiano.fill('');
    } else {
        if (play) {
            socket.sendPassLevel(indexLevel)
        } else {
            store.addCompletedLevel(document.getElementById('timer').innerHTML, 'Level14')
        }
    }
});