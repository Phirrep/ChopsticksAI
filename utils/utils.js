class Player{
    constructor(opponent=null, hand1=2, hand2=4, turn=false){
        this.hand1 = hand1;
        this.hand2 = hand2;
        this.opponent = opponent;
        this.turn = turn;
        this.alive = true;
        
    }
    //ourHand: int, opponentHand: String [key]
    hit(ourHand, opponentHand){
        if (opponentHand=="left"){
            this.opponent.hand1 += ourHand=="left"? this.hand1:this.hand2;
        }
        else{
            this.opponent.hand2 += ourHand=="left"? this.hand1:this.hand2;
        }
    }
    //Assume value1 + value2 = hand1 + hand2
    split(value1, value2){
        this.hand1 = value1;
        this.hand2 = value2;
    }
    update(){
        this.hand1 = this.hand1 >= 5? 0: this.hand1;
        this.hand2 = this.hand2 >= 5? 0: this.hand2;
        this.alive = (this.hand1 == 0 && this.hand2 == 0)? false: true;
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

var winner = null;
function checkOpponent(player){
    return function(){
        if (player.opponent.alive == false){
            winner = player;
        }
    }
}




const player = new Player();
const opponent = new Player();
player.opponent = opponent;
opponent.opponent = player;
const gameState = new Observer0();
gameState.subscribe(() => player.update());
gameState.subscribe(() => opponent.update());

gameState.subscribe(checkOpponent(player));
gameState.subscribe(checkOpponent(opponent));

