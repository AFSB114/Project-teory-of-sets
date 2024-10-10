class AddPlayer {

    constructor() {
        this.players = [];
        this.maxPlayers = 8;
    }
    
    updatePlayersList() {
        const listaJugadoresDiv = document.getElementById('listaJugadores');
        listaJugadoresDiv.innerHTML = '';  // Limpiar lista antes de actualizarla
        
        this.players.forEach(() => {
            const jugadorDiv = document.createElement('div');
            jugadorDiv.className = 'jugador';
            
            const cuadroDiv = document.createElement('div');
            cuadroDiv.className = 'cuadroPersonaje';
            
            const personajeDiv = document.createElement('div');
            personajeDiv.className = 'personaje';
            
            const nombreJugadorDiv = document.createElement('div');
            nombreJugadorDiv.className = 'nombreJugador';
            nombreJugadorDiv.textContent = "Jugador";
            
            jugadorDiv.appendChild(nombreJugadorDiv);
            cuadroDiv.appendChild(personajeDiv);
            jugadorDiv.appendChild(cuadroDiv);
            listaJugadoresDiv.appendChild(jugadorDiv);
        });
    }

    addPlayer() {
        if (this.players.length < this.maxPlayers) {
            this.players.push('');
    
            this.updatePlayersList();
        }
        else {
            null
        }
    }
}

export default AddPlayer