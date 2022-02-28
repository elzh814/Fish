var canvas = document.getElementById("aquarium");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let num = 0;
let arrLength = 50;

const testArr = [];
// const randomDesX = [];
// const randomDesY = [];

const mouse = {
    x: undefined,
    y: undefined,
}

const canvasMouse = {
    x: undefined,
    y: undefined,
}

// let random = genRand();

function getCanvasMouse() {
    let canvasRect = canvas.getBoundingClientRect();
    let scaleX = canvas.width/canvasRect.width;
    let scaleY = canvas.height/canvasRect.height;

    canvasMouse.x = (mouse.x - canvasRect.left) * scaleX;
    canvasMouse.y = (mouse.y - canvasRect.top) * scaleY;
}

class Boid {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.image = new Image(50, 50);
        this.image.src = 'images/shrimp.png';
        this.destinationX = Math.floor(Math.random() * canvas.width);
        this.destinationY = Math.floor(Math.random() * canvas.height);
        this.interval = Math.floor(Math.random() * 400);
        this.faceLeft = true;

    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.image.naturalWidth, this.image.naturalHeight);
    }

    setImage(newImage) {
        if (this.faceLeft) {
            this.image.src = 'images/' + newImage + '.png';
        } else {
            this.image.src = 'images/' + newImage + 'R.png';
        }
    }

    moveTowards(x, y) {
        if (x < this.x) {
            this.faceLeft = true;
        } else {
            this.faceLeft = false;
        }
        let speed = 100;
        let changeXBy = Math.floor(-(this.x - x)/speed);
        let changeYBy = Math.floor(-(this.y - y)/speed);
        this.x += changeXBy;
        this.y += changeYBy;
        if (changeXBy == 0 && changeYBy == 0) {
            this.setImage("shrimp");
        } else {
            this.setImage("shrimpSwim");
        }
    }

    findDistance(boid) {
        let distance = Math.sqrt(Math.pow((boid.x - this.x), 2) + Math.pow((boid.y - this.y), 2));
        return distance;
    }

    moveTo(x, y) {
        while (this.x < x && this.y < y) {
            this.draw();
            this.moveTowards(x, y);
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}


for (let i = 0; i < arrLength; i++) {
    let random = {
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
    }
    testArr.push(new Boid(random.x, random.y, canvas));
    testArr[i].draw();
}

function genRand(boidArr) {
    for (let i = 0; i < arrLength; i++) {
        boidArr[i].destinationX = Math.floor(Math.random() * canvas.width);
        boidArr[i].destinationY = Math.floor(Math.random() * canvas.height);
    }
};


function handleBoids(canvas, boidArr){
    if (num == 401) {
        // random = genRand();
        num = 0;
    }
    num +=1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < boidArr.length; i++) {
        if (num == boidArr[i].interval) {
            boidArr[i].destinationX = Math.floor(Math.random() * canvas.width);
            boidArr[i].destinationY = Math.floor(Math.random() * canvas.height);
        }
        boidArr[i].moveTowards(boidArr[i].destinationX, boidArr[i].destinationY);
        boidArr[i].draw();
    }
}

canvas.addEventListener('click', function(){
    genRand(testArr);
});

function animate() {
    handleBoids(canvas, testArr);
    window.requestAnimationFrame(animate);
}

// genRand();
animate();

//TESTING PURPOSES
canvas.addEventListener("click", function(event) {
    console.log("x:" + event.x +", y:" + event.y);
});