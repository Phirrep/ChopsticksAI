class AlphaBetaAgentTest extends AlphaBetaAgent{
    constructor(ai, opponent, depth=3){
        super(ai, opponent, depth);
    }
    getLegalActions(state){
        let actions = [];
        state.children.forEach(x => actions.push(x.action));
        return actions;
    }
    getSuccessor(state, action){
        return state.children.filter(x => x.action == action)[0].node;
    }
    isTerminal(state){
        state.checked = true;
        return state.children.length == 0;
    }
    getStateValue(state){
        console.log(state.value);
        return state.value;
    }
    switchState(state){
        return state;
    }
    executeAction(action){
        return;
    }
    printAction(action){
        console.log(action);
    }
}

testCase("Testing initialization of alphaBeta agent", () => {
    let agent1 = new AlphaBetaAgent();
    let agent2 = new AlphaBetaAgentTest();
    let agent3 = new AlphaBetaAgent(null, null, 10);
    let agent4 = new AlphaBetaAgentTest(null, null, 8);
});
testCase("Testing basic move finding for alphaBeta", () => {
    let player = new Player();
    let opponent = new Player();
    player.opponent = opponent;
    opponent.opponent = player;
    opponent.turn = true;
    let initial = player.clone();
    let agent = new MinimaxAgent(opponent, player, 3);
    agent.findMove({ai: opponent, opponent: player});

    assert(checkState(player, initial, (x,y) => x != y, {some: true, all: false}));

    let child1 = node(2, []);
    let child2 = node(9, []);
    let root = node(3, [{node: child1, action: "left"}, {node: child2, action: "right"}]);
    agent = new MinimaxAgentTest();
    assert(agent.findMove(root).action == "right");
});
testCase("Testing basic move finding against a min agent (no pruning)", () => {
    /*
                                max
                        min(2)          min(3)
                    7       2       4       3
    */
    let leaf1 = node(7, []);
    let leaf2 = node(2, []);
    let leaf3 = node(4, []);
    let leaf4 = node(3, []);
    let min1 = node(0, [{node: leaf1, action: "left"}, {node: leaf2, action: "right"}]);
    let min2 = node(0, [{node: leaf3, action: "left"}, {node: leaf4, action: "right"}]);
    let max1 = node(0, [{node: min1, action: "left"}, {node: min2, action: "right"}]);
    let agent = new AlphaBetaAgentTest();
    let move = agent.findMove(max1);
    console.log(max1);
    assert(move.value == 3, "invalid value " + move.value);
    assert(move.action == "right", "invalid action " + move.action);
});
testCase("Testing move finding with pruning", () => {
    /*                         max
                    min                     min
                2    3   4             0    3    3
    */
    let leaf1 = node(2, []);
    let leaf2 = node(3, []);
    let leaf3 = node(4, []);
    let leaf4 = node(0, []);
    leaf4.checked = false;
    let leaf5 = node(3, []);
    leaf5.checked = false;
    let leaf6 = node(3, []);
    let min1 = node(99, [{node: leaf1, action: "left"}, {node: leaf2, action: "center"}, {node: leaf3, action: "right"}]);
    let min2 = node(99, [{node: leaf4, action: "left"}, {node: leaf5, action: "center"}, {node: leaf6, action: "right"}]);
    let max1 = node(99, [{node: min1, action: "left"}, {node: min2, action: "right"}]);

    let agent = new MinimaxAgentTest();
    let move = agent.findMove(max1);
    assert(move.value == 2, "invalid minimax value " + move.value);
    assert(move.action == "left", "invalid action " + move.action);
    agent = new AlphaBetaAgentTest();
    move = agent.findMove(max1);
    assert(move.value == 2, "invalid value " + move.value);
    assert(move.action == "left", "invalid action " + move.action);
    assert(leaf4.checked == true, "leaf with value 0 not checked");
    assert(leaf5.checked == false, "leaf that should be pruned got checked");
});
testCase("Testing move finding with more advanced pruning", () => {
    /*                      max
                min(4)                   min(X)
        max(4)        max(X)      max            
    1       4      7           2      1
    */
    let leaf1 = node(2, []);
});