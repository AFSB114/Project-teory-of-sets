document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let email = event.target[0].value

    await fetch('../../php/api/forgotPass.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: email
        })
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))
        .finally(() => {
            window.location.href = './log_in.html'
        })
})