export default class StoreLevelCompleted {
    constructor(idLevelParam) {
        this.idlevel = idLevelParam;
    }

    async addStartedLevel() {
        // console.log(this.idlevel)
        await fetch('../../../php/controller/level.php', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                action: 'started',
                idLevel: this.idlevel
            })
        }).then(res => res.json())
        .then(res => {
            // console.log(res)
        })
    }
    
    async addCompletedLevel(time,level) {
        await fetch('../../../php/controller/level.php', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                action: 'completed',
                idLevel: this.idlevel,
                time: time
            })
        }).then(res => res.json())
        .then(res => {
            window.location.href = `../../levels/${level}/`;
        })
    }
}