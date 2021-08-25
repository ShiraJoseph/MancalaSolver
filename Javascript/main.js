/**
 * Mancala Solver
 * Shira Joseph 2021
 * 
 * |-------------------------------------|
 * |  /  \ [ ] [ ] [ ] [ ] [ ] [ ] /  \  |
 * |  \  / [ ] [ ] [ ] [ ] [ ] [ ] \  /  |
 * |-------------------------------------|
 * 
 * This small application analyzes the classic game of Mancala to determine the best possible sequence of moves to use
 * on the first player's first turn.
 *
 * This program shows that there are over 22K combinations of moves that can be made, and many of them
 * win the game without the second person even having a turn. The maximum score one can get on a first turn -- through
 * only two winning combinations -- is 45. That is out of a total of only 48 stones on the entire board.
 *
 * 5214255101014355350145150:
 * |-------------------------------------|
 * |  /  \ [0] [0] [0] [1] [0] [1] /  \  |
 * |  \  / [0] [0] [0] [1] [0] [0] \45/  |
 * |-------------------------------------|
 *
 * 52140044502351554150525453:
 * |-------------------------------------|
 * |  /  \ [2] [0] [1] [0] [0] [0] /  \  |
 * |  \  / [0] [0] [0] [0] [0] [0] \45/  |
 * |-------------------------------------|
 */


init();

/**
 * Starts a game of Mancala with beginning layout and initiates the first-move analysis
 */
function init() {
    this.currentLayout = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4];
    this.currentBin = 0;
    this.attempts = [{ moves: [{bin: this.currentBin, layout: this.currentLayout.slice()}], total: 0 }];

    playMove();
}

/**
 * Stores the current layout and bin in the current attempt
 * @param layout
 * @param bin
 */
function recordNewMove(layout, bin) {
    this.attempts[this.attempts.length - 1].moves.push({bin: bin, layout: layout});
    this.currentLayout = layout.slice();
    this.currentBin = bin;
}

/**
 * Adds a new line to the list of attempts and starts the next combination of moves.
 * @returns {boolean}
 */
function createNewLineWithNextMove() {
    let prevMoves = this.attempts[this.attempts.length - 1].moves.slice();
    let nextMove = getMoveToContinueFrom(prevMoves);
    if (!nextMove){
        return false;
    }
    let nextLine = prevMoves.slice(0, nextMove.moveIndex);
    this.attempts.push({moves: nextLine, total: 0});
    recordNewMove(prevMoves[nextMove.moveIndex].layout, nextMove.bin);
    return true;
}

/**
 * Backtracks through the previous set of moves until it finds the move from which it should attempt the next combination
 * Doing it this way is more efficient than running through each move for every combination.
 * @example
 * If we just tried these bins in sequence: 4, 1, 3;
 * for the next attempt, first check the layout for that third move. Since the third move was 3, see if bins 4 or 5 are not empty.
 * If they are both empty, revert to the layout that was recorded for the second move, and find the first bin after 1 that is not empty.
 * If none are empty, revert to the layout for the first move, 4, and check bin 5.  If it is not empty, return that move.
 * @param moves
 * @returns {{bin, moveIndex: number}}
 */
function getMoveToContinueFrom(moves) {
    for (let i = moves.length - 1; i > -1; i--) {
        let lastBin = moves[i].bin;
        if (lastBin < 5) {
            let nextNonEmptyBin = moves[i].layout.findIndex((currBin, j) => currBin > 0 && j > lastBin && j < 6);
            if (nextNonEmptyBin > -1) {
                return {moveIndex: i, bin: nextNonEmptyBin};
            }
        }
    }
}

/**
 * The closing move of the game allows the user to include in the pot both the stone in the ending bin and any stones
 * in the bin opposite it on the board.  Add up the total in the pot and store that in the record.
 */
function completeLine(){
    if (this.currentBin !== 6) {
        let opposite = 12 - this.currentBin;
        this.currentLayout[6] = this.currentLayout[6] + 1 + this.currentLayout[opposite];
    }
    this.attempts[this.attempts.length - 1].total = this.currentLayout[6];
}

/**
 * The core looper that drives each move. A move ends and the next one starts when the last stone dispensed
 * lands in the pot (bin 6).
 * If the last stone lands in an empty bin that is not the pot, the turn is over and a new attempt is started.
 * If also ends the attempt if the last stone lands in the pot but bins 0-5 are all empty
 */
function playMove() {
    let currentMoves = [];
    let shouldContinue = true;
    while(!(currentMoves.length === 1 && currentMoves[0].bin === 6) && shouldContinue) {
        currentMoves = this.attempts[this.attempts.length - 1].moves;
        dealStones();
        if (this.currentLayout.slice(0, 6).every(bin => bin === 0) || (this.currentLayout[this.currentBin] === 1 && this.currentBin !==6) ) {
            completeLine();
            shouldContinue = createNewLineWithNextMove();
        } else if (this.currentBin === 6) {
            recordNewMove(this.currentLayout, this.currentLayout.findIndex((slot, i) => slot > 0 && i < 6));
        }
    }
    logResults();
}

/**
 *  It dispenses stones from the current bin, one at a time, to subsequent bins on the board. Once it has dispensed all
 *  the stones it repeats the process with that last bin that received a stone as the next current bin.
 */
function dealStones() {
    let stones = this.currentLayout[this.currentBin];
    this.currentLayout[this.currentBin] = 0;
    while (stones > 0) {
        this.currentBin++;
        if (this.currentBin === 13) {
            this.currentBin = 0;
        }
        this.currentLayout[this.currentBin]++;
        stones--;
    }
}

/**
 * Returns the first-move analysis information:
 *      - the list of all possible combinations of moves that can be made on the first turn of a Mancala game.
 *      - the combination(s) that result in the highest possible score and win the game in one turn.
 */
function logResults() {
    let highestTotal = Math.max(...this.attempts.map(line => line.total));
    let winningLines = this.attempts.filter(line => line.total === highestTotal);
    let completeLog = this.attempts.map(line => line.moves.map(move => move.bin).join(',') + '. ' + line.total).join('\n');

    console.log(`Done. \nMax = ${highestTotal}\nWinners: ${JSON.stringify(winningLines)}\n\n` + completeLog;
}
