document.getElementById('logOut').addEventListener('submit', async (event) => {
    event.preventDefault();

    await fetch('../../php/api/logOut.php')
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                window.location.href = './index.html'
            }
        })
})