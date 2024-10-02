let socket;

function conectar() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = function (event) {
        console.log("Conexión establecida");

        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        let code = urlParams.get('code');

        if (!code.includes('-')) {
            code = code.replace(/(\d{3})(\d{3})/g, '$1-$2');
        }
        
        document.getElementById('code').innerHTML = code;

        if (action === 'create') {
            createRoom(code);
        } else if (action === 'join') {
            joinRoom(code);
        };


        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);


        socket.onmessage = function (event) {

            const data = JSON.parse(event.data);

            if (data.action === 'createdRoom') {
                console.log(`Sala creada con codido ${data.code}`);

            } else if (data.action === 'joinRoom') {
                console.log(`Unido a la sala ${data.code}`);

            } else if (data.action === 'newMember') {
                alert(`Nuevo miembro ${data.id}`);

            } else if (data.action === 'error') {
                alert(data.mensaje);

            }
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(`Conexión cerrada limpiamente, código=${event.code} razón=${event.reason}`);
            } else {
                console.log('Conexión murió');
            }
        };

        socket.onerror = function (error) {
            console.log(`Error: ${error.message}`);
        };
    }

    function createRoom(cod) {
        socket.send(JSON.stringify({
            action: 'create',
            code: cod,
            id: getCookie('session_token')
        }));
    }

    function joinRoom(cod) {
        socket.send(JSON.stringify({
            action: 'join',
            code: cod,
            id: getCookie('session_token')
        }));
    }

}

function getCookie(nombre) {
    const nombreEQ = nombre + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nombreEQ) === 0) return c.substring(nombreEQ.length, c.length);
    }
    return null; // Si no se encuentra la cookie
}

document.addEventListener('DOMContentLoaded', conectar);