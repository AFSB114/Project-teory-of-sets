document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let nickname = event.target[0].value
    let password = event.target[1].value

    
    document.getElementById('btn-text').classList.add('spin');
    document.getElementById('btn-text').innerHTML = '';

    await fetch('../../../php/controller/log.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            action: 'logIn',
            nickname,
            password
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'OK') {
                window.location.href = `../../start/?success=true&name=${res.data.name}&surname=${res.data.surname}`
            } else {
                document.getElementById('btn-text').classList.remove('spin');
                document.getElementById('btn-text').innerHTML = 'Ingresar';
                showMessage('message', res.message)
            }
        })
        .catch(err => console.log(err))
})

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    if (message !== null) {

        // Quita los parámetros de la URL sin recargar la página
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);

        showMessage('message', message)
    }
})