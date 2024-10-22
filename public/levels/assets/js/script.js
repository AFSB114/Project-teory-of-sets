async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Quita los parámetros de la URL sin recargar la página
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Función para obtener el valor de una cookie por su nombre
    function getCookie(nombre) {
        // Dividir las cookies en un array
        const cookies = document.cookie.split(';');

        // Iterar sobre las cookies
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim(); // Eliminar espacios en blanco

            // Verificar si la cookie comienza con el nombre deseado
            if (cookie.startsWith(nombre + '=')) {
                // Retornar el valor de la cookie
                return cookie.substring(nombre.length + 1); // Extraer el valor
            }
        }

        // Retornar null si la cookie no se encuentra
        return null;
    }

    const sessionId = getCookie('PHPSESSID')

    if (code) {

        let res = await fetch('../../../php/controller/log.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'getData'
                })
            }
        ).then(res => res.json())

        const socket = new WebSocket(`ws://localhost:8080?token=${sessionId}&id=${res.id}&nickname=${res.nickname}&code=${code}`)

        socket.onopen = () => {
            console.log('Conectado')
        }
    }
}

init()