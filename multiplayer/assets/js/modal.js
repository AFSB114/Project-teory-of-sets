function showModal(id) {
    document.getElementById(id).classList.add('show');
    document.getElementById(id).style.display = 'block';
}

function hideModal(id) {
    document.getElementById(id).classList.add('hide');
    document.getElementById(id).classList.remove('show');
    setTimeout(() => {
        document.getElementById(id).classList.remove('hide');
        document.getElementById(id).style.display = 'none';
    }, 500);
}

function showMessage(id, message) {
    document.getElementById(id).children[0].innerHTML = message
    showModal(id)
    setTimeout(() => {
        hideModal(id)
    }, 2500);
}