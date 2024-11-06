const menu = document.getElementById("menu");
const modalMenu = document.getElementById(`modal-${menu.id}`);
const continuar = document.getElementById('continuar');
const modalContent = modalMenu.children[0];
const help = document.getElementById('help');
const modalHelp = document.getElementsByClassName('modal-help');
const cuadro = document.getElementById('cuadro');
const lavaplatos = document.getElementById('lava-platos');
const ask = document.getElementById('modal-ask');
const cajon = document.getElementById('cajon');
const cajones = document.getElementById('modal-cajones');
const despensa = document.getElementById('modal-despensa');
const nothings = document.getElementById('modal-nothing');
const muebleplatos = document.getElementById('mueble-platos');
const armarios = document.getElementById('armario');
const armario = document.getElementById('modal-armario');
const clave = document.getElementById('clave');
const claveModal = document.getElementById('modal-clave');


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
    ask.children[0].classList.remove('show-ask');
    ask.children[0].classList.add('hide-ask');

    // Después de la animación de ocultar el modal, ocultamos el modal y restauramos la posición del cuadro
    setTimeout(() => {
        ask.children[0].classList.remove('hide-ask');
        ask.style.display = 'none';
        cuadro.classList.remove('cuadro-caido'); 
    }, 500); 
};

const hideCajon = () => {
    cajones.children[0].classList.remove('show-cajones')
    cajones.children[0].classList.add('hide-cajones')
    setTimeout(() => {
        cajones.children[0].classList.remove('hide-cajones')
        cajones.style.display = 'none'
    }, 500)
}

const hideDespensa = () => {
    despensa.children[0].classList.remove('show-despensa')
    despensa.children[0].classList.add('hide-despensa')
    setTimeout(() => {
        despensa.children[0].classList.remove('hide-despensa')
        despensa.style.display = 'none'
    }, 500)
}

const hideNothing = () => {
    nothings.children[0].classList.remove('show-nothing')
    nothings.children[0].classList.add('hide-nothing')
    setTimeout(() => {
        nothings.children[0].classList.remove('hide-nothing')
        nothings.style.display = 'none'
    }, 500)
}

const hideArmario = () => {
    armario.children[0].classList.remove('show-armarios')
    armario.children[0].classList.add('hide-armarios')
    setTimeout(() => {
        armario.children[0].classList.remove('hide-armarios')
        armario.style.display = 'none'
    }, 500)
}

const hideClave = () => {
    claveModal.children[0].classList.remove('show-clave')
    claveModal.children[0].classList.add('hide-clave')
    setTimeout(() => {
        claveModal.children[0].classList.remove('hide-clave')
        claveModal.style.display = 'none'
    }, 500)
}

const handleWindowClick = (event) => {
    if (event.target === modalMenu) {
        closeModal();
    } else if (event.target === modalHelp[0] || event.target === modalHelp[1]) {
        hideModal(event.target);
    } else if (event.target === ask) {
        hideAsk();
    } else if (event.target === cajones) {
        hideCajon();
    }else if (event.target === despensa) {
        hideDespensa();
    } else if (event.target === nothings) {
        hideNothing();
    }else if (event.target === claveModal) {
        hideClave();
    } else if (event.target === armario) {
        hideArmario();
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

cuadro.addEventListener('click', () => {
    ask.style.display = 'block'; // Muestra el modal
    ask.children[0].classList.add('show-ask'); // Agrega la clase para mostrar la animación del modal

    cuadro.classList.add('cuadro-caido'); // Cambia la posición del cuadro al abrir el modal

    seeAsk = true;
});

cajon.addEventListener('click', () => {
    cajones.style.display = 'block';
    cajones.children[0].classList.add('show-cajones');

    seeAsk = true
});

lavaplatos.addEventListener('click', () => {
    despensa.style.display = 'block';
    despensa.children[0].classList.add('show-despensa');

    seeAsk = true
});

clave.addEventListener('click', () => {
    claveModal.style.display = 'block';
    claveModal.children[0].classList.add('show-clave');

    seeAsk = true
});


muebleplatos.addEventListener('click', () => {
    nothings.style.display = 'block';
    nothings.children[0].classList.add('show-nothing');

    seeAsk = true
});

armarios.addEventListener('click', () => {
    armario.style.display = 'block';
    armario.children[0].classList.add('show-armarios');

    seeAsk = true
});

