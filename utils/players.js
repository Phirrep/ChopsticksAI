class Player{
    constructor(opponent=null, hand1=1, hand2=1){
        this.hand1 = hand1;
        this.hand2 = hand2;
        this.opponent = opponent;
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
        }
    }
}

const player = new Player();
const opponent = new Player();
player.opponent = opponent;
opponent.opponent = player;

module.exports.player = player;
module.exports.opponent = opponent;
