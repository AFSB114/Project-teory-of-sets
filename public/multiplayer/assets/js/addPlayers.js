class Players {

    constructor() {
        this.players = [];
        this.playersRanking = [];
        this.maxPlayers = 8;
    }

    updatePlayersList() {
        const listaJugadoresDiv = document.getElementById('listaJugadores');
        listaJugadoresDiv.innerHTML = '';  // Limpiar lista antes de actualizarla

        this.players.forEach((data) => {
            const jugadorDiv = document.createElement('div');
            jugadorDiv.className = 'jugador';

            const cuadroDiv = document.createElement('div');
            cuadroDiv.className = 'cuadroPersonaje';

            const personajeDiv = document.createElement('div');
            personajeDiv.className = 'personaje';
            personajeDiv.style.backgroundImage = `url('../../assets/character/${data.avatar}')`;

            const nombreJugadorDiv = document.createElement('div');
            nombreJugadorDiv.className = 'nombreJugador';
            nombreJugadorDiv.textContent = data.nickname;

            jugadorDiv.appendChild(nombreJugadorDiv);
            cuadroDiv.appendChild(personajeDiv);
            jugadorDiv.appendChild(cuadroDiv);
            listaJugadoresDiv.appendChild(jugadorDiv);
        });
    }

    addPlayer(data) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(data);

            this.updatePlayersList();
        }
        else {
            null
        }
    }

    removePlayer(id) {
        this.players = this.players.filter(player => player.id !== id)
        this.updatePlayersList()
    }

    updateRanking() {
        // this.playersRanking = this.playersRanking.sort((a, b) => b.time - a.time)

        const ranking = document.getElementById('ranking')
        ranking.innerHTML = ''

        this.playersRanking.forEach(player => { 
            const tr = document.createElement('tr')
            tr.innerHTML = `<td>${player.nickname}</td>
                            <td>${player.time}</td>`
            if (player.level !== 'Esperando') {
                tr.innerHTML += `<td>${player.level + 1}</td>`
            } else {
                tr.innerHTML += `<td>${player.level}</td>`
            }
            ranking.appendChild(tr)  
        })

        this.playersRanking = [];
    }

    addToRanking(data) {
        for (let index in data) {
            this.playersRanking.push(data[index])
        }
        this.updateRanking()
    }

    removeFromRanking(id) {
        this.playersRanking = this.playersRanking.filter(player => player.id !== id)
        this.updateRanking()
    }
}

export default Players