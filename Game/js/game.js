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
    PLAYER_COOLDOWN: 0,
}

var ENEMY_CONFIG = {
    // ENEMY_WIDTH: 20,
    // ENEMY_HEIGHT: 20,
    // ENEMY_MAX_SPEED: 400,
    ENEMY_PER_ROW: 10,
    ENEMY_VERTICAL_PADDING: 70,
    ENEMY_HORIZONTAL_PADDING: 80,
    ENEMY_VERTICAL_SPACING: 80,
}

var LASER_CONFIG = {
    LASER_MAX_SPEED: 200,
    LASER_COOLDOWN: 0.3,
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
    eniemies: [],
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

// https://en.wikipedia.org/wiki/Hit-testing   for colision with laser

function rectangleIntersection(r1, r2){
    return !(
        r1.left > r2.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
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

function createEnemy(container, x, y) {
    var element = document.createElement('img');
    element.src = "/Game/img/enemy-red-4.png";
    element.className = "enemy";
    container.appendChild(element);

    var enemy = {
        element,
        x,
        y,
    };

    GAME_STATE.eniemies.push(enemy);
    setPosition(element, x, y);
}

function init() {
    var container = document.querySelector(".game");
    createPlayer(container);

    var enemySpacing = (GAME_CONFIG.GAME_WIDTH - ENEMY_CONFIG.ENEMY_HORIZONTAL_PADDING * 2) /
        (ENEMY_CONFIG.ENEMY_PER_ROW - 1);

    for (var i = 0; i < 3; i++) {
        var y = ENEMY_CONFIG.ENEMY_VERTICAL_PADDING + i * ENEMY_CONFIG.ENEMY_VERTICAL_SPACING;
        for (var j = 0; j < ENEMY_CONFIG.ENEMY_PER_ROW; j++) {
            var x = j * enemySpacing + ENEMY_CONFIG.ENEMY_HORIZONTAL_PADDING;
            createEnemy(container, x, y);
        }
    }
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

    if (GAME_STATE.spacePressed && PLAYER_CONFIG.PLAYER_COOLDOWN <= 0) {
        createLaser(container, GAME_STATE.playerX, GAME_STATE.playerY);
        PLAYER_CONFIG.PLAYER_COOLDOWN = LASER_CONFIG.LASER_COOLDOWN;
    }

    if (PLAYER_CONFIG.PLAYER_COOLDOWN > 0) {
        PLAYER_CONFIG.PLAYER_COOLDOWN -= dataTime;
    }

    var player = document.querySelector('.player');
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function updateEnemies(dataTime, container) {
    var enemyDirectionX = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    var enemyDirectionY = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

    var enemies = GAME_STATE.eniemies;
    enemies.map(enemy => {
        var x = enemy.x + enemyDirectionX;
        var y = enemy.y + enemyDirectionY;
        setPosition(enemy.element, x, y);
    })    
    GAME_STATE.eniemies = GAME_STATE.eniemies.filter(e => !e.isDead )
}

function createLaser(container, x, y) {
    var element = document.createElement("img");
    element.src = "/Game/img/laser-blue-1.png";
    element.className = "laser";

    container.appendChild(element);

    var laser = { element, x, y };
    GAME_STATE.lasers.push(laser);

    var audio = new Audio("Game/sound/sfx-laser1.ogg");
    audio.play();

    setPosition(element, x, y);
}


function destroyLaser(container, laser) {
    container.removeChild(laser.element);
    laser.isDead = true;
}

function destroyEnemy(container, enemy){
    container.removeChild(enemy.element);
    enemy.isDead = true;
}

function updateLaser(dataTime, container) {
    var lasers = GAME_STATE.lasers;

    for (var i = 0; i < lasers.length; i++) {
        var laser = lasers[i];
        console.log(laser);
        laser.y -= dataTime * LASER_CONFIG.LASER_MAX_SPEED;
        if (laser.y < 0) {
          destroyLaser(container, laser);
        }
        setPosition(laser.element, laser.x, laser.y);
        var r1 = laser.element.getBoundingClientRect();
        var enemies = GAME_STATE.enemies;
        for (var j = 0; j < enemies.length; j++) {
          var enemy = enemies[j];
          if (enemy.isDead) return;
          var r2 = enemy.element.getBoundingClientRect();
          if (rectsIntersect(r1, r2)) {
            destroyEnemy(container, enemy);
            destroyLaser(container, laser);
            break;
          }
        }
      }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function renderGame() {
    var currentTime = Date.now();
    var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;
    var container = document.querySelector('.game');

    updatePlayer(dataTime, container);
    //this work before (on the master):
    updateLaser(dataTime, container);
    updateEnemies(dataTime, container);

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