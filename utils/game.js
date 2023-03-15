const game = require("./players.js");
const player = game.player;
const opponent = game.opponent;
const gameState = game.gameState

var gameStatus = false;
var winner = null;
function checkOpponent(player){
    return function(){
        if (player.opponent.alive == false){
            winner = player;
            gameStatus = false;
        }
    }
}
gameState.subscribe(checkOpponent(player));
gameState.subscribe(checkOpponent(opponent));

//need to set random player/opponent's turn to true
if (Math.random() * 2 > 1){
    player.turn = true;
}
else{
    opponent.turn = true;
}

module.exports.gameState = gameState;