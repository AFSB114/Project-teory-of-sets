const menu = document.getElementById("menu");
const modalMenu = document.getElementById(`modal-${menu.id}`);
const continuar = document.getElementById('continuar');
const modalContent = modalMenu.children[0];
const help = document.getElementById('help');
const modalHelp = document.getElementsByClassName('modal-help');
const computador = document.getElementById('herramientas');
const ask = document.getElementById('modal-ask');
const modalCoser = document.getElementById('modal-cosedora');
const coser = document.getElementById('maquinaCoser');

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

const hideCoser = () => {
    modalCoser.children[0].classList.remove('show-coser')
    modalCoser.children[0].classList.add('hide-coser')
    setTimeout(() => {
        modalCoser.children[0].classList.remove('hide-coser')
        modalCoser.style.display = 'none'
    }, 500)
}

const handleWindowClick = (event) => {
    if (event.target === modalMenu) {
        closeModal();
    } else if (event.target === modalHelp[0] || event.target === modalHelp[1]) {
        hideModal(event.target);
    } else if (event.target === ask) {
        hideAsk()
    }else if(event.target === modalCoser){
        hideCoser()
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

computador.addEventListener('click', () => {
    ask.style.display = 'block';
    ask.children[0].classList.add('show-ask');

    seeAsk = true
});

coser.addEventListener('click', () => {
    modalCoser.style.display = 'block';
    modalCoser.children[0].classList.add('show-coser');

    seeAsk = true
});