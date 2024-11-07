async function cambiarPersonaje(character_id) {
    await fetch('../../../php/schema/characterSelect.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ character_id })
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            window.location.href = `../settings/`;
        } else {
            showMessage('message', res.message);
        }
    })
    .catch(err => console.log(err));
}