let originalMat;
let b, g, r;
let pixelX, pixelY;
let isProcessing = false;

// Cargar imagen
document.getElementById('imageInput').addEventListener('change', (e) => {
    let input = e.target;
    let reader = new FileReader();
    reader.onload = () => {
        let imgElement = document.getElementById('inputImage');
        imgElement.src = reader.result;
        imgElement.onload = () => {
            if (originalMat) originalMat.delete();
            originalMat = cv.imread(imgElement);
            applyGammaCorrection(parseFloat(document.getElementById('gammaSlider').value));
        }
    };
    reader.readAsDataURL(input.files[0]);
});

// Función de debounce para limitar la frecuencia de llamadas
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Slider
document.getElementById('gammaSlider').addEventListener('input', debounce(() => {
    let gamma = parseFloat(document.getElementById('gammaSlider').value);
    document.getElementById('gammaValue').textContent = gamma.toFixed(1);
    if (originalMat) {
        applyGammaCorrection(gamma);
    }
}, 50));

const applyGammaCorrection = (gamma) => {
    if (isProcessing) return;
    isProcessing = true;

    let src = originalMat.clone();
    let dst = new cv.Mat();

    if (gamma > 0) {
        if (src.type() !== cv.CV_8U) {
            src.convertTo(src, cv.CV_8U);
        }

        let lut = gamma_lut(gamma);
        cv.LUT(src, lut, dst);

        cv.imshow('outputCanvas', dst);

        lut.delete();
        
        // Habilitar el botón de descarga
        document.getElementById('downloadButton').disabled = false;
    }

    src.delete();
    dst.delete();

    isProcessing = false;
}

const gamma_lut = (gamma) => {
    let lut = new cv.Mat(1, 256, cv.CV_8U);
    for (let i = 0; i < 256; i++) {
        let value = Math.pow(i / 255.0, 1.0 / gamma) * 255.0;
        lut.ucharPtr(0, i)[0] = Math.round(value);
    }
    return lut;
}

// Función para descargar la imagen
const downloadImage = () => {
    // Obtener el canvas
    const canvas = document.getElementById('outputCanvas');
    
    // Convertir el canvas a un blob
    canvas.toBlob((blob) => {
        // Crear un objeto URL para el blob
        const url = URL.createObjectURL(blob);
        
        // Crear un elemento de enlace temporal
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'imagen_corregida.png';
        
        // Simular un clic en el enlace
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Liberar el objeto URL
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// Agregar el evento al botón de descarga
document.getElementById('downloadButton').addEventListener('click', downloadImage);
