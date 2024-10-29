const cuadros = Array.from(document.getElementsByClassName('cuadro'));
let pass = ['', '', ''];
const passCorrect = ['cuadro-1', 'cuadro-2', 'cuadro-3'];
const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
// const cajon = document.getElementById('cajon');
// const openGab = document.getElementById('open-cajon');
// const closeGab = document.getElementById('close-cajon');

let passTrue = false;

cuadros.forEach(cuadro => {
    cuadro.addEventListener('click', () => {
        cuadro.style.filter = 'drop-shadow(0 0 2vh rgba(255, 255, 255, 0.249))';
        
        for (let i = 0; i < pass.length; i++) {
            if (pass[i] === '') {
                pass[i] = cuadro.id;
                break;
            }
        }

        if (pass.join('') === passCorrect.join('')) {
            doorOpen.play();
            passTrue = true;
        }
    });
});

puerta.addEventListener('click', () => {
    if (!passTrue) {
        knock.play();
        cuadros.forEach(cuadro => {
            cuadro.style.filter = '';
        });
        pass.fill('');
    } else {
        window.location.href = '../../../game_mode/index.html';
    }
});