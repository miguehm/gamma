import { applyGammaCorrection, originalMat } from './gammaTransform.js';

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
