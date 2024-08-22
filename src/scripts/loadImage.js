import { applyGammaCorrection, getOriginalMat, setOriginalMat } from './gammaTransform.js';

document.getElementById('imageInput').addEventListener('change', (e) => {
    let originalMat = getOriginalMat();
    let input = e.target;
    let reader = new FileReader();
  
    reader.onload = () => {
        let imgElement = document.getElementById('inputImage');
        imgElement.src = reader.result;
        imgElement.onload = () => {
            if (originalMat) originalMat.delete();
            setOriginalMat(cv.imread(imgElement));
            // originalMat = cv.imread(imgElement);
            applyGammaCorrection(parseFloat(document.getElementById('gammaSlider').value));
        }
    };
    reader.readAsDataURL(input.files[0]);
});
