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
function changeButtons(){
    if (!player.turn){
        let a = ["hit", "split", "splitSlider", "hitSlider"]
        disableButtons(a);
    }
    else{
    }
}
gameState.subscribe(changeButtons);


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
function progress(){
    if (winner || !player.alive || !opponent.alive){
        window.requestAnimationFrame(progress);
    }
    gameState.update();
}