class ReinforcementAgent extends Agent{
    constructor(ai, opponent, discount=0.8){
        super(ai, opponent);
        this.values = {};
        this.key = (state, action) => values[state][action];
    }
}