const drawingCanvas = document.getElementById('drawingCanvas');
const backgroundCanvas = document.getElementById('backgroundCanvas');
const drawingCtx = drawingCanvas.getContext('2d');
const backgroundCtx = backgroundCanvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const copenhagenButton = document.getElementById('copenhagenButton');
const berlinButton = document.getElementById('berlinButton');
const londonButton = document.getElementById('londonButton');
let drawing = false;
let backgroundImage = new Image();


drawingCanvas.addEventListener('mousedown', startDrawing);
drawingCanvas.addEventListener('mousemove', draw);
document.addEventListener('mouseup', stopDrawing);
drawingCanvas.addEventListener('mousemove', draw);

drawingCanvas.addEventListener('touchstart', startDrawing);
drawingCanvas.addEventListener('touchmove', draw);
document.addEventListener('touchend', stopDrawing);
document.addEventListener('touchcancel', stopDrawing);

clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);

copenhagenButton.addEventListener('click', () => changeBackground('copenhagen'));
berlinButton.addEventListener('click', () => changeBackground('berlin'));
londonButton.addEventListener('click', () => changeBackground('london'));

function startDrawing(event) {
    drawing = true;
    draw(event);
}

function stopDrawing() {
    drawing = false;
    drawingCtx.beginPath();
}


function draw(event) {
    if (!drawing) return;

    const rect = drawingCanvas.getBoundingClientRect();
    let x, y;

    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }

    const opacity = Math.random();
    const penColor = `rgba(245, 245, 245, ${opacity})`;

    // Adjust coordinates to match canvas position
    x *= drawingCanvas.width / rect.width;
    y *= drawingCanvas.height / rect.height;

    drawingCtx.lineWidth = 15;
    drawingCtx.lineCap = 'round';
    drawingCtx.strokeStyle = penColor;

    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();
    drawingCtx.beginPath();
    drawingCtx.moveTo(x, y);
}



function drawTouch(event) {
    event.preventDefault();
    draw(event);
}

function clearCanvas() {
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawBackground();
}

function saveCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;

    tempCtx.drawImage(backgroundCanvas, 0, 0);
    tempCtx.drawImage(drawingCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

function changeBackground(city) {
    let imageUrl = '';

    switch(city) {
        case 'copenhagen':
            imageUrl = 'images/copenhagen.jpg';
            break;
        case 'berlin':
            imageUrl = 'images/berlin.jpg';
            break;
        case 'london':
            imageUrl = 'images/london.jpg';
            break;
    }

    console.log(`Loading image: ${imageUrl}`);
    backgroundImage.src = imageUrl;
    backgroundImage.onload = () => {
        console.log(`Image loaded: ${imageUrl}`);
        drawBackground();
    };
    backgroundImage.onerror = (error) => {
        console.error(`Error loading image: ${imageUrl}`, error);
    };
}

function drawBackground() {
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.filter = 'blur(5px)';
    backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

// Initialize the glass effect and canvas
document.addEventListener('DOMContentLoaded', () => {
    changeBackground('berlin');
});



