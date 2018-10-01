"use strict"
var GAME_CONTROL = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32,
};

var PLAYER_CONFIG = {
    PLAYER_WIDTH: 20,
    PLAYER_HEIGHT: 20,
    PLAYER_MAX_SPEED: 400,
}

var LASER_CONFIG = {
    LASER_MAX_SPEED: 500,
}

var GAME_CONFIG = {
    GAME_WIDTH: 1200,
    GAME_HEIGHT: 700,
};

var GAME_STATE = {
    lastTime: Date.now(),
    playerX: 0,
    playerY: 0,
    lasers: [],
    leftPressed: false,
    rightPressed: false,
    upPressed: false,
    downPressed: false,
    spacePressed: false,
};

function setPosition(targ, x, y) {
    targ.style.transform = "translate(" + x + "px, " + y + "px)";
};

function borderCollision(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else return value;
}

function createPlayer(container) {
    GAME_STATE.playerX = GAME_CONFIG.GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_CONFIG.GAME_HEIGHT - 50;

    var player = document.createElement("img");
    player.src = "/Game/img/spaceship.pod_.1.png";
    player.className = "player";

    container.appendChild(player);

    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
};

function init() {
    var container = document.querySelector(".game");
    createPlayer(container);
};
init();

function updatePlayer(dataTime, container) {
    if (GAME_STATE.leftPressed) {
        GAME_STATE.playerX -= dataTime * PLAYER_CONFIG.PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
        GAME_STATE.playerX += dataTime * PLAYER_CONFIG.PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.upPressed) {
        GAME_STATE.playerY -= dataTime * PLAYER_CONFIG.PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.downPressed) {
        GAME_STATE.playerY += dataTime * PLAYER_CONFIG.PLAYER_MAX_SPEED;
    }
    GAME_STATE.playerX = borderCollision(GAME_STATE.playerX, PLAYER_CONFIG.PLAYER_WIDTH,
        GAME_CONFIG.GAME_WIDTH - (PLAYER_CONFIG.PLAYER_WIDTH) - 20);

    GAME_STATE.playerY = borderCollision(GAME_STATE.playerY, PLAYER_CONFIG.PLAYER_HEIGHT,
        GAME_CONFIG.GAME_HEIGHT - 30);

    if (GAME_STATE.spacePressed) {
        createLaser(container, GAME_STATE.playerX, GAME_STATE.playerY);
    }

    var player = document.querySelector('.player');
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createLaser(container, x, y) {
    const element = document.createElement("img");
    element.src = "/Game/img/laser-blue-1.png";
    element.className = "laser";

    container.appendChild(element);

    const laser = { element, x, y };
    GAME_STATE.lasers.push(laser);

    const audio = new Audio("Game/sound/sfx-laser1.ogg");
    audio.play();

    setPosition(element, x, y);
}

function updateLaser(dataTime, container) {
    var lasers = GAME_STATE.lasers;

    // lasers.map(laser => {
    //     laser -= dataTime * LASER_CONFIG.LASER_MAX_SPEED;
    //     setPosition(laser.targ, laser.x, laser.y)
    // })

    for (let i = 0; i < lasers.length; i++) {
        var laser = lasers[i];
        laser.y -= dataTime * LASER_CONFIG.LASER_MAX_SPEED;
        setPosition(laser.element, laser.x, laser.y);
    }
}

function renderGame() {
    var currentTime = Date.now();
    var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;
    var container = document.querySelector('.game');

    updatePlayer(dataTime, container);
    updateLaser(dataTime, container);


    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}

function keyDown(e) {
    if (e.keyCode === GAME_CONTROL.LEFT) {
        GAME_STATE.leftPressed = true;
    } else if (e.keyCode === GAME_CONTROL.RIGHT) {
        GAME_STATE.rightPressed = true;
    } else if (e.keyCode === GAME_CONTROL.UP) {
        GAME_STATE.upPressed = true;
    } else if (e.keyCode === GAME_CONTROL.DOWN) {
        GAME_STATE.downPressed = true;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = true;
    }
};

function keyUp(e) {
    if (e.keyCode === GAME_CONTROL.LEFT) {
        GAME_STATE.leftPressed = false;
    } else if (e.keyCode === GAME_CONTROL.RIGHT) {
        GAME_STATE.rightPressed = false;
    } else if (e.keyCode === GAME_CONTROL.UP) {
        GAME_STATE.upPressed = false;
    } else if (e.keyCode === GAME_CONTROL.DOWN) {
        GAME_STATE.downPressed = false;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = false;
    }
};

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(renderGame);