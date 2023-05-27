class RandomAgent extends Agent{
    constructor(opponent){
        super(opponent);
    }
    findMove(){
        let actions = this.getLegalActions();
        let action = actions[Math.floor(Math.random()*actions.length)];
        return action;        
    }
}