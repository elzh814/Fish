var canvas = document.getElementById("aquarium");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let num = 0;
let arrLength = 50;

const testArr = [];
const randomDesX = [];
const randomDesY = [];

const mouse = {
    x: undefined,
    y: undefined,
}

const canvasMouse = {
    x: undefined,
    y: undefined,
}

let random = genRand();

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
        this.image.src = 'images/shrimp.png'
        this.destination={
            x: undefined,
            y: undefined,
        }
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y);
    }
    
    moveTowards(x, y) {
        let speed = 100;
        this.x += -(this.x - x)/speed;
        this.y += -(this.y - y)/speed;
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

    moveRandom() {
        let randomX = Math.floor(Math.random() * 1000);
        let randomY = Math.floor(Math.random() * 1000);
        this.moveTowards(randomX, randomY);
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

function genRand() {
    for (let i = 0; i < arrLength; i++) {
        var random = {
            x: Math.floor(Math.random() * 1500),
            y: Math.floor(Math.random() * 1000),
            num: Math.floor(Math.random() * 1000),
            indexL: Math.floor(Math.random() * arrLength),
            indexR: Math.floor(Math.random * (arrLength/2) + (arrLength/2)),
        }
        randomDesX[i] = random.x;
        randomDesY[i] = random.y;
    }
    return random;
};


function handleBoids(canvas, boidArr){
    if (num == 250) {
        random = genRand();
        num = 0;
    }
    num +=1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < testArr.length; i++) {
        // let random = {
        //     x: Math.floor(Math.random() * 1200 - 100),
        //     y: Math.floor(Math.random() * 1200 - 100)
        // }
        boidArr[i].moveTowards(randomDesX[i], randomDesY[i]);
        boidArr[i].draw();
    }
}

// canvas.addEventListener('mousemove', function(event){
//     mouse.x = event.x;
//     mouse.y = event.y;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for(let i = 0; i < testArr.length; i++) {
//         testArr[i].moveTowards(mouse.x, mouse.y);
//         testArr[i].draw();
//     }
// });

canvas.addEventListener('click', function(){
    genRand();
});

function animate() {
    handleBoids(canvas, testArr);
    window.requestAnimationFrame(animate);
}

genRand();
animate();

//TESTING PURPOSES
canvas.addEventListener("click", function(event) {
    console.log("x:" + event.x +", y:" + event.y);
});