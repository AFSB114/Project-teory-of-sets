const urlParams = new URLSearchParams(window.location.search);

const data = urlParams.get('data');
const key = urlParams.get('key');
const token = urlParams.get('token');

// Quita los parámetros de la URL sin recargar la página
const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.pushState({ path: newUrl }, '', newUrl);

async function sendData(password) {
    fetch('../../../php/controller/log.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            action: 'resetPass',
            data,
            key,
            token,
            password
        })
    }).then(res => res.json())
        .then(res => {
            if (res.status === 'OK') {
                window.location.href = `../log_in/?message=${res.message}`
            } else {
                showMessage('message', res.message)
            }
        })
        .catch(err => console.log(err))
}

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password1 = document.getElementById('passwords1').value;
    const password2 = document.getElementById('passwords2').value;

    if (password1 === password2) {
        sendData(password1)
    } else {
        showMessage('message', 'Las contraseñas no coinciden')
    }
})