document.getElementById('logOut').addEventListener('submit', async (event) => {
    event.preventDefault();

    await fetch('../../php/controller/log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'logOut'
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'OK') {
                window.location.href = '../start/'
            }
        })
})