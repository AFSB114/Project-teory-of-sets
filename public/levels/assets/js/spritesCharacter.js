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
        if (res.data) {
            const character = res.data;
            mostrarPersonaje(character.spritesurl);
        } else {
            console.error("Error al obtener el personaje:", res.message);
            const characterDefault = 'femaleCharacter/sprites/femaleCharacter1.png';
            mostrarPersonaje(characterDefault);
        }
    } catch (error) {
        const characterDefault = 'femaleCharacter/sprites/femaleCharacter1.png';
        mostrarPersonaje(characterDefault);
    }
};

// Función para mostrar el sprite del personaje
const mostrarPersonaje = (sprites) => {
    const personajeDiv = document.getElementsByClassName('character')[0];
    if (personajeDiv) {
        personajeDiv.style.backgroundImage = `url('../../assets/character/${sprites}')`;
    } else {
        console.error("No se encontró el elemento con la clase 'character'");
    }
};

// Ejecutar la función cuando la página esté cargada
window.addEventListener('DOMContentLoaded', cargarPersonaje);