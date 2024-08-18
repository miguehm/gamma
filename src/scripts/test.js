let src, dst, originalMat;
let b, g, r;
let pixelX, pixelY;

document.getElementById('imageInput').addEventListener('change', function(e) {
    let input = e.target;
    let reader = new FileReader();
    reader.onload = function() {
        let imgElement = document.getElementById('inputImage');
        imgElement.src = reader.result;
        imgElement.onload = function() {
            src = cv.imread(imgElement);
            originalMat = src.clone();  // Guardar una copia de la imagen original
            dst = new cv.Mat();
            applyGammaCorrection(parseFloat(document.getElementById('gammaSlider').value));
        }
    };
    reader.readAsDataURL(input.files[0]);
});

document.getElementById('gammaSlider').addEventListener('input', function() {
    let gamma = parseFloat(this.value);
    document.getElementById('gammaValue').textContent = gamma.toFixed(1);
    if (src) {
        applyGammaCorrection(gamma);
        document.getElementById('numeroParrafo').textContent = `Valor de intensidad del pixel (${pixelX}, ${pixelY}): (R: ${r}, G: ${g}, B: ${b})`;
    }
});

function applyGammaCorrection(gamma) {
    src = originalMat.clone();  // Restaurar la imagen original

    if(gamma > 0) {
        // Convertir la imagen a un rango de [0, 1]
        src.convertTo(src, cv.CV_32F, 1.0 / 255.0);

        // Aplicar la corrección gamma
        cv.pow(src, 1.0/gamma, dst);

        // Convertir de nuevo al rango de [0, 255]
        dst.convertTo(dst, cv.CV_8U, 255.0);

        // Mostrar la imagen resultante en el canvas
        cv.imshow('outputCanvas', dst);

        // acceder al pixel (100, 100)
        let pixel = dst.ucharPtr(100, 100);
        b = pixel[0];
        g = pixel[1];
        r = pixel[2];
        // console.log(`Valor de intensidad del pixel (100, 100): (R: ${r}, G: ${g}, B: ${b})`);

        
        // Limpiar la imagen temporal
        src.delete();
        
    }
}

// function getRGB() {
//     return [r, g, b];
// }


const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', function(event) {
    // Obtener la posición del canvas en la página
    // const rect = canvas.getBoundingClientRect();
    //
    // // Calcular las coordenadas del clic relativas al canvas
    // const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;
    //
    // // Redondear a enteros si es necesario
    // const pixelX = Math.round(x);
    // const pixelY = Math.round(y);
    
    pixelX = Math.round(event.offsetX);
    pixelY = Math.round(event.offsetY);

    console.log(`Clic en el pixel: (${pixelX}, ${pixelY})`);
    
    document.getElementById('numeroParrafo').textContent = `Valor de intensidad del pixel (${pixelX}, ${pixelY}): (R: ${r}, G: ${g}, B: ${b})`;

    // Aquí puedes hacer lo que quieras con las coordenadas
    // Por ejemplo, dibujar un punto en esa posición:
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 3, 0, 2 * Math.PI);
    ctx.fill();
});

// Limpiar recursos cuando la página se recarga o cierra
window.addEventListener('beforeunload', function() {
    if (src) src.delete();
    if (dst) dst.delete();
    if (originalMat) originalMat.delete();
});
