var canvasAq = document.getElementById("aquarium");
var ctxAq = canvasAq.getContext("2d");

var mainFrame = document.getElementById("Fish");

canvasAq.width = mainFrame.getBoundingClientRect().width;
canvasAq.height = mainFrame.getBoundingClientRect().height;
ctxAq.imageSmoothingEnabled = false;
// canvasAq.style.backgroundColor = "red"

var backCanvasAq = document.getElementById("aquariumBack");
var backCtxAq = backCanvasAq.getContext("2d");
backCanvasAq.width = mainFrame.getBoundingClientRect().width;
backCanvasAq.height = mainFrame.getBoundingClientRect().height / 3;
backCanvasAq.style.bottom = 0;
backCanvasAq.style.backgroundColor = "none";
backCtxAq.imageSmoothingEnabled = false;

let num = 0;
let arrLength = 5;
var testArr = [];
var backArr = [];
const testPartArr = [];

var intervalId;

var existsFood = false;
var food;

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
    let scaleX = canvasAq.width / canvasRect.width;
    let scaleY = canvasAq.height / canvasRect.height;

    canvasMouse.x = (mouse.x - canvasRect.left) * scaleX;
    canvasMouse.y = (mouse.y - canvasRect.top) * scaleY;
}

window.addEventListener('resize', function () {
    canvasAq.width = mainFrame.getBoundingClientRect().width;
    canvasAq.height = mainFrame.getBoundingClientRect().height;
    ctxAq.imageSmoothingEnabled = false;

    backCanvasAq.width = mainFrame.getBoundingClientRect().width;
    backCanvasAq.height = mainFrame.getBoundingClientRect().height;
    backCtxAq.imageSmoothingEnabled = false;

    clearInterval(intervalId);
    ctxAq.clearRect(0, 0, canvasAq.width, canvasAq.height);
    backCtxAq.clearRect(0, 0, backCanvasAq.width, backCanvasAq.height);
    testArr = [];
    backArr = [];
    start();
});

function genRand(boidArr, canvas) {
    for (let i = 0; i < arrLength; i++) {
        boidArr[i].destinationX = Math.floor(Math.random() * canvas.width);
        boidArr[i].destinationY = Math.floor(Math.random() * canvas.height);
    }
};

class Boid {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        // this.image = new Image(50, 50);
        // this.image.src = 'images/shrimp.png';
        this.image = document.getElementById("shrimpIdle");
        this.destinationX = Math.floor(Math.random() * canvas.width);
        this.destinationY = Math.floor(Math.random() * (canvas.height - Math.ceil(canvas.height / 20)));
        this.interval = Math.floor(Math.random() * 400);
        this.faceLeft = true;
        this.idle = true;
        this.currFrame = 1;
    }

    draw(ctx, size) {
        // console.log(this.image)
        // ctx.drawImage(this.image, this.x, this.y, this.image.naturalWidth, this.image.naturalHeight);
        ctx.drawImage(this.image, this.x, this.y, size, size*2);
        // if (this.idle) {
        //     ctx.drawImage(this.image, (this.image.naturalWidth/2) * this.currFrame, 0, (this.image.naturalWidth/2), this.image.naturalHeight, this.x, this.y, size, size);
        //     this.currFrame++;
        //     if(this.currFrame == 2) {
        //         this.currFrame = 1;
        //     }
        // }
    }

    setImage(newImage) {
        if (this.faceLeft) {
            // this.image.src = 'images/' + newImage + '.png';
            this.image = document.getElementById(newImage);
        } else {
            // this.image.src = 'images/' + newImage + 'R.png';
            this.image = document.getElementById(newImage + 'R');
        }
    }

    moveTowards(x, y) {
        if (x < this.x && x != 0) {
            this.faceLeft = true;
        } else if (x > this.x && x != 0) {
            this.faceLeft = false;
        }
        let speed = 120;
        let changeXBy = Math.floor(-(this.x - x) / speed);
        let changeYBy = Math.floor(-(this.y - y) / speed);
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
        if (particle.exists) {
            this.interval = 500;
        } else {
            this.interval = Math.floor(Math.random() * 400);
        }
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
        this.exists = true;
    }

    move() {
        if (this.y < window.innerHeight - 20) {
            this.y += this.speed;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleParticles(canvas, particleArr) {
    for (let i = 0; i < particleArr.length; i++) {
        if (particleArr[i].exists) {
            particleArr[i].move();
            particleArr[i].draw(canvas.getContext("2d"));
        } else {
            particleArr[i].splice(i, 1);
        }
    }
}

function handleBoids(canvas, ctx, boidArr) {
    if (num == 401) {
        // random = genRand();
        num = 0;
    }
    num += 1;
    for (let i = 0; i < boidArr.length; i++) {
        if (num == boidArr[i].interval) {
            boidArr[i].destinationX = Math.floor(Math.random() * canvas.width);
            boidArr[i].destinationY = Math.floor(Math.random() * (canvas.height - Math.ceil(canvas.height / 20)));
        }
        if (existsFood) {
            boidArr[i].eat(food);
        }

        boidArr[i].moveTowards(boidArr[i].destinationX, boidArr[i].destinationY);
        boidArr[i].draw(ctx, Math.floor(canvas.width / 20));
    }
}

canvasAq.addEventListener('click', function (event) {
    genRand(testArr, canvasAq,);
    genRand(backArr, backCanvasAq);
    // let particle = new Particle(event.x, event.y);
    // testPartArr.push(particle);
    // for (let i = 0; i < testArr.length; i++) {
    //     testArr[i].eat(particle);
    // }
    // existsFood = true;
    // food = particle;
});

function animate() {
    ctxAq.clearRect(0, 0, canvasAq.width, canvasAq.height);
    backCtxAq.clearRect(0, 0, backCanvasAq.width, backCanvasAq.height);
    handleBoids(canvasAq, ctxAq, testArr);
    handleBoids(backCanvasAq, backCtxAq, backArr);
    // handleParticles(canvasAq, testPartArr);
    // window.requestAnimationFrame(animate);
}



function start() {
    for (let i = 0; i < arrLength * 2; i++) {
        if (i >= arrLength) {
            let random = {
                x: Math.floor(Math.random() * backCanvasAq.width),
                y: Math.floor(Math.random() * (backCanvasAq.height - Math.ceil(backCanvasAq.height / 20))),
            }
            backArr.push(new Boid(random.x, random.y, backCanvasAq))
        } else {
            let random = {
                x: Math.floor(Math.random() * canvasAq.width),
                y: Math.floor(Math.random() * (canvasAq.height - Math.ceil(canvasAq.height / 20))),
            }
            testArr.push(new Boid(random.x, random.y, canvasAq));
        }
        // testArr.push(new Boid(random.x, random.y));
        // testArr[i].draw(ctx);
    }
    intervalId = setInterval(animate, 15)
    // animate();
}
