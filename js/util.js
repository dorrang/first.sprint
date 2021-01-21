function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = ' cell' + i + '-' + j;
            strHTML += `<td onmousedown="cellClick(this,event,${i},${j}) "class="td ${className}">  </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    // console.log(location)
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerText = value;
}

function findEmptyCells() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) emptyCells.push({ i: i, j: j });
        }
    }
    return emptyCells;
}

function countNeighbors(cellI, cellJ, board) {
    var countNegs = 0;
    // var neighbors = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isShown) continue;
            if (board[i][j].isMine) {
                console.log(board[i][j]);
                countNegs++;
                // console.log(board[cellI][cellJ]);
            }
        }
    }
    // console.log(neighbors)
    return countNegs;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}