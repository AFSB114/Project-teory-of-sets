const menu = document.getElementById("menu");
const modalMenu = document.getElementById(`modal-${menu.id}`);
const continuar = document.getElementById('continuar');
const modalContent = modalMenu.children[0];
const help = document.getElementById('help');
const modalHelp = document.getElementsByClassName('modal-help');
const reja = document.getElementById('reja');
const ask = document.getElementById('modal-ask');

let seeAsk = false;

const showModal = (modal) => {
    modal.style.display = 'block';
    modal.children[0].classList.add('show-help');
};

const hideModal = (modal) => {
    const content = modal.children[0];
    content.classList.remove('show-help');
    content.classList.add('hide-help');
    setTimeout(() => {
        content.classList.remove('hide-help');
        modal.style.display = 'none';
    }, 400);
};

const closeModal = () => {
    modalContent.classList.remove('show-menu');
    modalContent.classList.add('hide-menu');
    setTimeout(() => {
        modalContent.classList.remove('hide-menu');
        modalMenu.style.display = "none";
    }, 400);
};

const hideAsk = () => {
    ask.children[0].classList.remove('show-ask')
    ask.children[0].classList.add('hide-ask')
    setTimeout(() => {
        ask.children[0].classList.remove('hide-ask')
        ask.style.display = 'none'
    }, 500)
}

const handleWindowClick = (event) => {
    if (event.target === modalMenu) {
        closeModal();
    } else if (event.target === modalHelp[0] || event.target === modalHelp[1]) {
        hideModal(event.target);
    } else if (event.target === ask) {
        hideAsk()
    }
};

menu.addEventListener('click', () => {
    modalMenu.style.display = 'block';
    modalContent.classList.add('show-menu');
});

window.addEventListener('click', handleWindowClick);
continuar.addEventListener('click', closeModal);

help.addEventListener('click', () => {
    const modalToShow = seeAsk ? modalHelp[1] : modalHelp[0];
    showModal(modalToShow);
});

let llaveUsada = false;

key.addEventListener('dragstart', (event) => {
    console.log("Arrastrando llave");
    event.dataTransfer.setData('text', event.target.id);
});

reja.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log("Sobre la reja");
});

reja.addEventListener('drop', (event) => {
    event.preventDefault();
    console.log("Llave soltada en la reja");
    const keyId = event.dataTransfer.getData('text');
    const keyElement = document.getElementById(keyId);
    reja.appendChild(keyElement);
    
   llaveUsada = true;
    keyElement.style.display = 'none';

    ask.style.display = 'block';
    ask.children[0].classList.add('show-ask');
});

let isDragging = false;
let offsetX, offsetY;

key.addEventListener('touchstart', (event) => {
    console.log("Arrastrando llave");
    const touch = event.touches[0]; // Obtener el primer toque
    const rect = key.getBoundingClientRect();

    // Calcular la diferencia entre la posición del toque y la posición del elemento
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    isDragging = true;
    event.preventDefault(); // Prevenir comportamientos por defecto
});

document.addEventListener('touchmove', (event) => {
    if (isDragging) {
        const touch = event.touches[0];
        
        const leftPosition = touch.clientX - offsetX + 200; 
        const topPosition = touch.clientY - offsetY;

        // Mover la llave a la posición calculada
        key.style.position = 'absolute';
        key.style.left = leftPosition + 'px';
        key.style.top = topPosition + 'px';

        event.preventDefault();
    }
});

document.addEventListener('touchend', (event) => {
    if (isDragging) {
        console.log("Llave soltada");

        // Verificar si el área del "reja" ha sido tocada
        const rejaRect = reja.getBoundingClientRect();
        const touch = event.changedTouches[0];

        if (touch.clientX >= rejaRect.left && touch.clientX <= rejaRect.right && 
            touch.clientY >= rejaRect.top && touch.clientY <= rejaRect.bottom) {
            
            // Colocar la llave dentro de la reja
            reja.appendChild(key);
            key.style.position = 'relative'; // Restaurar la posición normal

            llaveUsada = true;
            key.style.display = 'none';

            ask.style.display = 'block';
            ask.children[0].classList.add('show-ask');
        }

        isDragging = false;
        event.preventDefault();
    }
});
reja.addEventListener('click', () => {
    if (llaveUsada) { 
        ask.style.display = 'block';
        ask.children[0].classList.add('show-ask');
    }else{
        console.log("No se usó la llave");
    }
});