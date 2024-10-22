document.getElementById("options").addEventListener("submit", (e) => {
    e.preventDefault();
    let options = document.getElementById("options");

    let numLevels = options.children[0].children[0].children[1].value;
    let timePerLevel = options.children[0].children[1].children[1].value;
    let difficulty = options.children[0].children[2].children[1].value;

    window.location.href = `../room_admin/?&numLevels=${numLevels}&timePerLevel=${timePerLevel}`

});

