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
        return state.children.filter(x => x.action == action)[0].node;
    }
    isTerminal(state){
        return state.children.length == 0;
    }
    getStateValue(state){
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

testCase("Testing initialization of minimax", () => {
    let player = new Player();
    let opponent = new Player();
    player.opponent = opponent;
    opponent.opponent = player;
    let agent1 = new MinimaxAgent(null, null);
    let agent2 = new MinimaxAgentTest(null, null);
    let agent3 = new MinimaxAgent(player, opponent, 4);
    let agent4 = new MinimaxAgentTest(player, opponent, 5);
});
testCase("Testing basic move finding", () => {
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
testCase("Testing basic move finding against min agent", () => {
    /*
                                max
                        min             min
                    -2      10        8      5                         
    */
    let leaf1 = node(-2, []);
    let leaf2 = node(10, []);
    let leaf3 = node(8, []);
    let leaf4 = node(5, []);
    let min1 = node(0, [{node: leaf1, action: "left"}, {node: leaf2, action: "right"}]);
    let min2 = node(0, [{node: leaf3, action: "left"}, {node: leaf4, action: "right"}]);
    let max1 = node(0, [{node: min1, action: "left"}, {node: min2, action: "right"}]);

    let agent = new MinimaxAgentTest();
    let move = agent.findMove(max1);
    assert(move.action == "right");
    assert(move.value == 5);
});
testCase("Testing basic move finding higher depth", () => {
    /*
                                max
                    min                     min
              max           max       max          max
          min      min   min   min  min   min  min      min
        -10 0    -7  2  -4 1  -8 0  8 2  10 14 -8 2    1   6
    */
    let leaf1 = node(-10, []);  let leaf2 = node(0, []);
    let leaf3 = node(-7, []);   let leaf4 = node(2, []);
    let leaf5 = node(-4, []);   let leaf6 = node(1, []);
    let leaf7 = node(-8, []);   let leaf8 = node(0, []);
    let leaf9 = node(8, []);    let leaf10 = node(2, []);
    let leaf11 = node(10, []);  let leaf12 = node(14, []);
    let leaf13 = node(-8, []);  let leaf14 = node(2, []);
    let leaf15 = node(1, []);   let leaf16 = node(6, []);
    let min1d2 = node(0, [{node: leaf1, action: "left"}, {node: leaf2, action: "right"}]);
    let min2d2 = node(0, [{node: leaf3, action: "left"}, {node: leaf4, action: "right"}]);
    let min3d2 = node(0, [{node: leaf5, action: "left"}, {node: leaf6, action: "right"}]);
    let min4d2 = node(0, [{node: leaf7, action: "left"}, {node: leaf8, action: "right"}]);
    let min5d2 = node(0, [{node: leaf9, action: "left"}, {node: leaf10, action: "right"}]);
    let min6d2 = node(0, [{node: leaf11, action: "left"}, {node: leaf12, action: "right"}]);
    let min7d2 = node(0, [{node: leaf13, action: "left"}, {node: leaf14, action: "right"}]);
    let min8d2 = node(0, [{node: leaf15, action: "left"}, {node: leaf16, action: "right"}]);
    let max1d2 = node(0, [{node: min1d2, action: "left"}, {node: min2d2, action: "right"}]);
    let max2d2 = node(0, [{node: min3d2, action: "left"}, {node: min4d2, action: "right"}]);
    let max3d2 = node(0, [{node: min5d2, action: "left"}, {node: min6d2, action: "right"}]);
    let max4d2 = node(0, [{node: min7d2, action: "left"}, {node: min8d2, action: "right"}]);
    let min1d1 = node(0, [{node: max1d2, action: "left"}, {node: max2d2, action: "right"}]);
    let min2d1 = node(0, [{node: max3d2, action: "left"}, {node: max4d2, action: "right"}]);
    let max1d1 = node(0, [{node: min1d1, action: "left"}, {node: min2d1, action: "right"}]);
    
    let agent = new MinimaxAgentTest();
    let move1 = agent.findMove(max1d1);
    let move2 = agent.findMove(max1d2);
    let move3 = agent.findMove(max2d2);
    let move4 = agent.findMove(max3d2);
    let move5 = agent.findMove(max4d2);
    assert(move2.action == "right");
    assert(move2.value == -7);
    assert(move3.action == "left");
    assert(move3.value == -4);
    assert(move4.action == "right");
    assert(move4.value == 10);
    assert(move5.action == "right");
    assert(move5.value == 1);

    assert(move1.action == "right");
    assert(move1.value == 1);
});
testCase("Testing move finding with limited depth", () => {
    /*
                max                 d1
                min
                max                 d2
                min
                max                 d3
                min
          7             8           d4
      10     -8      2     9
    */
    let leaf1 = node(10, []);   let leaf2 = node(-8, []);
    let leaf3 = node(2, []);    let leaf4 = node(9, []);
    let max1d4 = node(7, [{node: leaf1, action: "left"}, {node: leaf2, action: "right"}]);
    let max2d4 = node(8, [{node: leaf3, action: "left"}, {node: leaf4, action: "right"}]);
    let min1d3 = node(0, [{node: max1d4, action: "left"}, {node: max2d4, action: "right"}]);
    let max1d3 = node(99, [{node: min1d3, action: "move"}]);
    let min1d2 = node(0, [{node: max1d3, action: "move"}]);
    let max1d2 = node(0, [{node: min1d2, action: "move"}]);
    let min1d1 = node(0, [{node: max1d2, action: "move"}]);
    let max1d1 = node(0, [{node: min1d1, action: "move"}]);

    let agent = new MinimaxAgentTest(null, null, 3);
    let move = agent.findMove(max1d1);
    assert(move.value == 7);
    assert(move.action == "move");
    agent = new MinimaxAgentTest(null, null, 2);
    move = agent.findMove(max1d1);
    assert(move.value == 99);
    assert(move.action == "move");
});
