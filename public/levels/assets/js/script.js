async function init() {




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