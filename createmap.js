// Get URL parameters
function getURLParams() {
    let params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    for (let [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// Extract map dimensions from URL parameters
const params = getURLParams();
const mapWidth = 50*parseInt(params['map-width']);
const mapHeight = 50*parseInt(params['map-height']);
const canvas = document.querySelector('#mapc');
const c = canvas.getContext('2d');

canvas.width = mapWidth + 40;
canvas.height = mapHeight + 40;

class Border {
    constructor() {
        this.x = 10;
        this.y = 10;
        this.width = mapWidth + 20;
        this.height = mapHeight + 20;
    }
    draw() {
        c.stokeStyle = 'black';
        c.lineWidth = 20;
        c.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class Block {
    constructor(x, y, width, height, colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.isDragging = false;
    }
    draw() {
        c.fillStyle = this.colour;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
    }
}

selectedBlock = null;
let offsetX, offsetY;

canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    blocks.forEach((block) => {
        if (mouseX > block.x && mouseX < block.x + block.width && mouseY > block.y && mouseY < block.y + block.height) {
            selectedBlock = block;
            offsetX = mouseX - block.x;
            offsetY = mouseY - block.y;
            block.isDragging = true;
        }
    });
});

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;

    if (selectedBlock && selectedBlock.isDragging) {
        selectedBlock.x = mouseX - offsetX;
        selectedBlock.y = mouseY - offsetY;
    }
    
});

canvas.addEventListener('mouseup', () => {
    if (selectedBlock) {
        selectedBlock.isDragging = false;
        selectedBlock = null;
    }
});

const blocks = [];
const keys = {
    b: false,
    B: false,
    n: false,
    N: false
    };

let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
});

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    if (event.key === 'b' || event.key === 'B') {
        const block = new Block(cursorX - 25, cursorY - 25, 10, 100, 'green');
        blocks.push(block);
        console.log('Block created:', block);
    }
    if (event.key === 'n' || event.key === 'N') {
        const block = new Block(cursorX - 25, cursorY - 25, 100, 10, 'green');
        blocks.push(block);
        console.log('Block created:', block);
    }
});

function animate() {
    blocks.forEach((block) => {
        block.update();
    });
    requestAnimationFrame(animate);
}

animate();

const mapBorder = new Border();
mapBorder.draw();

let data = {
    "map": {
        "width": mapWidth,
        "height": mapHeight
    },
    "blocks": []
};



document.getElementById('submit').addEventListener('click', () => {
    //add data to the form
    data['blocks'] = blocks.map((block) => {
        return {
            x: block.x - 10,
            y: block.y - 10,
            width: block.width,
            height: block.height
        };
    })
    document.getElementById('map-data').value = JSON.stringify(data);
    console.log('Data:', data);
});