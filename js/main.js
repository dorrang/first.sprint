'use strict';

const PLAYER = '🙂';
const MINE = '💣';
const MARK = '📌';
const WIN = '🙃';
const LOSE = '💥';
const EMPTY = '';


var gLevel = { size: 4, mines: 2 };
var gEasy = { size: 4, mines: 2 };
var gMedium = { size: 8, mines: 12 };
var gHard = { size: 12, mines: 30 };

var gMines = [];

// gLevel = gEasy;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gElSelectedCell = null;
var gBoard;


function initGame() {
    gBoard = createBoard(gLevel)
    gGame.isOn = true;
    printMat(gBoard, '.board-container');
    addMines();
    // setMinesNegsCount(gBoard);
}

function clear() {

}

function difficulty(elLevelBtn) {
    if (elLevelBtn.innerText === 'Easy')
        gLevel = gEasy;
    else if (elLevelBtn.innerText === 'Medium')
        gLevel = gMedium;
    else if (elLevelBtn.innerText === 'Hard')
        gLevel = gHard;

    clear()
    initGame();
}

function toggleGame(elBtn) {

}

function createBoard(gLevel) {
    var size = gLevel.size;
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isEmpty: false,
                i: i,
                j: j
            };
            board[i][j] = cell;
        }
    }
    return board;
}

function addMines() {
    var emptyCells = findEmptyCells();
    var randIdx = getRandomInt(0, emptyCells.length);
    // console.log(randIdx, emptyCells)
    for (var i = 0; i < gLevel.mines; i++) {
        var mine = emptyCells[randIdx];
        // console.log(mine)
        gBoard[mine.i][mine.j].isMine = true;

        // console.log('cell i j', gBoard[mine.i][mine.j])
        gMines.push(mine);
        renderCell(mine, MINE);
        emptyCells = findEmptyCells();
        randIdx = getRandomInt(0, emptyCells.length)
    }
}

function cellClick(elCell, event, i, j) {
    // console.log(event)
    var cell = gBoard[i][j];
    var negs = countNeighbors(i, j, gBoard);
    cell.minesAroundCount = negs;
    elCell.classList.add('shown');
    elCell.isShown = true;

    if (elCell.innerText !== MINE && elCell.innerText !== MARK) {
        if (negs === 0) {
            cell.isEmpty = true;
            elCell.innerText = EMPTY;
        } else elCell.innerText = negs;
    }

    if (event.button === 2) {
        // if (cell.isEmpty) return;
        // if (cell.isShown) return;

        if (cell.isMarked) {
            renderCell(cell, '');
            cell.isShown = false;
            gGame.markedCount--;
            if (cell.isShown) return;
            elCell.classList.remove('shown');
        } else {
            gGame.markedCount++;
            cell.isMarked = true;
            renderCell(cell, MARK);
        }
    }

    if (elCell.innerText === MINE)
        gameOver();
    console.log(cell)

}

function gameOver() {
    gGame.isOn = false;


}