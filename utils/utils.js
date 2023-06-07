class Player{
    constructor(opp=null, hand1=1, hand2=1, turn=false, f=(x,y)=>true, g=(x,y)=>true){
        this.hand1 = hand1;
        this.hand2 = hand2;
        this.opponent = opp;
        this.turn = turn;
        this.alive = true;
        this.splitRule = f;
        this.splits = g;
    }
    default(){
        this.hand1 = 1;
        this.hand2 = 1;
        this.alive = true;
    }
    setSplitRule(f){
        this.splitRule = f;
    }
    setSplits(f){
        this.splits = f;
    }
    allowSplit(){
        if (this.splitRule(this.hand1, this.hand2)){
            return true;
        }
    }
    //Returns valid values for splitting a hand
    viableSplits(){
        if (!this.allowSplit()){
            return [];
        }
        let total = this.hand1 + this.hand2;
        let minValue = Math.max(0, total-4);
        let actions = [];
        for (let i = 0; i < total+1-(total > 4? (2*(total%4)):0); i++){
            if (this.splits(minValue+i, total-(i+minValue))){
                actions.push({action: "split", hand1: minValue+i, hand2: total-(i+minValue)});
            }
        }
        return actions;
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
        this.alive = !(this.hand1 == 0 && this.hand2 == 0);
    }
    clone(){
        let newPlayer = new Player(null, this.hand1, this.hand2, this.turn, this.splitRule, this.splits);

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
//Set rule for only allowing splits when one hand is empty
player.setSplitRule((x, y) => x==0? !(y==0):y==0);
opponent.setSplitRule((x, y) => x==0? !(y==0):y==0);
let splits = function(p){
    return (x, y) => {
        if (p.hand1 == 0){
            if (x == p.hand2 || y == p.hand2){
                return false;
            }
        }
        else {
            if (x == p.hand1 || y == p.hand1){
                return false;
            }
        }
        return true;
    }
}
player.setSplits(splits(player));
opponent.setSplits(splits(opponent));

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
    isTerminal(state){
        return !state.ai.alive || !state.opponent.alive;
    }
    //state => int
    getStateValue(state){
        if (!state.ai.alive){
            return -10;
        }
        else if (!state.opponent.alive){
            return 10;
        }
        else{
            return 0;
        }
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
        if (ai.allowSplit()){
            ai.viableSplits().forEach(x => actions.push(x));
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
    printAction(action){
        if (action.action == "hit"){
            console.log("CPU hits your %s hand with %s hand", action.target, action.attack);
        }
        else{
            console.log("CPU splits to %d fingers and %d fingers", action.hand1, action.hand2);
        }
    }
}