function createMat(ROWS, COLS) {
  var mat = []
  for (var i = 0; i < ROWS; i++) {
    var row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

function getEmptyCells() {
  var emptyCells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].gameElement === null && gBoard[i][j].type !== WALL)
        emptyCells.push({ i, j })
    }
  }
  return emptyCells
}

function drawNum(nums) {
  // console.log(`gNums.length:`, gNums.length)
  var num = getRandomInt(0, nums.length)
  var removedNum = nums.splice(num, 1)
  // console.log(`gNums:`, gNums)
  return removedNum
}
