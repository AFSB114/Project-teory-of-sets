document.getElementById('join').addEventListener('submit', async (event) => {
    event.preventDefault();
    let code = document.getElementById('codigo').value;

    await fetch('../../../php/controller/room.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code
        })
    }).then(res => res.json())
        .then(res => {
        if (res.status) {
            window.location.href = `../room_guest/?code=${code}`
        } else {
            showMessage('message', res.message)
        }
    })

});