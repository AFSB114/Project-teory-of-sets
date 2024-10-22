const espejos = ['espejo1', 'espejo2', 'espejo3'];
const cuadros = ['cuadro1', 'cuadro2', 'cuadro3'];

const arrastrables = document.querySelectorAll('imagen-arrastrable');
const zonaEspejos = document.getElementById('zona-espejos');
const zonaCuadros = document.getElementById('zona-cuadros');
const mensajeError = document.getElementById('mensaje-error');

// Eventos de arrastrables
arrastrables.forEach(imagen => {
    imagen.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.id);
    });
});

// Eventos para zonas receptores
[zonaEspejos, zonaCuadros].forEach(zona => {
    zona.addEventListener('dragover', (e) => {
        e.preventDefault(); // Permite que el elemento sea soltado
    });

    zona.addEventListener('drop', (e) => {
        e.preventDefault();
        const idImagen = e.dataTransfer.getData('text');
        const conjunto = zona.dataset.conjunto;

        // Obtener posición del mouse al soltar
        const rect = zona.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        if ((conjunto === 'espejos' && espejos.includes(idImagen)) ||
            (conjunto === 'cuadros' && cuadros.includes(idImagen))) {
            // Correcto: Añadir imagen al conjunto correcto
            mensajeError.style.display = 'none'; // Ocultar mensaje de error
            const imagenArrastrable = document.getElementById(idImagen);
            imagenArrastrable.style.position = 'absolute';
            imagenArrastrable.style.left = `${offsetX - (imagenArrastrable.offsetWidth / 2)}px`;
            imagenArrastrable.style.top = `${offsetY - (imagenArrastrable.offsetHeight / 2)}px`;
            zona.appendChild(imagenArrastrable); // Añadir la imagen a la zona correspondiente
        } else {
            // Incorrecto: Mostrar mensaje de error
            mensajeError.style.display = 'block';
        }
    });
});
