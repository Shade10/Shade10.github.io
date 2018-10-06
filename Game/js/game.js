"use strict"
var GAME_CONTROL = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32,
};

var BOS_CONTROL = ['LEFT', 'RIGHT'];

var PLAYER_CONFIG = {
    PLAYER_WIDTH: 20,
    PLAYER_HEIGHT: 20,
    PLAYER_MAX_SPEED: 400,
    PLAYER_COOLDOWN: 0.7,
    PLAYER_LASER_MAX_SPEED: 330,
    PLAYER_LASER_COOLDOWN: 0,
};

var BOSS_CONFIG = {
    BOSS_WIDTH: 300,
    BOSS_HEIGHT: 280,
    BOS_X: 0,
    BOSS_Y: 0,
    BOSS_HP: 100,
    BOSS_MAX_SPEED: 350,
    BOSS_COOLDOWN: 0.6,
    BOSS_LASSER_MAX_SPEED: 600,
    BOSS_LASER_COOLDOWN: 0,
}

var ENEMY_CONFIG = {
    // ENEMY_WIDTH: 20,
    // ENEMY_HEIGHT: 20,
    // ENEMY_MAX_SPEED: 400,
    ENEMY_PER_ROW: 10,
    ENEMY_VERTICAL_PADDING: 40,
    ENEMY_HORIZONTAL_PADDING: 130,
    ENEMY_VERTICAL_SPACING: 60,
    ENEMY_COOLDOWN: 6.0,
    ENEMY_LASER_MAX_SPEED: 230,
    ENEMY_LASER_COOLDOWN: 0.4,
};

var GAME_CONFIG = {
    GAME_WIDTH: 1200,
    GAME_HEIGHT: 700,
    music: false,
};

var GAME_STATE = {
    lastTime: Date.now(),
    playerX: 0,
    playerY: 0,
    lasers: [],
    enemies: [],
    enemyLasers: [],
    bosses: [],
    bossLasers: [],
    leftPressed: false,
    rightPressed: false,
    upPressed: false,
    downPressed: false,
    spacePressed: false,
    initBoss: false,
    BossOnMap: false,
    gameOver: false,
    playerWin: false,
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

function rectangleIntersection(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

function rand(min, max) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
    return min + Math.random() * (max - min);
}

// function music(){
//     var audio = new Audio("/Game/sound/theme_melody.mp3");
//     audio.play();
// };
// music();

function init() {
    var container = document.querySelector(".game");
    createPlayer(container);
    // var audio = new Audio("/Game/sound/theme_melody.mp3");
    // audio.play();

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

function playerWin() {
    if (GAME_STATE.playerWin === true) {
        return true;
    }
}
function doItOnce() {
    initBoss();
    GAME_STATE.BossOnMap = true;
    init = () => { };
    doItOnce = () => { };
}
// LEVEL BOSS

function initBoss() {
    var container = document.querySelector(".game");
    BOSS_CONFIG.BOS_X = GAME_CONFIG.GAME_WIDTH / 1.58;
    BOSS_CONFIG.BOSS_Y = GAME_CONFIG.GAME_HEIGHT - 640;

    createBoss(container, BOSS_CONFIG.BOS_X, BOSS_CONFIG.BOSS_Y);
};
// PLAYER

function createPlayer(container) {
    GAME_STATE.playerX = GAME_CONFIG.GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_CONFIG.GAME_HEIGHT - 50;

    var player = document.createElement("img");
    player.src = "/Game/img/spaceship.pod_.1.png";
    player.className = "player";
    // var audio = new Audio("/Game/sound/theme_melody.mp3");
    // audio.play();
    container.appendChild(player);

    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
};

function destroyPlayer(container, player) {
    container.removeChild(player);
    GAME_STATE.gameOver = true;
    var audio = new Audio("/Game/sound/sfx-lose.ogg");
    audio.play();
}

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

    if (GAME_STATE.spacePressed && PLAYER_CONFIG.PLAYER_LASER_COOLDOWN <= 0) {
        createLaser(container, GAME_STATE.playerX, GAME_STATE.playerY);
        PLAYER_CONFIG.PLAYER_LASER_COOLDOWN = PLAYER_CONFIG.PLAYER_COOLDOWN;
    }

    if (PLAYER_CONFIG.PLAYER_LASER_COOLDOWN > 0) {
        PLAYER_CONFIG.PLAYER_LASER_COOLDOWN -= dataTime;
    }

    var player = document.querySelector('.player');
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}
// PLAYER LASERS

function createLaser(container, x, y) {
    var element = document.createElement("img");
    element.src = "/Game/img/laser-blue-1.png";
    element.className = "laser";

    container.appendChild(element);

    var laser = {
        element,
        x,
        y
    };
    GAME_STATE.lasers.push(laser);

    var audio = new Audio("Game/sound/sfx-laser1.ogg");
    audio.play();

    setPosition(element, x, y);
}
// MAIN DESTRUCTOR OF LASERS FOR EVERY-ONE

function destroyLaser(container, laser) {
    container.removeChild(laser.element);
    laser.isDead = true;
}


function updateLaser(dataTime, container) {
    var lasers = GAME_STATE.lasers;
    
    for (var i = 0; i < lasers.length; i++) {
        var laser = lasers[i];
        laser.y -= dataTime * PLAYER_CONFIG.PLAYER_LASER_MAX_SPEED;
        
        if (laser.y < 0) {
            destroyLaser(container, laser);
        }
        setPosition(laser.element, laser.x, laser.y);
        var r1 = laser.element.getBoundingClientRect();
        var enemies = GAME_STATE.enemies;
        
        if (GAME_STATE.BossOnMap === true) {
            var bossHp = document.querySelector('.bossHp')
            var bosses = GAME_STATE.bosses[0];
            var rBoss = bosses.element.getBoundingClientRect();

            if (rectangleIntersection(r1, rBoss)) {
                BOSS_CONFIG.BOSS_HP -= 5;
                bossHp.innerText = 'Boss HP ' + BOSS_CONFIG.BOSS_HP;
                destroyLaser(container, laser);
                if (BOSS_CONFIG.BOSS_HP < 1) {
                    destroyBoss(container, bosses);
                }
            }
        }
        //użyć some array 
        // https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Obiekty/Array/some

        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            if (enemy.isDead) continue;
            var r2 = enemy.element.getBoundingClientRect();
            if (rectangleIntersection(r1, r2)) {
                destroyEnemy(container, enemy);
                destroyLaser(container, laser);
                break;
            }
        }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}
// ENEMY BOS

function createBoss(container, x, y) {
    var bossHp = document.createElement('div');
    bossHp.classList.add('bossHp');
    bossHp.innerText = 'Boss HP ' + BOSS_CONFIG.BOSS_HP;
    var element = document.createElement('img');
    element.src = "/Game/img/boss1.png";
    element.className = "boss";
    container.appendChild(bossHp);
    container.appendChild(element);

    var boss = {
        element,
        x,
        y,
        cooldown: rand(0.4, BOSS_CONFIG.BOSS_COOLDOWN),
    };

    GAME_STATE.bosses.push(boss);
    setPosition(element, x, y);
}

function destroyBoss(container, boss) {
    container.removeChild(boss.element);
    GAME_STATE.BossOnMap = false;
    GAME_STATE.playerWin = true;
}

function updateBoss(dataTime, container) {
    var bossDirectionX = Math.sin(GAME_STATE.lastTime / 1000.0) * BOSS_CONFIG.BOSS_MAX_SPEED;
    var bossDirectionY = Math.cos(GAME_STATE.lastTime / 1000.0) * 30;

    var bigBoss = GAME_STATE.bosses;
    bigBoss.map(boss => {
        var x = boss.x + bossDirectionX;
        var y = boss.y + bossDirectionY;
        setPosition(boss.element, x, y);
        boss.cooldown -= dataTime;
        if (boss.cooldown <= 0 && GAME_STATE.BossOnMap === true) {
            createBossLaser(container, x, y);
            boss.cooldown = BOSS_CONFIG.BOSS_COOLDOWN;
        }
    })
    GAME_STATE.bosses = GAME_STATE.bosses.filter(e => !e.isDead)
}
// BOS LASER

function createBossLaser(container, x, y) {
    var element = document.createElement('img');
    element.src = '/Game/img/laser-red-8.png';
    element.className = 'boss-laser';

    container.appendChild(element);

    var bossLaser = {
        element,
        x,
        y
    };
    GAME_STATE.bossLasers.push(bossLaser);

    var audio = new Audio("Game/sound/sfx-laser1.ogg");
    audio.play();
    setPosition(element, x, y);
}

function updateBossLaser(dataTime, container) {
    var lasers = GAME_STATE.bossLasers;
    var laserPositionX = BOSS_CONFIG.BOSS_WIDTH / 1.9;
    var laserPositionY = BOSS_CONFIG.BOSS_HEIGHT / 1.55;

    for (var i = 0; i < lasers.length; i++) {
        var laser = lasers[i];
        laser.y += dataTime * BOSS_CONFIG.BOSS_LASSER_MAX_SPEED;

        if (laser.y > GAME_CONFIG.GAME_HEIGHT) {
            destroyLaser(container, laser);
        }

        setPosition(laser.element, laser.x - laserPositionX, laser.y + laserPositionY);
        var r1 = laser.element.getBoundingClientRect();
        var player = document.querySelector(".player");
        var r2 = player.getBoundingClientRect();
        if (rectangleIntersection(r1, r2)) {
            destroyPlayer(container, player);
            destroyLaser(container, laser)
            break;
        }
    }
    GAME_STATE.bossLasers = GAME_STATE.bossLasers.filter(e => !e.isDead);
}
// ENEMY

function createEnemy(container, x, y) {
    var element = document.createElement('img');
    element.src = "/Game/img/enemy-red-4.png";
    element.className = "enemy";
    container.appendChild(element);

    var enemy = {
        element,
        x,
        y,
        cooldown: rand(0.4, ENEMY_CONFIG.ENEMY_COOLDOWN),
    };
    GAME_STATE.enemies.push(enemy);
    setPosition(element, x, y);
}

function destroyEnemy(container, enemy) {
    container.removeChild(enemy.element);
    var audio = new Audio("/Game/sound/coin_melody.mp3");
    audio.play();
    enemy.isDead = true;
}

function updateEnemies(dataTime, container) {
    var enemyDirectionX = Math.sin(GAME_STATE.lastTime / 1000.0) * 40;
    var enemyDirectionY = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

    var enemies = GAME_STATE.enemies;
    enemies.map(enemy => {
        var x = enemy.x + enemyDirectionX;
        var y = enemy.y + enemyDirectionY;
        setPosition(enemy.element, x, y);
        enemy.cooldown -= dataTime;
        if (enemy.cooldown <= 0) {
            createEnemyLaser(container, x, y);
            enemy.cooldown = ENEMY_CONFIG.ENEMY_COOLDOWN;
        }
    })
    GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead)
}
// ENEMY LASERS

function createEnemyLaser(container, x, y) {
    var element = document.createElement('img');
    element.src = '/Game/img/laser-red-5.png';
    element.className = 'enemy-laser';

    container.appendChild(element);

    var laser = {
        element,
        x,
        y
    };
    GAME_STATE.enemyLasers.push(laser);

    var audio = new Audio("Game/sound/sfx-laser1.ogg");
    audio.play();

    setPosition(element, x, y);
}

function updateEnemyLaser(dataTime, container) {
    var lasers = GAME_STATE.enemyLasers;
    for (var i = 0; i < lasers.length; i++) {
        var laser = lasers[i];
        laser.y += dataTime * ENEMY_CONFIG.ENEMY_LASER_MAX_SPEED;
        if (laser.y > GAME_CONFIG.GAME_HEIGHT) {
            destroyLaser(container, laser);
        }
        setPosition(laser.element, laser.x, laser.y);
        var r1 = laser.element.getBoundingClientRect();
        var player = document.querySelector(".player");
        var r2 = player.getBoundingClientRect();
        if (rectangleIntersection(r1, r2)) {
            destroyPlayer(container, player);
            break;
        }
    }
    GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isDead);
}
// RENDER GAME

function renderGame() {
    var currentTime = Date.now();
    var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;

    if (GAME_STATE.gameOver) {
        document.querySelector('.game-over').style.display = 'block';
        return;
    }
    if (playerWin()) {
        document.querySelector(".congratulations").style.display = "block";
        return;
    }
    var container = document.querySelector('.game');
    updatePlayer(dataTime, container);
    updateLaser(dataTime, container);
    updateBoss(dataTime, container);
    updateBossLaser(dataTime, container);
    updateEnemies(dataTime, container);
    updateEnemyLaser(dataTime, container);

    // if (GAME_CONFIG.music === false) {
    //     GAME_CONFIG.music = true;
    //     music();
    // }

    if (GAME_STATE.enemies <= 0) {
        doItOnce();
    }

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}
// KEY HANDLER

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