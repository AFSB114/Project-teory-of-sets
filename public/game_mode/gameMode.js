document.getElementById('multiplayer').addEventListener('click', async (event) => {
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
                window.location.href = `../multiplayer/intro_multiplayer/`
            } else {
                window.location.href = '../logs/log_in/?message=Debes estar logueado para jugar'
            }
        })
})

document.getElementById('singleplayer').addEventListener('click', async (event) => {
    event.preventDefault()

    await fetch('../../php/controller/level.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            action: 'lastLevel'
        })
    }).then(res => res.json())
        .then(res => {
            if (res.level === null) {
                window.location.href = `../intro_game/`
                return
            } else {
                window.location.href = `../levels/${res.level}/`
            }
        })
})