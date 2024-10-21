document.getElementById('join').addEventListener('submit', async (event) => {
    event.preventDefault();
    let code = document.getElementById('codigo').value;

    window.location.href = `./room_guest.html?code=${code}`
});