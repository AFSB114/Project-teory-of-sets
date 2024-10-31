const cargarPersonaje = async () => {
    try {
        const response = await fetch('../../../php/schema/getCharacter.php', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const res = await response.json();

        // Verificar si la respuesta fue exitosa
        if (res.status === 'success') {
            const character = res.data;
            seleccionPersonaje(character.id);
        } else {
            console.error("Error al seleccionar el personaje:", res.message);
        }
    } catch (error) {
        console.error("Error en fetch:", error);
    }
};

const seleccionPersonaje = (idCharacter) => {
    const personajeDiv = document.querySelectorAll('.character');
    personajeDiv.forEach(div => {
        if (parseInt(div.id) === idCharacter) {
            div.classList.add('select');
        } else {
            div.classList.remove('select');
        }
    })
};

// Ejecutar la función cuando la página esté cargada

window.addEventListener('DOMContentLoaded', cargarPersonaje);