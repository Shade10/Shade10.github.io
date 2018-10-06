var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined,
}

var maxRadius = 150;
var minRadius = 4;

var colorArray = [
    '#2c3e50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9',
];


window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});


function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    this.update = function () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        } if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 140 && mouse.y - this.y > -50) {
            if (this.radius < maxRadius) {
                this.radius += 1;
            }
        } else if (this.radius > this.minRadius) {
            this.radius -= 1;
        }

        this.draw();
    }
}


var circleArray = []

function init() {
    circleArray = [];
    
    for (var i = 0; i < 800; i++) {
        var radius = Math.random() * 5 + 1;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() - 0.5);
        var dy = (Math.random() - 0.5);
        circleArray.push(new Circle(x, y, dx, dy, radius));
        
    }
}

function Playbutton() {
    ctx.beginPath();
    ctx.rect(250, 350, 800, 100); 
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillStyle = 'rgba(225,225,225,0.5)';
    ctx.fill(); 
    ctx.closePath();
    ctx.font = '40pt Kremlin Pro Web';
    ctx.fillStyle = '#000000';
    ctx.fillText('Kliknij tutaj by zagrać w grę', 345, 415);
  }

function animate() {
    requestAnimationFrame(animate);
    
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
        
    }
    // ctx.fillStyle = '#4D6AD5';
    // ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2, 300, 100);

    Playbutton()
}

//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

var rect = {
    x:250,
    y:350,
    width:800,
    height:100
};
//Binding the click event on the canvas
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,rect)) {
        window.location.href='../game.html';
    }else{
        return;
    }   
}, false);


init();
animate();