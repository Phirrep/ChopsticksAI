//New minimax agent for testing, doesn't change find move
class MinimaxAgentTest extends MinimaxAgent{
    constructor(ai, opponent, depth=3){
        super(ai, opponent, depth);
    }
    //state: {value, children (action, state)}
    getLegalActions(state){
        let actions = [];
        state.children.forEach(x => actions.push(x.action));
        return actions;
    }
    getSuccessor(state, action){
        return state.children.filter(x => x.action == action)[0];
    }
    isTerminal(state){
        return state.children.length == 0;
    }
    getStateValue(state){
        return state.value;
    }
}

testCase("Testing initialization of minimax", () => {
    let agent1 = new MinimaxAgent(null, null);
    let agent2 = new MinimaxAgentTest(null, null);
    let agent3 = new MinimaxAgent(null, null, 9);
    let agent4 = new MinimaxAgentTest(null, null, 10);
});
testCase("Testing basic move finding", () => {
    let player = new Player();
    let opponent = new Player();
    player.opponent = opponent;
    opponent.opponent = player;
    let initial = player.clone();
    let agent = new MinimaxAgent(opponent, player);
    agent.findMove({ai: opponent, opponent: player});
    
    assert(checkState(player, initial, (x,y) => x != y, {some: true, all: false}));
});

