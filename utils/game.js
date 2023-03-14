const game = require("./players.js");
const player = game.player;
const oppponent = game.opponent;
const gameState = game.gameState

var gameStart = false;
//need to set random player/opponent's turn to true
if (Math.random() * 2 > 1){
    player.turn = true;
}