document.getElementById("options").addEventListener("submit", (e) => {
    e.preventDefault();
    let options = document.getElementById("options");

    let numLevels = options.children[0].children[0].children[1].value;
    let timePerLevel = options.children[0].children[1].children[1].value;
    let difficulty = options.children[0].children[2].children[1].value;

    window.location.href = `./room_admin.html?&numLevels=${numLevels}&timePerLevel=${timePerLevel}`

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