document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault()

    let email = event.target[0].value

    const res = await fetch('../../api/logIn.php',{
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: email
        })
    })

    resJson = await res.json()
    console.log(resJson)

    if (resJson.ok) {
        console.log('Correo Enviado')
        // Enviar correo
    } else {
        console.log('Correo no enviado')
    }
})