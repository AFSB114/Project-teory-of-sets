document.getElementById("options").addEventListener("submit", (e) => {
    e.preventDefault();
    let options = document.getElementById("options");
    let numLevels = options.children[0].children[0].children[1].value;
    let timePerLevel = options.children[0].children[1].children[1].value;
    let difficulty = options.children[0].children[2].children[1].value;
    fetch("../../../php/api/createRoom.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'numLevels': numLevels,
            'time': timePerLevel,
            'difficulty': difficulty
        })
    }).then(res => res.json()).then(res => {
        if (res.status === "success") {
            window.location.href = `./room_admin.html?code=${res.data}&action=create`
        }
    });
});