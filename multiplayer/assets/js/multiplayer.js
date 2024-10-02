document.getElementById('join').addEventListener('submit', (e) => {
    e.preventDefault();
    const codigo = document.getElementById('codigo').value;
    
    window.location.href = `./room_guest.html?code=${codigo}&action=join`
});