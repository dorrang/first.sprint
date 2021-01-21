'use strict';

const MINE = '💣';
const MARK = '📌';
const WIN = '🙃';
const LOSE = '💥';
const EMPTY = '';

var gNewGameBtn = document.querySelector('.new-game');
var gTimer = document.querySelector('.timer');
var gTimeInt;
var gTime = 1;

var gBoard;

var gLevel = { size: 4, mines: 2 };
var gEasy = { size: 4, mines: 2 };
var gMedium = { size: 8, mines: 12 };
var gHard = { size: 12, mines: 30 };

var gMines = [];
var gElScore = document.querySelector('h2 span');
var gFirstClick = true;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    clear();
    gBoard = createBoard(gLevel)
    gGame.isOn = true;
    printMat(gBoard, '.board-container');
    console.log(gBoard)
}


function startTime() {
    gFirstClick = false;
    gMines = [];
    gTimeInt = setInterval(function() { gTimer.innerText = gTime++ }, 1000);
    gGame.secsPassed = gTime;
    addMines();
}


function difficulty(elLevelBtn) {
    if (elLevelBtn.innerText === 'Easy') gLevel = gEasy;
    else if (elLevelBtn.innerText === 'Medium') gLevel = gMedium;
    else if (elLevelBtn.innerText === 'Hard') gLevel = gHard;
    gElScore.innerText = gLevel.mines - gGame.markedCount;
    clear();
    initGame();
}

function addMines() {
    var emptyCells = findEmptyCells();
    console.log(emptyCells)
    var randIdx = getRandomInt(0, emptyCells.length);
    for (var i = 0; i < gLevel.mines; i++) {
        var mine = emptyCells[randIdx];
        gBoard[mine.i][mine.j].isMine = true;
        gMines.push(mine);
        // renderCell(mine, MINE);
        emptyCells = findEmptyCells();
        randIdx = getRandomInt(0, emptyCells.length)
    }
    console.log('gMines: ', gMines);
    console.log(emptyCells)
}


function cellClick(elCell, event, i, j) {
    if (gGame.isOn === false) return;
    var cell = gBoard[i][j];

    var negs = countNeighbors(i, j, gBoard);
    cell.minesAroundCount = negs;
    if (gFirstClick) {
        if (event.button !== 0) {
            startTime()
            negs = countNeighbors(i, j, gBoard);
        } else {
            elCell.classList.add('shown');
            cell.isShown = true;
            // gGame.shownCount++
            startTime();
            negs = countNeighbors(i, j, gBoard);
            elCell.innerText = negs;
        }
    }

    if (event.button === 0) {
        cell.isShown = true;
        elCell.classList.add('shown');
        // if (cell.isShown) gGame.shownCount++;
        if (negs === 0 && !cell.isMine) {
            // cell.isEmpty = true;
            // elCell.innerText = EMPTY;
            expendNegs(i, j);
        } else if (cell.isShown) elCell.innerText = negs;

        if (cell.isMine) {
            elCell.classList.add('mine');
            revealMines();
            gameOver();
        }
        // else if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) {
        //     win();
        // }
    }

    if (event.button === 2) {
        // console.log(cell);

        if (cell.isShown) return;
        if (cell.isMarked) {
            cell.isMarked = false;
            gGame.markedCount--;
            elCell.innerText = '';
        } else {
            cell.isMarked = true;
            // elCell.innerText = MARK;
            renderCell(cell, MARK);
            gGame.markedCount++;
        }
    }
    gElScore.innerText = gLevel.mines - gGame.markedCount
    checkWin()

    console.log('gGame.mark', gGame.markedCount)
    console.log('gGame.shown', gGame.shownCount)
    console.log('curr cell', cell);

}

function checkWin() {
    var markedMines = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine & cell.isMarked) markedMines.push(cell);
            if (markedMines.length === gLevel.mines)
                return win();
        }
    }
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) return win();
}

function revealMines() {
    for (var x = 0; x < gMines.length; x++) {
        var mine = gMines[x];
        renderCell(mine, MINE);
    }
}

function expendNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var currNeg = gBoard[i][j];
            var elCurrNeg = document.querySelector(`.cell${i}-${j}`);
            console.log('currNeg', currNeg);
            // if (currNeg.minesAroundCount === 0) {
            // currNeg.isEmpty = true;
            currNeg.isShown = true;
            elCurrNeg.classList.add('shown');
            elCurrNeg.innerText = EMPTY;
            // expendNegs(i, j);
            if (currNeg.minesAroundCount !== 0) {
                currNeg.isShown = true;
                elCurrNeg.classList.add('shown');
                elCurrNeg.innerText = currNeg.minesAroundCount;
                return;
            }

        }
    }
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

function win() {
    console.log('you win!')
    clearInterval(gTimeInt);
    clear()
    var gameOver = document.querySelector('.game-over-modal p');
    gameOver.style.display = 'inline-block';
    gameOver.innerText = 'Y O U ▪ W I N';
    gNewGameBtn.style.display = 'block';
}

function gameOver() {
    console.log('game-over')
    clearInterval(gTimeInt);
    gTime = 0;
    clear()
    var gameOver = document.querySelector('.game-over-modal p');
    gameOver.style.display = "inline-block";
    gNewGameBtn.style.display = 'block';
    gameOver.innerText = 'G A M E ▪ O V E R';

}

function clear() {
    gElScore.innerText = gLevel.mines - gGame.markedCount;
    clearInterval(gTimeInt);
    gTime = 0;
    gFirstClick = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gMines = [];
    gGame.isOn = false;

}

function toggleGame(elBtn) {
    clear();
    initGame();
    elBtn.style.display = 'none';
    var gameOver = document.querySelector('.game-over-modal p');
    gameOver.style.display = "none";


}

// function toggleGame(elBtn) {
//     gMines = [];
//     gFirstClick = true;
//     gGame.shownCount = 0;
//     gGame.markedCount = 0;
//     gGame.secsPassed = 0;
//     var gameOver = document.querySelector('.game-over-modal');
//     gameOver.style.display = 'none';
//     difficulty(gLevel);
//     initGame()


// }