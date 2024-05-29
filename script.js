const drawingCanvas = document.getElementById('drawingCanvas');
const backgroundCanvas = document.getElementById('backgroundCanvas');
const drawingCtx = drawingCanvas.getContext('2d');
const backgroundCtx = backgroundCanvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const parisButton = document.getElementById('parisButton');
const berlinButton = document.getElementById('berlinButton');
const londonButton = document.getElementById('londonButton');
let drawing = false;
let backgroundImage = new Image();


drawingCanvas.addEventListener('touchstart', startDrawing);
drawingCanvas.addEventListener('touchend', stopDrawing);
drawingCanvas.addEventListener('touchcancel', stopDrawing);
drawingCanvas.addEventListener('touchmove', drawTouch);

drawingCanvas.addEventListener('mousedown', startDrawing);
drawingCanvas.addEventListener('mouseup', stopDrawing);
drawingCanvas.addEventListener('mouseout', stopDrawing);
drawingCanvas.addEventListener('mousemove', draw);

clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);

parisButton.addEventListener('click', () => changeBackground('paris'));
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
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;

    const opacity = Math.random();
    const greyColor = `rgba(128, 128, 128, ${opacity})`;

    drawingCtx.lineWidth = 10;
    drawingCtx.lineCap = 'round';
    drawingCtx.strokeStyle = greyColor;

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
        case 'paris':
            imageUrl = 'images/paris.png';
            break;
        case 'berlin':
            imageUrl = 'images/berlin.jpg';
            break;
        case 'london':
            imageUrl = 'images/london.png';
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
    backgroundCtx.filter = 'blur(8px)';
    backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}


document.addEventListener('DOMContentLoaded', () => {
    changeBackground('berlin');
});





