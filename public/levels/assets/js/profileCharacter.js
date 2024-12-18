const cargarPersonaje = async () => {
    try {
        const response = await fetch('../../php/schema/getCharacter.php', {
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
            mostrarPersonaje(character.profileurl);
        } else {
            console.error("Error al obtener el personaje:", res.message);
        }
    } catch (error) {
        const characterDefault = 'femaleCharacter/femaleCharacterProfile1.png';
        mostrarPersonaje(characterDefault);
    }
};

// Función para mostrar el sprite del personaje
const mostrarPersonaje = (profile) => {
    const personajeDiv = document.getElementsByClassName('character')[0];
    if (personajeDiv) {
        personajeDiv.style.backgroundImage = `url('../assets/character/${profile}')`;
    } else {
        console.error("No se encontró el elemento con la clase 'character'");
    }
};

// Ejecutar la función cuando la página esté cargada
window.addEventListener('DOMContentLoaded', cargarPersonaje);