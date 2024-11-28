document.getElementById("options").addEventListener("submit", (e) => {
    e.preventDefault();
    let options = document.getElementById("options");

    let numLevels = parseInt(options.children[0].children[0].children[1].value);
    let timePerLevel = parseInt(options.children[0].children[1].children[1].value);
    let difficulty = options.children[0].children[2].children[1].value;

    if (numLevels !== 0 && timePerLevel !== 0 && difficulty !== 0) {
        window.location.href = `../room_admin/?&numLevels=${numLevels}&timePerLevel=${timePerLevel}`
    } else {
        alert('Debes seleccionar una opcion en cada casilla')
    }
});

