document.getElementById('multiplayer').addEventListener('click', async(event) => {
    event.preventDefault();

    await fetch('../../php/controller/log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'checkLogIn'
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.authenticated) {
                window.location.href = `./multiplayer/intro_multiplayer.html`
            } else {
                window.location.href = './log/log_in.html?message=Debes estar logueado para poder jugar multijugador'
            }
        })
})