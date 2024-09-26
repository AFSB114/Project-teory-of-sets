document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let username = event.target[0].value
    let password = event.target[1].value

    await fetch('../../php/api/logIn.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if (res.status === 'success') {
                window.location.href = `../../?success=true&name=${res.data.name}&surname=${res.data.surname}`
            } else {
                showMessage('message', res.message)
            }
        })
        .catch(err => console.log(err))
})

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const message = urlParams.get('message');

    // Quita los parámetros de la URL sin recargar la página
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (success === 'true') {
        showMessage('message', message)
    }
})