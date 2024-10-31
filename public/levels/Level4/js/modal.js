const menu = document.getElementById("menu");
const modalMenu = document.getElementById(`modal-${menu.id}`);
const continuar = document.getElementById('continuar');
const modalContent = modalMenu.children[0];
const help = document.getElementById('help');
const modalHelp = document.getElementsByClassName('modal-help');
const horno = document.getElementById('horno');
const ask = document.getElementById('modal-ask');
const libro = document.getElementById('libro');
const ask2 = document.getElementById('modal-ask2');

let seeAsk = false;
let seeAsk2 = false;

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

const closeAskBtn = document.getElementById('closeAsk');
closeAskBtn.addEventListener('click', hideAsk);

const hideAsk2 = () => {
    ask2.children[0].classList.remove('show-ask2')
    ask2.children[0].classList.add('hide-ask2')
    setTimeout(() => {
        ask2.children[0].classList.remove('hide-ask2')
        ask2.style.display = 'none'
    }, 500)
}

const closeAskBtn2 = document.getElementById('closeAsk2');
closeAskBtn2.addEventListener('click', hideAsk2);

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

const hornoDiv = document.getElementById('horno');

horno.addEventListener('click', () => {
    ask.style.display = 'block';
    ask.children[0].classList.add('show-ask');
    hornoDiv.classList.add('apagado');

    seeAsk = true
});

libro.addEventListener('click', () => {
    ask2.style.display = 'block';
    ask2.children[0].classList.add('show-ask2');

    seeAsk2 = true
});