class RandomAgent extends Agent{
    constructor(ai, opponent){
        super(ai, opponent);
    }
    findMove(state){
        let actions = this.getLegalActions(state);
        let action = actions[Math.floor(Math.random()*actions.length)];
        executeAction(action);   
    }
}
