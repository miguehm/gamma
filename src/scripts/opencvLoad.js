async function esperarCvInicializado() {
    while (true) {
        try {
            if (cv) {
                console.log('OpenCV is ready.');                      
                document.getElementById('imageInput').disabled = false;

                document.getElementById('status').remove();
                return;
            }
        } catch (error) {
            console.log('Waiting for OpenCV.js to be ready...');
            document.getElementById('imageInput').disabled = true;
            document.getElementById('gammaSlider').disabled = true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

esperarCvInicializado();
