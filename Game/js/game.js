"use strict"
var GAME_CONTROL = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
};

var GAME_CONFIG = {
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
};

var GAME_STATE = {
  playerX: 0,
  playerY: 0
};

function setPosition(el, x, y) {
  el.style.transform = "translate(" + x + "px, " + y + "px)";
};

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

function onkeydown(e){
    if (e.keyCode === GAME_CONTROL.LEFT) {
        GAME_STATE.playerX -= 5;
        console.log(e.keyCode);

        var player =document.querySelector('.player');
        setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
    }
    if (e.keyCode === GAME_CONTROL.RIGHT) {
        GAME_STATE.playerX += 5
        var player =document.querySelector('.player');
        setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
    }
    

};
window.addEventListener('keydown', onkeydown);