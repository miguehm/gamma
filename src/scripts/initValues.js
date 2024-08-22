document.getElementById('gammaSlider').value = 1.0;

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('imageInput');
  if (fileInput) {
    fileInput.value = '';
  }
});

document.getElementById('imageInput').disabled = true;
document.getElementById('gammaSlider').disabled = true;
document.getElementById('downloadButton').disabled = true;
