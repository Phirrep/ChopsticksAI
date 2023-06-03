class MinimaxAgent extends Agent{
    constructor(ai, opponent, depth=10){
        super(ai, opponent);
        this.depth = depth;
    }
    //Assumes states have value
    getMaximum(states){
        let max = states[0];
        for (let i = 0; i < states.length; i++){
            if (states[i].value > max.value){
                max = states[i];
            }
        }
        return max;
    }
    getMinimum(states){
        let min = states[0];
        for (let i = 0; i < states.length; i++){
            if (states[i].value < min.value){
                min = states[i];
            }
        }
        return min;
    }
    findMove(state){
        let recursiveMinimax = (state, depth) => {
            if (depth <= 0 || this.isTerminal(state)){
                return {value: this.getStateValue(state)};
            }
            let actions = this.getLegalActions(state);
            let maxStates = [];
            for (let i = 0; i < actions.length; i++){
                let successor = this.getSuccessor(state, actions[i]);
                if (this.isTerminal(successor)){
                    maxStates.push({value: this.getStateValue(successor), action: actions[i]});
                    continue;
                }
                //get the state relevant to the mini agent
                let minSuccessor = {ai: successor.opponent, opponent: successor.ai};
                let minActions = this.getLegalActions(minSuccessor);
                let minStates = [];
                for (let j = 0; j < minActions.length; j++){
                    let successor2 = this.getSuccessor(minSuccessor, minActions[j]);
                    let maxSuccessor = {ai: successor2.opponent, opponent: successor2.ai};
                    minStates.push(recursiveMinimax(maxSuccessor, depth-1));
                }
                let minValue = this.getMinimum(minStates);
                if (minValue){
                    minValue.action = actions[i];
                    maxStates.push(minValue);
                }
            }
            let maxValue = this.getMaximum(maxStates);
            return maxValue;
        }
        let minimaxState = recursiveMinimax(state, this.depth);
        this.executeAction(minimaxState.action);
        this.printAction(minimaxState.action);
    }
}