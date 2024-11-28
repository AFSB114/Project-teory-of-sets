const urlParams = new URLSearchParams(window.location.search)

const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
window.history.pushState({ path: newUrl }, '', newUrl)

let message = urlParams.get('message')

if (message) {
    showMessage('message', message)
}

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