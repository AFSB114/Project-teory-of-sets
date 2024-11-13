let today = new Date()
let dateMax = today.toISOString().split('T')[0]
let dateMin = new Date()
dateMin.setFullYear(today.getFullYear() - 100)
dateMin = dateMin.toISOString().split('T')[0]

const birthdate = document.getElementById('birthdate').children[1].children[0]
birthdate.setAttribute('min', dateMin)
birthdate.setAttribute('max', dateMax)

function showMessage(id, message) {
    document.getElementById(id).children[0].innerHTML = message
}

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let name = event.target[0].value.toUpperCase()
    let surname = event.target[1].value.toUpperCase()
    let nickname = event.target[2].value
    let birthday = event.target[3].value
    let email = event.target[4].value
    let password = event.target[5].value

    document.getElementById('btn-text').classList.add('spin');
    document.getElementById('btn-text').innerHTML = '';

    await fetch('../../../php/controller/sendEmail.php', {
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
            if (res.status === 'OK') {
                window.location.href = `../log_in/?message=Revisa tu correo para validar tu cuenta`;
            } else {
                document.getElementById('btn-text').classList.remove('spin');
                document.getElementById('btn-text').innerHTML = 'Registrar';
                showMessage('message', res.message)
            }
        })
        .catch(err => console.log(err))
})