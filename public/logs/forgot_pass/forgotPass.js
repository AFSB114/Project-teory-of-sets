document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let email = event.target[0].value

    await fetch('../../../php/controller/sendEmail.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            action: 'forgotPass',
            email
        })
    })
        .then(res => res.json())
        .then(res => {
            window.location.href = `../log_in/?message=${res.message}`
        })
        .catch(err => console.log(err))
})