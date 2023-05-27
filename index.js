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
    if (!player.turn){
        let a = ["hit", "split", "splitSlider", "target", "hand"]
        a.forEach(x => document.getElementById(x).style.display = "none");
    }
}
function switchTurns(){
    player.turn = !player.turn;
    opponent.turn = !opponent.turn;
}

gameState.subscribe(changeButtons);
function playerHit(){
    let target = document.getElementById("target").value;
    let playerHand = document.getElementById("hand").value;
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
    let aiForm = document.getElementById("ai");
    let agent = document.getElementById("agent");
    if (aiForm.value == "random"){
        agent.src = "agents/random.js";
        gameAgent = new RandomAgent(opponent, player);
    }
    else{
        agent.src = "agents/random.js";
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
    if (winner || !player.alive || !opponent.alive){
        //Need to replace, have code to declare winner
        window.requestAnimationFrame(progress);
    }
    else{
        window.requestAnimationFrame(progress);
    }

    if (opponent.turn){
        gameAgent.findMove({ai: opponent, opponent: player});
        switchTurns();
    }
    updateSlider();
    gameState.update();
}