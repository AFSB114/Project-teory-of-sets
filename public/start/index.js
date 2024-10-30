const urlParams = new URLSearchParams(window.location.search);
const success = urlParams.get('success');
const name = urlParams.get('name');
const surname = urlParams.get('surname');

const data = urlParams.get('data');
const token  = urlParams.get('token');

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

async function sendData(data, token) { 
    fetch('../../php/controller/log.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            data,
            token
        })
    }).then(res => res.json())
    .then(res => {
        showMessage('message', res.message)
    })
    .catch(err => console.log(err))
}

if (success && name && surname) {
    let message = `Bienvenido <br>${name[0]}${name.slice(1).toLowerCase()} ${surname[0]}${surname.slice(1).toLowerCase()}`

    if (success === 'true') {
        showMessage("message", message)
    }
} else if (data && token) { 
    sendData(data, token)
}