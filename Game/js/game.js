"use strict"
var GAME_CONTROL = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
};

var PLAYER_CONFIG = {
    PLAYER_WIDTH: 20,
    PLAYER_MAX_SPEED: 400,
}

var GAME_CONFIG = {
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
};

var GAME_STATE = {
    lastTime: Date.now(),
    playerX: 0,
    playerY: 0,
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
};

function setPosition(el, x, y) {
    el.style.transform = "translate(" + x + "px, " + y + "px)";
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
    player.src = "/Game/img/player-blue-1.png";
    player.className = "player";

    container.appendChild(player);

    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
};

function init() {
    var container = document.querySelector(".game");
    createPlayer(container);
};
init();

function updatePlayer(dataTime) {
    if (GAME_STATE.leftPressed) {
        GAME_STATE.playerX -= dataTime * PLAYER_CONFIG.PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
        GAME_STATE.playerX += dataTime * PLAYER_CONFIG.PLAYER_MAX_SPEED ;
    }
    GAME_STATE.playerX = borderCollision(GAME_STATE.playerX, PLAYER_CONFIG.PLAYER_WIDTH,
        GAME_CONFIG.GAME_WIDTH - PLAYER_CONFIG.PLAYER_WIDTH);

    var player = document.querySelector('.player');
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function renderGame() {
    var currentTime = Date.now();
    var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;
    
    updatePlayer(dataTime);
    
    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}

function keyDown(e) {
    if (e.keyCode === GAME_CONTROL.LEFT) {
        GAME_STATE.leftPressed = true;
    } else if (e.keyCode === GAME_CONTROL.RIGHT) {
        GAME_STATE.rightPressed = true;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = true;
    }


};

function keyUp(e) {
    if (e.keyCode === GAME_CONTROL.LEFT) {
        GAME_STATE.leftPressed = false;
    } else if (e.keyCode === GAME_CONTROL.RIGHT) {
        GAME_STATE.rightPressed = false;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = false;
    }
};

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(renderGame);