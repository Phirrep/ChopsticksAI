var gameAgent = null;
//Takes in array of buttons that need to be disabled
function changeButtons(){
    document.getElementById("targetLeft").style.display = (opponent.hand1 == 0? "none": "");
    if (opponent.hand1 == 0){
        document.getElementById("target").value = "right";
    }
    else if (opponent.hand2 == 0){
        document.getElementById("target").value = "left";
    }
    document.getElementById("targetRight").style.display = (opponent.hand2 == 0? "none": "");
    document.getElementById("attackLeft").style.display = (player.hand1 == 0? "none": "");
    if (player.hand1 == 0){
        document.getElementById("attack").value = "right";
    }
    else if (player.hand2 == 0){
        document.getElementById("attack").value = "left";
    }
    document.getElementById("attackRight").style.display = (player.hand2 == 0? "none": "");
    document.getElementById("aiLeftHand").innerHTML = opponent.hand1;
    document.getElementById("aiRightHand").innerHTML = opponent.hand2;
    document.getElementById("playerLeftHand").innerHTML = player.hand1;
    document.getElementById("playerRightHand").innerHTML = player.hand2;
    
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
    console.log("You hit CPU's %s hand with %s hand", target, playerHand);
    gameState.update();
    switchTurns();
    window.requestAnimationFrame(progress);
}
function playerSplit(){
    let splitValue = document.getElementById("splitValue");
    let leftHand = parseInt(splitValue.innerHTML[0]);
    let rightHand = parseInt(splitValue.innerHTML[2]);
    player.split(leftHand, rightHand);
    console.log("You split to %d fingers and %d fingers", leftHand, rightHand);
    gameState.update();
    switchTurns();
    window.requestAnimationFrame(progress);
}

function startGame(){
    //need to set random player/opponent's turn to true
    if (Math.random() > 0.5){
        player.turn = true;
    }
    else{
        opponent.turn = true;
    }
    player.default();
    opponent.default();
    let aiForm = document.getElementById("ai");
    document.getElementById("split").style.display = "";
    document.getElementById("hand").style.display = "";
    if (aiForm.value == "random"){
        gameAgent = new RandomAgent(opponent, player);
    }
    else if (aiForm.value == "minimax"){
        gameAgent = new MinimaxAgent(opponent, player);
    }
    else if (aiForm.value == "minimaxRandom"){
        gameAgent = new MinimaxRandomAgent(opponent, player);
    }
    else{
        gameAgent = new RandomAgent(opponent, player);
    }
    progress();
}
function updateSlider(){
    let splits = player.viableSplits();
    if (splits.length !== 0){
        document.getElementById("split").style.display = "";
        let splitValue = document.getElementById("splitValue");
        let splitSlider = document.getElementById("splitSlider");

        splitSlider.max = splits.length;

        splitValue.innerHTML = splits[splitSlider.value-1].hand1;
        splitValue.innerHTML += ":";
        splitValue.innerHTML += splits[splitSlider.value-1].hand2;
    }
    else{
        document.getElementById("split").style.display = "none";
    }
}
function progress(){
    updateSlider();
    if (winner || !player.alive || !opponent.alive){
        document.getElementById("split").style.display = "none";
        document.getElementById("hand").style.display = "none";
        let winnerDisplay = document.getElementById("winnerDisplay");
        if (winner === player){
            winnerDisplay.style.display = "";
            winnerDisplay.innerHTML = "Winner is player!";
        }
        else if (winner === opponent){
            winnerDisplay.style.display = "";
            winnerDisplay.innerHTML = "Winner is CPU!";
        }
        console.log(winnerDisplay.innerHTML);
    }
    if (opponent.turn && !winner){
        gameAgent.findMove({ai: opponent.clone(), opponent: player.clone()});
        gameState.update();
        switchTurns();
    }
    if (!winner){
        window.requestAnimationFrame(progress);
    }
}