class MinimaxRandomAgent extends MinimaxAgent{
    constructor(ai, opponent, depth=7){
        super(ai, opponent, depth);
    }
    getMaximum(states){
        let maxStates = [];
        let max = states[0].value;
        for (let i = 0; i < states.length; i++){
            if (states[i] > max){
                maxStates = [];
                max = states[i].value;
            }
            if (states[i].value == max){
                maxStates.push(states[i]);
            }
        }
        return maxStates[Math.floor(Math.random() * maxStates.length)];
    }
    getMinimum(states){
        let minStates = [];
        let min = states[0].value;
        for (let i = 0; i < states.length; i++){
            if (states[i] < min){
                minStates = [];
                min = states[i].value;
            }
            if (states[i].value == min){
                minStates.push(states[i]);
            }
        }
        return minStates[Math.floor(Math.random() * minStates.length)];
    }
}