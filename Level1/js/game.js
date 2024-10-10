const puerta = document.getElementById('puerta');
const knock = document.getElementById('close');
const doorOpen = document.getElementById('open');
const error = document.getElementById('error');
const correct = document.getElementById('correct');

puerta.addEventListener('click', () => {
    if (!passTrue) {
        knock.play();
    } else {
        window.location.href = '../level2/index.html';
    }
});

const botellas = document.getElementById('botellas');
const silla = document.getElementById('silla');
const florero = document.getElementById('florero');

const images = [document.getElementById('botellas'),document.getElementById('silla'),document.getElementById('florero')];

const numeros = document.getElementsByClassName('btn-numbers');

let count = 1;
let correctPass = [4, 3, 1]
let pass = []
let passTrue = false;

for (const num of numeros) {
    num.addEventListener('click', () => {
        if (count === 1) {
            images[0].classList.add('num');
            images[0].innerHTML = num.innerHTML;
            pass.push(parseInt(num.innerHTML));
            count++;
        } else if (count === 2) {
            images[1].classList.add('num');
            images[1].innerHTML = num.innerHTML;
            pass.push(parseInt(num.innerHTML));
            count++
        } else if (count === 3) {
            images[2].classList.add('num');
            images[2].innerHTML = num.innerHTML;
            pass.push(parseInt(num.innerHTML))
            console.log(pass);
            checkPass();
        }
    });
}

function checkPass() {
    if (JSON.stringify(pass) !== JSON.stringify(correctPass)) {
        error.play()
        images.forEach(image => {
            image.classList.add('incorrect');
            setTimeout(() => {
                image.classList.remove('incorrect');
                image.innerHTML = '';
                image.classList.remove('num');
            }, 500);
            
        });
        count = 1;
        pass = [];
    } else {
        images.forEach(image => {
            image.classList.add('correct');
        })
        doorOpen.play();
        passTrue = true;
        correct.play();
    }
}