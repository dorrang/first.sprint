'use strict';

const PLAYER = '🙂';
const MINE = '💣';
const FLAG = '📌';
const WIN = '🙃';
const LOSE = '💥';


var gLevel = { size: 4, mines: 2 };
var gEasy = { size: 4, mines: 2 };
var gMedium = { size: 8, mines: 12 };
var gHard = { size: 12, mines: 30 };

// gLevel = gEasy;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gElSelectedCell = null;
var gBoard = [];


function initGame() {
    gBoard = createBoard(gLevel)
    printMat(gBoard, '.board-container');
    addMines();
    gGame.isOn = true;

}

function difficulty(elLevelBtn) {
    if (elLevelBtn.innerText === 'Easy')
        gLevel = gEasy;
    else if (elLevelBtn.innerText === 'Medium')
        gLevel = gMedium;
    else if (elLevelBtn.innerText === 'Hard')
        gLevel = gHard;
    // clear()
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
                isShown: true,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            };
            board[i][j] = cell;
        }
    }
    return board;
}


function addMines() {
    var mineNum = gLevel.mines;
    console.log(mineNum)

    for (var i = 0; i < mineNum; i++) {
        var emptyCells = findEmptyCells();
        var randIdx = getRandomInt(0, gBoard.length);
        var emptyCell = emptyCells[randIdx];
        gBoard[emptyCell.i][emptyCell.j].isMine = true;
        // console.log(gBoard[emptyCell.i][emptyCell.j].isMine)
        renderCell(emptyCell, MINE);
        // emptyCells = [];
    }
    console.log(emptyCells)
}



function cellClick(elCell, i, j) {

    elCell.classList.toggle('selected');
    if (gElSelectedCell) {
        gElSelectedCell.classList.remove('selected');
    }

    gElSelectedCell = (gElSelectedCell === elCell) ? null : elCell;

    if (gElSelectedCell) {
        var pos = { i: i, j: j }
        showSeatDetails(pos)
    } else {
        hideSeatDetails()
    }
}