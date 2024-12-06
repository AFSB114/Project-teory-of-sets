function showMessage(message) {
    const container = document.getElementById('message-container'); 
    const messageDiv = document.getElementById('mensaje-error'); 

    if (!container || !messageDiv) {
        console.error("El contenedor o el mensaje no existen en el DOM.");
        return;
    }

  
    messageDiv.textContent = message;
    container.classList.add('show');
    container.style.display = 'block';

  
    setTimeout(() => {
        container.classList.add('hide');
        container.classList.remove('show');

        setTimeout(() => {
            container.style.display = 'none';
            container.classList.remove('hide');
        }, 500);
    }, 1000);
}


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        showMessage('Este objeto no pertenece a este conjunto.');
    }, 3000);
});
