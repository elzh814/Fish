var canvasAq = document.getElementById("aquarium");
var ctxAq = canvasAq.getContext("2d");

canvasAq.width = window.innerWidth;
canvasAq.height = window.innerHeight;

let num = 0;
let arrLength = 20;
const testArr = [];
const testPartArr = [];

const mouse = {
    x: undefined,
    y: undefined,
}

const canvasMouse = {
    x: undefined,
    y: undefined,
}

function getCanvasMouse() {
    let canvasRect = canvasAq.getBoundingClientRect();
    let scaleX = canvasAq.width/canvasRect.width;
    let scaleY = canvasAq.height/canvasRect.height;

    canvasMouse.x = (mouse.x - canvasRect.left) * scaleX;
    canvasMouse.y = (mouse.y - canvasRect.top) * scaleY;
}

window.addEventListener('resize', function() {
    canvasAq.width = window.innerWidth;
    canvasAq.height = window.innerHeight;
});

function genRand(boidArr) {
    for (let i = 0; i < arrLength; i++) {
        boidArr[i].destinationX = Math.floor(Math.random() * canvasAq.width);
        boidArr[i].destinationY = Math.floor(Math.random() * canvasAq.height);
    }
};

class Boid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image(50, 50);
        this.image.src = 'images/shrimp.png';
        this.destinationX = Math.floor(Math.random() * canvasAq.width);
        this.destinationY = Math.floor(Math.random() * canvasAq.height);
        this.interval = Math.floor(Math.random() * 400);
        this.faceLeft = true;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.image.naturalWidth, this.image.naturalHeight);
    }

    setImage(newImage) {
        if (this.faceLeft) {
            this.image.src = 'images/' + newImage + '.png';
        } else {
            this.image.src = 'images/' + newImage + 'R.png';
        }
    }

    moveTowards(x, y) {
        if (x < this.x && x != 0) {
            this.faceLeft = true;
        } else if ( x > this.x && x != 0) {
            this.faceLeft = false;
        }
        let speed = 120;
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

    eat(particle) {
        this.destinationX = particle.x + Math.floor(Math.random() * 10);
        this.destinationY = particle.y + Math.floor(Math.random() * 10);
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.size = 10;
    }

    move() {
        if (this.y < window.innerHeight - 20) {
            this.y += this.speed;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

function handleParticles(canvas, particleArr){
    for(let i = 0; i < particleArr.length; i++) {
        particleArr[i].move();
        particleArr[i].draw(canvas.getContext("2d"));
    }
}

function handleBoids(canvas, boidArr){
    if (num == 401) {
        // random = genRand();
        num = 0;
    }
    num +=1;
    for(let i = 0; i < boidArr.length; i++) {
        if (num == boidArr[i].interval) {
            boidArr[i].destinationX = Math.floor(Math.random() * canvas.width);
            boidArr[i].destinationY = Math.floor(Math.random() * canvas.height);
        }
        boidArr[i].moveTowards(boidArr[i].destinationX, boidArr[i].destinationY);
        boidArr[i].draw(canvas.getContext("2d"));
    }
}   

canvasAq.addEventListener('click', function(event){
    // genRand(testArr);
    let particle = new Particle(event.x, event.y);
    testPartArr.push(particle);
    for (let i = 0; i < testArr.length; i++) {
        testArr[i].eat(particle);
    }
});

function animate() {
    ctxAq.clearRect(0, 0, canvasAq.width, canvasAq.height);
    handleBoids(canvasAq, testArr);
    handleParticles(canvasAq, testPartArr);
    window.requestAnimationFrame(animate);
}

function start() {

    for (let i = 0; i < arrLength; i++) {
        let random = {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000),
        }
        testArr.push(new Boid(random.x, random.y));
        // testArr[i].draw(ctx);
    }

    animate();
}