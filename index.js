const splitSlider = document.getElementById("splitSlider");
const hitSlider = document.getElementById("hitSlider");
/* splitSlider.style.display = "none"; */
//Takes in array of buttons that need to be disabled
function disableButtons(a){
    for (let i = 0; i < a.length; i++){
        let element = document.getElementById(a[0]);
        element.style.display = "none";
    }
}
function changeButtons(command){
    if (command=="hit"){
        
    }
    if (!player.turn){
        let a = ["hit", "split", "splitSlider", "target", "hand"]
        disableButtons(a);
    }
    else{
    }
}
//gameState.subscribe(changeButtons);
function playerHit(){
    let target = document.getElementById("target").value;
    let playerHand = document.getElementById("hand").value;
    player.hit(playerHand,target);
    console.log(player);
    console.log(opponent);
}
function playerSplit(){
    let splitValue = document.getElementById("splitValue");
    let leftHand = parseInt(splitValue.innerHTML[0]);
    let rightHand = parseInt(splitValue.innerHTML[2]);
    player.split(leftHand, rightHand);
}

function startGame(){
    //need to set random player/opponent's turn to true
    if (Math.random() * 2 > 1){
        player.turn = true;
    }
    else{
        opponent.turn = true;
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
        window.requestAnimationFrame(progress);
    }
    else{
        window.requestAnimationFrame(progress);
    }
    updateSlider();
    gameState.update();
}