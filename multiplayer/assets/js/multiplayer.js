document.getElementById('join').addEventListener('submit', async (event) => {
    event.preventDefault();
    let code = document.getElementById('codigo').value;

    window.location.href = `./room_guest.html?code=${code}`
});

window.addEventListener('load', async () => {
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
                window.location.href = '../log/log_in.html?message=Debes estar logueado para poder jugar multijugador'
            }
        })
})