const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('save');
const savePdfButton = document.getElementById('save-pdf');

// Set canvas size
canvas.width = 600;
canvas.height = 300;

// Signature pad variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set pen color and line width
ctx.strokeStyle = '#ffffff'; // White color for the signature
ctx.lineWidth = 3; // Increase line width for better visibility
ctx.lineCap = 'round'; // Smoothen line edges

// Event handlers
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

// Clear button
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save as PNG
saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'signature.png';
    link.click();
});

// Save as PDF
savePdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Create a temporary canvas for converting signature color
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Draw the signature on the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Invert the colors of the signature
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Invert the colors (white to black)
        imageData.data[i] = 255 - imageData.data[i];      // Red
        imageData.data[i + 1] = 255 - imageData.data[i + 1];  // Green
        imageData.data[i + 2] = 255 - imageData.data[i + 2];  // Blue
    }
    tempCtx.putImageData(imageData, 0, 0);

    // Convert the temporary canvas to image data
    const imgData = tempCanvas.toDataURL('image/png');

    // Add image to PDF
    const imgWidth = 190;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('signature.pdf');
});
