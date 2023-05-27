class Player{
    constructor(opponent=null, hand1=1, hand2=1, turn=false){
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
    clone(){
        let newPlayer = new Player(opponent=null, hand1=this.hand1, hand2=this.hand2, turn=this.turn);
        let newOpponent = new Player(opponent=null, hand1=this.opponent.hand1, hand2=this.opponent.hand2, turn=this.opponent.turn);
        newPlayer.opponent = newOpponent;
        newOpponent.opponent = newPlayer;
        return newPlayer;
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

class Agent{
    //ai: Player obj (ai's), opponent: Player obj (player)
    constructor(ai, opponent){
        this.ai = ai;
        this.opponent = opponent;
    }
    //State: {player (opponent), agent (ai)}
    getLegalActions(state){
        let actions = [];
        let ai = state.ai.clone();
        let opp = state.opponent.clone();
        if (!ai.hand1 == 0){
            if (!opp.hand1 == 0){ actions.push({action: "hit", attack: "left", target: "left"});}
            if (!opp.hand2 == 0){ actions.push({action: "hit", attack: "left", target: "right"});}
        }
        if (!ai.hand2 == 0){
            if (!opp.hand1 == 0){ actions.push({action: "hit", attack: "right", target: "left"});}
            if (!opp.hand2 == 0){ actions.push({action: "hit", attack: "right", target: "right"});}
        }
        let total = ai.hand1 + ai.hand2;
        let minValue = Math.max(0, total-4);
        for (let i = 0; i < total+1-(total > 4? (2*(total%4)):0); i++){
            actions.push({action: "split", hand1: minValue+i, hand2: total-i});
        }
        return actions;
    }
    getSuccessor(state, action){
        let ai = state.ai.clone();
        let opp = state.opponent.clone();
        ai.opponent = opp;
        if (action.action == "hit"){
            ai.hit(action.attack, action.target);
        }
        else{
            ai.split(action.hand1, action.hand2);
        }
        ai.update();
        opp.update();
        let newState = {ai: ai, opponent: opp};
        return newState;
    }
    //action: hit (ourHand, opponentHand) or split (hand1, hand2)
    executeAction(action){
        if (action.action == "hit"){
            this.ai.hit(action.attack, action.target);
        }
        else{
            this.ai.split(action.hand1, action.hand2);
        }
    }
}