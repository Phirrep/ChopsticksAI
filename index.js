const splitSlider = document.getElementById("splitSlider");
const hitSlider = document.getElementById("hitSlider");
var gameAgent = null;
/* splitSlider.style.display = "none"; */
//Takes in array of buttons that need to be disabled
function changeButtons(){
    if (player.turn){
        let a = ["hit", "split", "splitSlider", "target", "hand"];
        a.forEach(x => document.getElementById(x).style.display = "");
    }
    if (!player.turn || winner){
        let a = ["hit", "split", "splitSlider", "target", "hand"]
        a.forEach(x => document.getElementById(x).style.display = "none");
    }
    document.getElementById("targetLeft").style.display = (opponent.hand1 == 0? "none": "");
    if (opponent.hand1 == 0){
        document.getElementById("target").value = "right";
    }
    document.getElementById("targetRight").style.display = (opponent.hand2 == 0? "none": "");
    document.getElementById("attackLeft").style.display = (player.hand1 == 0? "none": "");
    if (player.hand1 == 0){
        document.getElementById("attack").value = "right";
    }
    document.getElementById("attackRight").style.display = (player.hand2 == 0? "none": "");
    document.getElementById("aiLeftHand").innerHTML = opponent.hand1;
    document.getElementById("aiRightHand").innerHTML = opponent.hand2;
    document.getElementById("playerLeftHand").innerHTML = player.hand1;
    document.getElementById("playerRightHand").innerHTML = player.hand2;
    let winnerDisplay = document.getElementById("winnerDisplay");
    if (winner === player){
        winnerDisplay.style.display = "";
        winnerDisplay.innerHTML = "Winner is player!";
    }
    else if (winner === opponent){
        winnerDisplay.style.display = "";
        winnerDisplay.innerHTML = "Winner is CPU!";
    }
}
function switchTurns(){
    player.turn = !player.turn;
    opponent.turn = !opponent.turn;
}

gameState.subscribe(changeButtons);
function playerHit(){
    let target = document.getElementById("target").value;
    let playerHand = document.getElementById("attack").value;
    player.hit(playerHand,target);
    switchTurns();
}
function playerSplit(){
    let splitValue = document.getElementById("splitValue");
    let leftHand = parseInt(splitValue.innerHTML[0]);
    let rightHand = parseInt(splitValue.innerHTML[2]);
    player.split(leftHand, rightHand);
    switchTurns();
}

function startGame(){
    //need to set random player/opponent's turn to true
    if (Math.random() * 2 > 1){
        player.turn = true;
    }
    else{
        opponent.turn = true;
    }
    player.default();
    opponent.default();
    let aiForm = document.getElementById("ai");
    let agent = document.getElementById("agent");
    let body = document.getElementsByTagName("body")[0];
    let script = document.createElement("script");
    if (aiForm.value == "random"){
        script.src = "agents/random.js";
        body.appendChild(script);
        gameAgent = new RandomAgent(opponent, player);
    }
    else if (aiForm.value == "minimax"){
        script.src = "agents/minimax.js";
        script.type = "text/javascript";
        body.appendChild(script);
        gameAgent = new MinimaxAgent(opponent, player);
    }
    else{
        gameAgent = new RandomAgent(opponent, player);
    }
    progress();
}
function updateSlider(){
    let splitValue = document.getElementById("splitValue");
    let total = player.hand1+player.hand2;
    splitSlider.max = total+1;
    splitSlider.max -= total > 4? (2*(total%4)):0;

    let minValue = Math.max(0, (total-4));

    splitValue.innerHTML = (splitSlider.value-1)+minValue;
    splitValue.innerHTML += ":";
    splitValue.innerHTML += minValue+(splitSlider.max-splitSlider.value);
}
function progress(){
    gameState.update();
    updateSlider();
    if (winner || !player.alive || !opponent.alive){
        console.log(winner);
    }
    else{
        window.requestAnimationFrame(progress);
    }
    if (opponent.turn){
        gameAgent.findMove({ai: opponent, opponent: player});
        gameState.update();
        switchTurns();
    }
}