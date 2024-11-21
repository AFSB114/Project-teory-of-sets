document.querySelector('.btn').addEventListener('click', async (event) => {
    event.preventDefault()

    await fetch('../../../php/controller/log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'see_int_mlt'
        })
    }).then(res => res.json())
        .then(res => {
            if (res.status === 'OK') {
                window.location.href = '../start/'
            }
        })
})