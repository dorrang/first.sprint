'use strict';
const NORMAL = '🙂';
const MINE = '💣';
const MARK = '📌';
const WIN = '🙃';
const LOSE = '💥';
const EMPTY = '';


var gElLives = document.querySelector('.lives');
var gElScore = document.querySelector('h2 span');
var gNewGameBtn = document.querySelector('.play');

var gTimer = document.querySelector('.timer');
var gTimeInt;
var gTime = 1;

var gBoard;

var gLevel = { size: 4, mines: 2 };
var gEasy = { size: 4, mines: 2 };
var gMedium = { size: 8, mines: 12 };
var gHard = { size: 12, mines: 30 };

var gMines = [];
var gFirstClick = true;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2
}


function initGame() {
    clear();
    gElLives.innerText = 'LIVES: 💗💗💗';
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

// var gBest;

function bestScore() {
    var gBest = Infinity;
    var bestScore = -Infinity;
    if (gTime > bestScore) {
        bestScore = gTime;
    }
    if (bestScore < gBest) {
        gBest = bestScore;
    }

    var elBest = document.querySelector('.best');
    elBest.innerText = gBest - 1;
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
        emptyCells = findEmptyCells();
        randIdx = getRandomInt(0, emptyCells.length)
    }
    // console.log('gMines: ', gMines);
    // console.log(emptyCells)
}


function cellClick(elCell, event, i, j) {
    if (!gGame.isOn) return;
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
            startTime();
            negs = countNeighbors(i, j, gBoard);
            elCell.innerText = negs;
        }
    }

    if (event.button === 0) {
        cell.isShown = true;
        elCell.classList.add('shown');
        gGame.shownCount++;
        if (negs === 0 && !cell.isMine) {

            cell.isEmpty = true;
            elCell.innerText = EMPTY;
            expendNegs(i, j);
        } else if (cell.isShown) elCell.innerText = negs;
        for (var x = 0; x < gNoMineNegs.length; x++) {
            console.log(gNoMineNegs[0].i)
            var currEl = document.querySelector(`.cell${gNoMineNegs[x].i}-${gNoMineNegs[x].j}`)
            console.log(currEl)
        }


        if (cell.isMine) {
            if (gGame.lives > 0) {
                gGame.lives--;
                elCell.innerText = MINE;
                elCell.classList.add('mine');

                var lives = setTimeout(function() {
                    elCell.innerText = '';
                    cell.isShown = false;
                    elCell.classList.remove('shown');
                    elCell.classList.remove('mine');
                }, 1000);

                console.log(gElLives);

                if (gElLives.innerText === 'LIVES: 💗💗💗') {
                    gElLives.innerText = 'LIVES: 💗💗';
                } else if (gElLives.innerText === 'LIVES: 💗💗') {
                    gElLives.innerText = 'LIVES: 💗';
                }

                return lives;

            }
            if (gGame.lives === 0) {
                gElLives.innerText = 'NO LIVES';
                elCell.classList.add('mine');
                elCell.classList.add('shown');
                clearTimeout(lives);
                revealMines();
                gameOver();
            }
        }

    }

    if (event.button === 2) {

        if (cell.isShown) return;
        if (cell.isMarked) {
            cell.isMarked = false;
            gGame.markedCount--;
            elCell.innerText = '';
        } else {
            cell.isMarked = true;
            renderCell(cell, MARK);
            gGame.markedCount++;
        }
    }
    gElScore.innerText = gLevel.mines - gGame.markedCount

    checkWin()

}

function checkWin() {
    var markedMines = [];
    if (gGame.markedCount > gLevel.mines) return;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine && cell.isMarked) markedMines.push(cell);
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

var gNoMineNegs = [];

function expendNegs(cellI, cellJ) {
    var tempNegs = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var currNeg = gBoard[i][j];
            // console.log('i,j', i, j)
            if (currNeg.isMine) continue;
            if (currNeg.isMarked) continue;
            var elCurrNeg = document.querySelector(`.cell${i}-${j}`);
            // console.log('currNeg', currNeg);
            var negs = countNeighbors(i, j, gBoard);
            currNeg.minesAroundCount = negs;
            // console.log('i,j', i, j)
            if (currNeg.minesAroundCount === 0) {

                currNeg.isEmpty = true;
                currNeg.isShown = true;
                tempNegs.push(currNeg);
                elCurrNeg.classList.add('shown');
                elCurrNeg.innerText = EMPTY;
                // cellClick(elCurrNeg, event, currNeg.i, currNeg.j)
                // console.log('i,j', i, j)
                // console.log('noMineNeg check', noMineNegs[count]);
            } else {
                currNeg.isShown = true;
                elCurrNeg.classList.add('shown');
                elCurrNeg.innerText = currNeg.minesAroundCount;
            }

            // if (noMineNegs.length >= 1) {
            //     noMineNegs[count].minesAroundCount = countNeighbors(noMineNegs[count].i, noMineNegs[count].j, gBoard);
            //     // expendNegs(noMineNegs[count].i, noMineNegs[count].j);
            // }
        }
    }

    // gNoMineNegs = tempNegs;
    // console.log(gNoMineNegs[0])
    // for (var x = 0; x < gNoMineNegs.length; x++) {
    //     expendNegs(gNoMineNegs[x].i, gNoMineNegs[x], j);
    // }
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
    bestScore();
    clearInterval(gTimeInt);
    clear()
    gNewGameBtn.innerText = 'YOU ' + WIN + ' WIN!';
    // var gameOver = document.querySelector('.game-over-modal p');
    // gameOver.style.display = 'inline-block';
    // gameOver.innerText = 'Y O U ▪ W I N';
    // gNewGameBtn.style.display = 'block';
}

function gameOver() {
    console.log('game-over')
    clearInterval(gTimeInt);
    gTime = 0;
    clear()

    gNewGameBtn.innerText = 'YOU ' + LOSE + ' LOSE';
    // gameOver.style.display = "inline-block";
    // gNewGameBtn.style.display = 'block';
    // gameOver.innerText = 'G A M E ▪ O V E R';

}

function clear() {
    gGame.lives = 2;
    gElScore.innerText = gLevel.mines - gGame.markedCount;
    clearInterval(gTimeInt);
    gTime = 0;
    gFirstClick = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gMines = [];
    gGame.isOn = false;
    gNewGameBtn.innerText = NORMAL;

}

function toggleGame(elBtn) {
    clear();
    initGame();
    // elBtn.style.display = 'none';
    // var gameOver = document.querySelector('.game-over-modal p');
    // gameOver.style.display = "none";


}