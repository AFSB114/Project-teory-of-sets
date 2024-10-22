const urlParams = new URLSearchParams(window.location.search);
const success = urlParams.get('success');
const name = urlParams.get('name');
const surname = urlParams.get('surname');

if (success && name && surname) {
    let message = `Bienvenido <br>${name[0]}${name.slice(1).toLowerCase()} ${surname[0]}${surname.slice(1).toLowerCase()}`

    if (success === 'true') {
        showMessage("message", message)
    }

    // Quita los parámetros de la URL sin recargar la página
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
}