document.addEventListener('DOMContentLoaded', function() {
    const silla = document.querySelector('.silla');
    const mesa = document.querySelector('.mesa');
    const cande = document.querySelector('.cande');
    const puerta = document.getElementById('puerta');
    let passTrue = false;


    function cambiarImagen(elemento, nuevaClase) {
        elemento.classList.add(nuevaClase);
        verificarCambio();
    }


    function verificarCambio() {
        const sillaCambiada = silla.classList.contains('silla-cambiada');
        const mesaCambiada = mesa.classList.contains('mesa-cambiada');
        const candeCambiada = cande.classList.contains('cande-cambiada');

        if (sillaCambiada && mesaCambiada && candeCambiada) {
            passTrue = true;
        } else {
            passTrue = false; 
        }
    }

    silla.addEventListener('click', function() {
        cambiarImagen(silla, 'silla-cambiada');
    });

    mesa.addEventListener('click', function() {
        cambiarImagen(mesa, 'mesa-cambiada');
    });

    cande.addEventListener('click', function() {
        cambiarImagen(cande, 'cande-cambiada');
    });

    puerta.addEventListener('click', () => {
        if (!passTrue) {
            document.getElementById('close').play();
        } else {
            document.getElementById('open1').play();
            window.location.href = '../Level9/index.html';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cofre = document.getElementById('cofre');
    
    cofre.addEventListener('click', () => {
        cofre.classList.add('moved');
        document.getElementById('modal-ask').classList.add('show-ask')
    });
    
});

