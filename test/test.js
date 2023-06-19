let node = function(value, children){
    return {value: value, children: children};
}

function testCase(str, f){
    let element = document.createElement("div");
    try{
        f();
        element.innerHTML = "Passed! ";
        element.innerHTML += str;
    }
    catch(err){
        element.innerHTML = "Failed! ";
        element.innerHTML += str;
        for (let i = 0; i < 15; i++){
            element.innerHTML += "&emsp;";
        }
        element.innerHTML += err;
    }
    document.body.appendChild(element);
}
//state can be anything (obj)
function checkState(state1, state2, f, condition={some: false, all: true}){
    let passed = true;
    if (condition.some){
        passed = false;
        for (let key in state1){
            passed = f(state1[key], state2[key]) || passed;
        }
    }
    if (condition.all){
        passed = true;
        for (let key in state1){
            passed = f(state1[key], state2[key]) && passed;
        }
    }
    return passed;
}
//throws failure if false
function assert(exp, message=""){
    if (!exp){
        throw new Error("Assertion failed " + message);
    }
}


testCase("Testing random agent", () => {
    let player = new Player();
    let opponent = new Player();
    player.opponent = opponent;
    opponent.opponent = player;
    let initial = player.clone();
    let agent = new RandomAgent(opponent, player);
    agent.findMove({ai: opponent, opponent: player});
    
    assert(checkState(player, initial, (x,y) => x != y, {some: true, all: false}));
});
