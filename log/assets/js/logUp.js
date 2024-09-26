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
            if (res.status === 'success') {
                window.location.href = './log_in.html?success=true'
            } else {
                document.getElementById('error').children[0].innerHTML = res.message

                document.getElementById('error').style.display = 'block'
                document.getElementById('error').classList.add('show')
                setTimeout(() => {
                    document.getElementById('error').classList.remove('show')
                    document.getElementById('error').classList.add('hide')
                    setTimeout(() => {
                        document.getElementById('error').style.display = 'none'
                        document.getElementById('error').classList.remove('hide')
                    }, 500)
                }, 2500)
            }
        })
        .catch(err => console.log(err))
})