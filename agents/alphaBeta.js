class AlphaBetaAgent extends Agent{
    constructor(ai, opponent, depth=3){
        super(ai, opponent);
        this.depth = depth;
    }
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
        //Alpha determines value at which maximizer state will not choose node
        //Beta determines value at which minimizer will not choose node
        let recursiveAlphaBeta = (state, depth, alpha, beta) => {
            if (depth <= 0 || this.isTerminal(state)){
                return {value: this.getStateValue(state)};
            }
            let actions = this.getLegalActions(state);
            let maxStates = [];
            for (let i = 0; i < actions.length; i++){
                let successor = this.getSuccessor(state, actions[i]);
                if (this.isTerminal(successor)){
                    let value = this.getStateValue(successor);
                    maxStates.push({value: value, action: actions[i]});
                    alpha = alpha === null? value: Math.max(alpha, value);
                    continue;
                }
                
                let minSuccessor = this.switchState(successor);
                let minActions = this.getLegalActions(minSuccessor);
                let minStates = [];
                //Fresh new minimize node, must have no beta
                beta = null;
                for (let j = 0; j < minActions.length; j++){
                    let successor2 = this.getSuccessor(minSuccessor, minActions[j]);
                    let maxSuccessor = this.switchState(successor2);
                    let nextDepth = recursiveAlphaBeta(maxSuccessor, depth-1, alpha, beta);
                    beta = beta === null? nextDepth.value: Math.min(beta, nextDepth.value);
                    if (nextDepth.value < alpha){
                        break;
                    }
                    minStates.push(nextDepth);
                }
                let minValue = this.getMinimum(minStates);
                if (minValue){
                    alpha = alpha === null? minValue.value: Math.max(alpha, minValue.value);
                    if (minValue.value > beta){
                        break;
                    }
                    minValue.action = actions[i];
                    maxStates.push(minValue);
                }
            }
            console.log(maxStates);
            let maxValue = this.getMaximum(maxStates);
            return maxValue;
        }

        let alphaBetaState = recursiveAlphaBeta(state, this.depth, null, null);
        //console.log(alphaBetaState.value);
        this.executeAction(alphaBetaState.action);
        //this.printAction(alphaBetaState.action);
        return alphaBetaState;
    }
}