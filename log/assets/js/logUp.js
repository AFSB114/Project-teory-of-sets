document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let name = event.target[0].value.toUpperCase()
    let surname = event.target[1].value.toUpperCase()
    let nickname = event.target[2].value
    let birthday = event.target[3].value
    let email = event.target[4].value
    let password = event.target[5].value

    await fetch('../../php/controller/log.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            action: 'logUp',
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
            if (res.status === 'OK') {
                window.location.href = `./log_in.html?message=${res.message}`
            } else {
                showMessage('message', res.message)
            }
        })
        .catch(err => console.log(err))
})