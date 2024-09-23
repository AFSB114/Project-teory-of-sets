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