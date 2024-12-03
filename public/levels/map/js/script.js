import Game from '../../assets/js/game.js';

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const level = JSON.parse(urlParams.get('level'));

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)

    if (level) {
        new Game(level);
    } else {
        new Game(0);
    }

});