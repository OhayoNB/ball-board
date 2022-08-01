var WALL = 'WALL'
var FLOOR = 'FLOOR'
var BALL = 'BALL'
var GAMER = 'GAMER'
var GLUE = 'GLUE'

var GAMER_IMG = '<img src="img/gamer.png" />'
var BALL_IMG = '<img src="img/ball.png" />'
var GLUE_IMG = '<img src="img/candy.png" />'

var gBoard
var gGamerPos

var gBallCount = 0
var elBallCount = document.querySelector('.ballsCount')
var gBallsInterval

var elRestartBtn = document.querySelector('.restart')
var gBallsLeft = 2

var gEatSound = new Audio('/sound/eat.mp3')

var gGlueInterval
var gIsSticky = false

var gIsGameOver = false

function initGame() {
  gGamerPos = { i: 2, j: 9 }
  gBoard = buildBoard()
  renderBoard(gBoard)
  gIsGameOver = false

  gBallsInterval = setInterval(addBall, 3000)
  gGlueInterval = setInterval(addGlue, 5000)

  elRestartBtn.style.display = 'none'
  elBallCount.style.display = 'none'
  gBallCount = 0
  gBallsLeft = 2
}

function buildBoard() {
  // Create the Matrix
  var board = createMat(10, 12)

  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // Put FLOOR in a regular cell
      var cell = { type: FLOOR, gameElement: null }

      // Place Walls at edges
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL
      }

      // Add created cell to The game board
      board[i][j] = cell
    }
  }

  // Place the gamer at selected position
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

  // Add passages
  board[0][board.length / 2].type = FLOOR
  board[board.length - 1][board.length / 2].type = FLOOR
  board[board.length / 2][0].type = FLOOR
  board[board.length / 2][board[0].length - 1].type = FLOOR

  // Place the Balls (currently randomly chosen positions)
  board[3][8].gameElement = BALL
  board[7][4].gameElement = BALL

  console.log(board)
  return board
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j]

      var cellClass = getClassName({ i: i, j: j })

      // TODO - change to short if statement
      if (currCell.type === FLOOR) cellClass += ' floor'
      else if (currCell.type === WALL) cellClass += ' wall'

      strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`

      // TODO - change to switch case statement
      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG
      }

      strHTML += '\t</td>\n'
    }
    strHTML += '</tr>\n'
  }

  //   console.log('strHTML is:')
  //   console.log(strHTML)
  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
  //   console.log(`gBoard[i][j]:`, gBoard[i][j])
  var targetCell = gBoard[i][j]

  if (gIsSticky) return
  if (gIsGameOver) return
  if (targetCell.type === WALL) return

  // Calculate distance to make sure we are moving to a neighbor cell
  //   console.log(`gGamerPos.i:`, gGamerPos.i)
  //   console.log(`gGamerPos.j:`, gGamerPos.j)

  //   console.log(`i:`, i)
  //   console.log(`j:`, j)

  var iAbsDiff = Math.abs(i - gGamerPos.i)
  var jAbsDiff = Math.abs(j - gGamerPos.j)

  //   console.log(`iAbsDiff:`, iAbsDiff)
  //   console.log(`jAbsDiff:`, jAbsDiff)
  //   console.log(`gBoard.length - 1:`, gBoard.length - 1)

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0) ||
    (iAbsDiff === gBoard.length - 1 && jAbsDiff === 0) ||
    (iAbsDiff === 0 && jAbsDiff === gBoard[i].length - 1)
  ) {
    if (targetCell.gameElement === BALL) {
      gBallCount++
      gBallsLeft--
      elBallCount.style.display = 'inline'
      elBallCount.innerText = `Balls collected - ${gBallCount}`
      gEatSound.play()
    }

    if (targetCell.gameElement === GLUE) {
      gIsSticky = true

      setTimeout(() => {
        gIsSticky = false
      }, 3000)
    }

    if (gBallsLeft === 0) {
      elBallCount.innerText = 'GAME OVER!'
      elRestartBtn.style.display = 'inline'
      gIsGameOver = true
      clearInterval(gBallsInterval)
      clearInterval(gGlueInterval)
    }

    // MOVING from current position
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
    // Dom:
    renderCell(gGamerPos, '')

    // MOVING to selected position
    // Model:
    gGamerPos.i = i
    gGamerPos.j = j
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    // DOM:
    renderCell(gGamerPos, GAMER_IMG)
  } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value = '') {
  var cellSelector = '.' + getClassName(location)
  var elCell = document.querySelector(cellSelector)
  elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {
  var i = gGamerPos.i
  var j = gGamerPos.j

  switch (event.key) {
    case 'ArrowLeft':
      if (j <= 0) moveTo(i, gBoard[i].length - 1)
      else moveTo(i, j - 1)
      break
    case 'ArrowRight':
      if (j >= gBoard[i].length - 1) moveTo(i, 0)
      else moveTo(i, j + 1)
      break
    case 'ArrowUp':
      if (i <= 0) moveTo(gBoard.length - 1, j)
      else moveTo(i - 1, j)
      break
    case 'ArrowDown':
      if (i >= gBoard.length - 1) moveTo(0, j)
      else moveTo(i + 1, j)
      break
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}

function addBall() {
  var emptyCells = getEmptyCells()
  if (emptyCells.length === 0) return

  var emptyCell = drawNum(emptyCells)
  //   var i = getRandomInt(1, 9)
  //   var j = getRandomInt(1, 11)

  //   while (gBoard[i][j].gameElement !== null) {
  //     var i = getRandomInt(1, 9)
  //     var j = getRandomInt(1, 11)
  //   }

  var i = emptyCell[0].i
  var j = emptyCell[0].j

  gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = BALL
  renderCell({ i, j }, BALL_IMG)
  gBallsLeft++
}

function addGlue() {
  var emptyCells = getEmptyCells()
  if (emptyCells.length === 0) return

  var emptyCell = drawNum(emptyCells)

  var i = emptyCell[0].i
  var j = emptyCell[0].j

  gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = GLUE
  renderCell({ i, j }, GLUE_IMG)

  setTimeout(() => {
    if (gBoard[emptyCell[0].i][emptyCell[0].j].gameElement === GLUE) {
      gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = null
      renderCell({ i, j })
    }
  }, 3000)
}
