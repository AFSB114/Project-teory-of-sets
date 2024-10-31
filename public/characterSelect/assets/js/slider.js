let slideActual = 0;

function cambiarSlide(direccion) {
    const slides = document.querySelectorAll('.characterGroup');
    
    slides[slideActual].classList.remove('active');
    
    slideActual += direccion;

    if (slideActual < 0) {
        slideActual = slides.length - 1;
    } else if (slideActual >= slides.length) {
        slideActual = 0;
    }

    slides[slideActual].classList.add('active');
    const slidesContainer = document.querySelector('.slides');
    slidesContainer.style.transform = `translateX(-${slideActual * 100}%)`;
}