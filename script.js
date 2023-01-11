// Khai bao cac CONSTANTS
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_MAPPING = [
  "#e00ee0",
  "yellow",//
  "blue",//
  "#ADFF2F",//
  "red",//
  "cyan",//
  "#08c808",
  "black",
];

const WHITE_COLOR_ID = 7;
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const gameOOver=document.getElementById('gameOver')
const playBtn= document.getElementById('play-btn')

let playgame

const BRICK_LAYOUT = [
  [
    [
      [1, 7, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 1],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 1, 7],
      [7, 1, 7],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [7, 1, 7],
      [7, 1, 1],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 1],
      [1, 1, 1],
      [7, 7, 7],
    ],
  ],
  [
    [
      [1, 7, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 1, 1],
      [1, 1, 7],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 7, 7],
      [7, 1, 1],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [1, 1, 7],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 7, 1],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 7],
      [7, 1, 1],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
    ],
    [
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 1, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
  ],
];

const KEY_CODES = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};


// Khai bao chieu cao, chieu rong cua BOARD
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Save the score
const NO_OF_HIGH_SCORES = 5;
const HIGH_SCORES = 'highScores';

function saveHighScore(score, highScores) {
  const name = prompt('You got a highscore! Enter name:');
  const newScore = { score, name };
  
  // 1. Add to list
  highScores.push(newScore);

  // 2. Sort the list
  highScores.sort((a, b) => b.score - a.score);
  
  // 3. Select new list
  highScores.splice(NO_OF_HIGH_SCORES);
  
  // 4. Save to local storage
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
};

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const highScoreList = document.getElementById('high-score');
  
  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.name} - ${score.score}`)
    .join('');
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES-1]?.score ?? 0;
  
  if (score > lowestScore) {
    saveHighScore(score, highScores); // TODO
    showHighScores(); // TODO
  }
}

// show score when load page
showHighScores()


// Tao class BOARD
class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.grid = this.generateWhiteBoard();
    this.score=0;
    this.gameOver=false;
    this.isPlay=false;
  }

  // Khai bao array gom 10 phan tu, tuong ung 10 hang
  // Moi hang la mot array gom 10 item, tuong ung 10 cot
  generateWhiteBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID));
  }

  //  Tao ra khoi gach hinh vuong
  drawCell(xAxis, yAxis, colorId) {
    this.ctx.fillStyle = COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID];
    this.ctx.fillRect(xAxis*BLOCK_SIZE, yAxis*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    this.ctx.fillStyle='white'
    this.ctx.strokeRect(xAxis*BLOCK_SIZE, yAxis*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  //  Tao board bang khoi gach mau trang
  drawBoard() {
    for( let row = 0; row < this.grid.length; row ++){
        for(let col =0; col < this.grid[0].length; col ++){
            this.drawCell(col, row, this.grid[row][col])
        }
    }
  }

  // handle game over


  // handle refresh when gameOver
  handleRefresh(){
    this.grid=this.generateWhiteBoard()
    this.score=0;
    this.gameOver=false;
    this.isPlay=false
    this.drawBoard()
    gameOOver.innerHTML=''
  }
}



// // Tao khoi gach theo layout 
class Brick {
  // id truyen vaof ca BRICK_LAYOUT[id] vaf COLOR_MAPPING[id]
  constructor(id) {
    this.id = id
    this.layout = BRICK_LAYOUT[id]   //lay ra khoi gach
    this.activeIndex = 0    //lay ra huong cua khoi gach
    this.colPos = 4     // lay ra toa do xAxis
    this.rowPos =-2  //Lay ra toa do yAsix
  }

  drawLayout() {
    for(let row=0; row < this.layout[this.activeIndex].length; row ++){
      for( let col = 0; col < this.layout[this.activeIndex][0].length; col++){
        if(this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID){
          board.drawCell(col + this.colPos, row + this.rowPos, this.id)
        }
      }
    }
  }

  clearLayout() {
    for(let row=0; row < this.layout[this.activeIndex].length; row ++){
      for( let col = 0; col < this.layout[this.activeIndex][0].length; col++){
        if(this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID){
          board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID)
        }
      }
    }
  }

  // check next col
  moveLeft(){
    if(!this.isCollision(this.rowPos, this.colPos-1, this.layout[this.activeIndex])){
      this.clearLayout()
      this.colPos--;
      this.drawLayout();
    }
  }

  moveRight(){
    if(!this.isCollision(this.rowPos, this.colPos+1, this.layout[this.activeIndex])){
      this.clearLayout()
      this.colPos++;
      this.drawLayout();
    }
  }

  // check next row
  moveDown(){
    if(!this.isCollision(this.rowPos+1, this.colPos, this.layout[this.activeIndex])){
      this.clearLayout()
      this.rowPos++;
      this.drawLayout();
      return;
    }
    else{
      this.handleLanded();
      if(!board.gameOver && board.isPlay){
        generateNewBrick()
      }
    }
  }

  // check next layout
  rotate(){
    if(!this.isCollision(this.rowPos, this.colPos,this.layout[(this.activeIndex+1)%4])){
      this.clearLayout()
      this.activeIndex=(this.activeIndex + 1) % 4
      this.drawLayout()
    }
  }

  // check if brick collide board border
  isCollision(nextRowPos, nextColPos, nextLayout){
    for(let row=0; row < nextLayout.length; row ++){
      for( let col = 0; col < nextLayout[0].length; col++){
        if(nextLayout[row][col] !== WHITE_COLOR_ID && nextRowPos>=0){
          if(
              col+nextColPos >= COLS 
              || col+nextColPos<0 
              || row+nextRowPos>=ROWS
              || board.grid[row + nextRowPos][col+nextColPos] !== WHITE_COLOR_ID
          ){
            return true;
          }
        }
      }
    }
    return false
  }

  // handle if the brick collide border-bottom
  handleLanded(){
    if(this.rowPos <= 0 ) {
      handleGameOver()
      return;
    }
    for(let row=0; row < this.layout[this.activeIndex].length; row ++){
      for( let col = 0; col < this.layout[this.activeIndex][0].length; col++){
        if(this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID){
          board.grid[row+this.rowPos][col+this.colPos]=this.id
      }
     }
    }
    this.handleRows()
    board.drawBoard()
  }

  handleRows(){
    const UnCompletedRow=board.grid.filter(row => ( 
      row.some(col => col === WHITE_COLOR_ID)
    ))
    const newScore= ROWS -UnCompletedRow.length;
    const newRows=Array.from({length: newScore}, ()=>Array(COLS).fill(WHITE_COLOR_ID))

    // If newscore update board again
    if(newScore){
      board.grid=[...newRows, ...UnCompletedRow]
      this.handleScore(newScore*10)
    }
  }


  handleScore(newScore){
    board.score+=newScore
    document.getElementById('score').innerHTML=board.score
  }
}

function generateNewBrick(){
  brick = new Brick(Math.floor(Math.random()*7))
}

// generate board and drawBoard
board = new Board(ctx);
board.drawBoard()
generateNewBrick()


// handle click to play
playBtn.addEventListener('click', ()=> {
  if(board.gameOver){
    board.handleRefresh()
  }
  if(playgame){
    board.isPlay=false
    playBtn.innerHTML='Pause'
    clearInterval(playgame)
    playgame=null;
  } 
  else 
  {
    board.isPlay=true
    playBtn.innerHTML='Play'
    playgame=setInterval(() => {
        brick.moveDown()
    }, 100)
    brick.drawLayout()
  }
}
)


// handle keydown to play
document.addEventListener('keydown', (e) => {
  if(!board.gameOver && board.isPlay){
    switch(e.code){
      case KEY_CODES.LEFT:
        brick.moveLeft()
        break
      case KEY_CODES.RIGHT:
        brick.moveRight()
        break
      case KEY_CODES.DOWN:
        brick.moveDown()
        break
      case KEY_CODES.UP:
      brick.rotate()
      break
    }
  }
})


handleGameOver=() =>{
  board.gameOver=true;
  gameOOver.innerHTML='Game Over'
  playBtn.innerHTML='Finish'
  checkHighScore(board.score);
  clearInterval(playgame)
  playgame=null
}







  // if(!board.gameOver){
  //   if(!board.isPlay){
  //     board.isPlay=true;
  //     generateNewBrick()
  //     playBtn.innerHTML='Play'
  //     var playGame=setInterval(()=>{
  //       brick.moveDown()
  //     },1000)
  //   } else {
  //     board.isPlay=false;
  //     playBtn.innerHTML='Pause'
  //     clearInterval(playGame)
  //   }
  // } else {
  //   playBtn.innerHTML='Play'
  //   board.handleRefresh()
  //   generateNewBrick()
  //   brick.drawLayout()
  //   playGame=setInterval(()=>{
  //     brick.moveDown()
  //   },1000)
  // }


  // debugger;
  // if(!board.isPlay && !board.gameOver)
  // {
  //     generateNewBrick()
  //     board.isPlay=true;
  //     playBtn.innerHTML='Play'
  //     var playGame=setInterval(()=>{
  //       brick.moveDown()
  //     },1000)
  // }
  // else if(board.isPlay && !board.gameOver)
  // {
  //     playBtn.innerHTML='Pause'
  //     board.isPlay=false
  //     clearInterval(playGame)
  // } 