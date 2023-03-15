class Player{
    constructor(opponent=null, hand1=1, hand2=1, turn=false){
        this.hand1 = hand1;
        this.hand2 = hand2;
        this.opponent = opponent;
        this.turn = turn;
        this.alive = true;
        //ourHand: int, opponentHand: String [key]
        this.hit = function(ourHand, opponentHand){
            this.opponent[opponentHand] += ourHand;
        }
        //Assume value1 + value2 = hand1 + hand2
        this.split = function(value1, value2){
            this.hand1 = value1;
            this.hand2 = value2;
        }
        this.update = function(){
            this.hand1 = this.hand1 >= 5? 0: this.hand1;
            this.hand2 = this.hand2 >= 5? 0: this.hand2;
            this.turn = !this.turn;
            this.alive = (this.hand1 == 0 && this.hand2 == 0)? false: true;
        }
    }
}
class Observer0{
    constructor(){
        this.clients = [];
        this.subscribe = function(f){
            this.clients.push(f);
        }
        this.update = function(){
            this.clients.forEach(x => x());
        }
    }
}

const player = new Player();
const opponent = new Player();
player.opponent = opponent;
opponent.opponent = player;
const gameState = new Observer0();
gameState.subscribe(player.update);
gameState.subscribe(opponent.update);

module.exports.player = player;
module.exports.opponent = opponent;
module.exports.gameState = gameState;