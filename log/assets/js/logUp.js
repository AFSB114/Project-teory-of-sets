document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let name = event.target[0].value.toUpperCase()
    let surname = event.target[1].value.toUpperCase()
    let nickname = event.target[2].value
    let birthday = event.target[3].value
    let email = event.target[4].value
    let password = event.target[5].value

    await fetch('../../php/api/logUp.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            name,
            surname,
            nickname,
            birthday,
            email,
            password
        })
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))

    // if (resJson.nickname) {
    //     console.log('El nombre de usuario ya esta en uso')
    // } else if (resJson.email) {
    //     console.log('El email ya se encuentra vinculado a otra cuenta')
    // }

    // if (resJson.status === 'OK') {
    //     window.location.href = './logIn'
    // }
})