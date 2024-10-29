const menu = document.getElementById("menu");
const modalMenu = document.getElementById(`modal-${menu.id}`);
const continuar = document.getElementById('continuar');
const modalContent = modalMenu.children[0];
const help = document.getElementById('help');
const modalHelp = document.getElementsByClassName('modal-help');
const cajon = document.getElementById('cajon');
const lavaplatos = document.getElementById('lava-platos');
const ask = document.getElementById('modal-ask');
const nothings = document.getElementById('modal-nothing');
const muebleplatos = document.getElementById('mueble-platos');
const armarios = document.getElementById('armario');
const armario = document.getElementById('modal-armario');



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

const handleWindowClick = (event) => {
    if (event.target === modalMenu) {
        closeModal();
    } else if (event.target === modalHelp[0] || event.target === modalHelp[1]) {
        hideModal(event.target);
    } else if (event.target === ask) {
        hideAsk()
    }else if (event.target === nothings) {  
        hideNothing()
    }else if (event.target === armario){
        hideArmario()
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

cajon.addEventListener('click', () => {
    ask.style.display = 'block';
    ask.children[0].classList.add('show-ask');

    seeAsk = true
});

lavaplatos.addEventListener('click', () => {
    nothings.style.display = 'block';
    nothings.children[0].classList.add('show-nothing');

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

