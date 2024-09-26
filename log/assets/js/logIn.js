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
        })
        .catch(err => console.log(err))
})

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    // Quita los parámetros de la URL sin recargar la página
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (success === 'true') {
        document.getElementById('log-up-success').style.display = 'block';
        document.getElementById('log-up-success').classList.add('show');
        setTimeout(() => {
            document.getElementById('log-up-success').classList.remove('show');
            document.getElementById('log-up-success').classList.add('hide');

            setTimeout(() => {                
                document.getElementById('log-up-success').style.display = 'none';
                document.getElementById('error').classList.remove('hide')
            }, 500);
        }, 2500);
    }
})