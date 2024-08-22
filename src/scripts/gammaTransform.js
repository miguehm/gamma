export let originalMat;
let b, g, r;
let pixelX, pixelY;
let isProcessing = false;

export function setOriginalMat(mat) {
    originalMat = mat;
}

export function getOriginalMat() {
    return originalMat;
}

export const applyGammaCorrection = (gamma) => {
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
        
        // Enable download button and slider
        document.getElementById('downloadButton').disabled = false;
        document.getElementById('gammaSlider').disabled = false;
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

