/* BOARD SOLVER */

function isFull(board) { /* are all entries filled on the board - return true or false*/
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (!board[i][j]) return false;
  return true;
}

function getPossibleEntries(board, i, j) { /* which entries can possbly fit in board[i][j] - return array of entries */
  var allEntries = {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: ''
  };

  /* check vertical line */
  for (let y = 0; y < 9; y++) {
    var verticalEntry = board[y][j];
    if (verticalEntry in allEntries) delete allEntries[verticalEntry];
  }

  /* check horizontal line */
  for (let x = 0; x < 9; x++) {
    var horizontalEntry = board[i][x];
    if (horizontalEntry in allEntries) delete allEntries[horizontalEntry];
  }

  /* check box */
  var boxI = i - i % 3;
  var boxJ = j - j % 3;
  for (let y = boxI; y < boxI + 3; y++) {
    for (let x = boxJ; x < boxJ + 3; x++) {
      var boxEntry = board[y][x];
      if (boxEntry in allEntries) delete allEntries[boxEntry];
    }
  }

  return Object.keys(allEntries).map(function(key) {
    return parseInt(key);
  });
}

function setEntries(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      var boxId = 'box-' + String(i) + String(j);
      $('#' + boxId).find('input')[0].value = board[i][j];
    }
  }
}

function solveBoard(board) {
  setEntries(board);

  /* end condition */
  if (isFull(board)) return true;

  /* find an empty entry */
  var emptyI = 0,
    emptyJ = 0,
    emptyFound = false;
  for (let i = 0; i < 9 && !emptyFound; i++)
    for (let j = 0; j < 9 && !emptyFound; j++)
      if (!board[i][j]) {
        emptyI = i;
        emptyJ = j;
        emptyFound = true;
      }

  var possibleEntries = getPossibleEntries(board, emptyI, emptyJ);
  while (possibleEntries.length) {
    var possibleEntry = possibleEntries.pop();
    board[emptyI][emptyJ] = possibleEntry;
    if (solveBoard(board)) return true;
  }
  board[emptyI][emptyJ] = 0;
  return false;
}

/* BOARD SOLVER */

var solve = function() {
  var board = [];
  for (let i = 0; i < 9; i++) {
    board.push([]);
    for (let j = 0; j < 9; j++) {
      var boxId = 'box-' + String(i) + String(j);
      var input = $('#' + boxId).find('input');
      var boxValue = parseInt(input[0].value);
      if (boxValue) {
        input.removeClass('solved');
        board[i].push(boxValue);
      } else {
        input.addClass('solved');
        board[i].push(0);
      }
    }
  }

  solveBoard(board);
};

var initiateBoard = function() {
  var board = $('#board');
  for (let i = 0; i < 9; i++) {
    board.append('<tr id="row-' + i + '"></tr>');
    for (let j = 0; j < 9; j++) {
      var boxId = 'box-' + String(i) + String(j);
      $('#row-' + i).append('<td id="' + boxId + '"><input type="text"></td>');
      if (i % 3 == 0) $('#' + boxId).addClass('bordertop');
      if (j % 3 == 0) $('#' + boxId).addClass('borderleft');
    }
  }
  board.on('input', 'input', function(evt) {
    var value = evt.target.value;
    var intValue = parseInt(evt.target.value);
    if (value.length != 1 || !(intValue >= 1 && intValue <= 9)) evt.target.value = '';
  });
};

$(initiateBoard);
