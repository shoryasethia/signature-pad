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

// Set pen color
ctx.strokeStyle = '#000000'; // Set ink color to black
ctx.lineWidth = 2;

// Function to handle drawing
function startDrawing(x, y) {
    isDrawing = true;
    lastX = x;
    lastY = y;
}

function draw(x, y) {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
    }
}

function stopDrawing() {
    isDrawing = false;
}

// Event handlers for desktop
canvas.addEventListener('mousedown', (e) => {
    startDrawing(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    draw(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => {
    stopDrawing();
});

canvas.addEventListener('mouseleave', () => {
    stopDrawing();
});

// Event handlers for touch devices
canvas.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    startDrawing(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling while drawing
    const rect = canvas.getBoundingClientRect();
    draw(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
});

canvas.addEventListener('touchend', () => {
    stopDrawing();
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
    const imgData = canvas.toDataURL('image/png');

    // Calculate the dimensions of the image in mm
    const imgWidth = 190;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('signature.pdf');
});
