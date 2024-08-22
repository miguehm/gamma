const downloadImage = () => {
    const canvas = document.getElementById('outputCanvas');
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'result.png';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
    }, 'image/png');
}

document.getElementById('downloadButton').addEventListener('click', downloadImage);
