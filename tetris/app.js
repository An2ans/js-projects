//this is just to create the grid to avoid copy and paste 200 divs

function createGrid(){
  for (let i=0; i<200; i++) {
      //creates div element
      var divElement = document.createElement("div");
      //Appending the div element to grid
      document.getElementsByClassName('grid')[0].appendChild(divElement);
  }
  for (let i=0; i<16; i++) {
      var divElement = document.createElement("div");
      document.getElementsByClassName('previous-grid')[0].appendChild(divElement);
  }


}

document.addEventListener("DOMContentLoaded", () => {

  createGrid();

  const startBtn = document.querySelector(".startBtn");
  const linesDisplay = document.querySelector(".lines-display");
  const scoreDisplay = document.querySelector(".score-display");

  const grid = document.querySelector(".grid");
  let squares = Array.from(grid.querySelectorAll("div"));
  const displaySquares = document.querySelectorAll(".previous-grid div");

  const colors = [
    "url(images/purple_block.png)",
    "url(images/green_block.png)",
    "url(images/peach_block.png)",
    "url(images/blue_block.png)",
    "url(images/yellow_block.png)"
  ];

  const width = 10;
  const height = 20;
  let currentPosition = 4;
  let currentIndex;
  let timerId;
  let score = 0;
  let lines = 0;

  //to have the last line in a diff color

  function addLastLine(){
    for (let i = 190; i < squares.length; i++) {
      squares[i].classList.add("block3");
    }
  }
  addLastLine();

  //Assign functions to keycodes

  function control(e){
    switch (e.keyCode) {
      case 39:
        moveRight();
        break;
      case 38:
        rotate();
        break;
      case 37:
        moveLeft();
        break;
      case 40:
        moveDown();
        break;
    }
  }

  document.addEventListener("keydown", control);



  //Tetrominoes

  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ];

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ];

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1,width, width+1, width*2+1]
  ];

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ];

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  //Select random Tetrominoes

  let random = Math.floor(Math.random()*theTetrominoes.length);
  let currentRotation = 0;
  let current = theTetrominoes[random][currentRotation];

  //draw/undraw the shape

  function draw(){
    current.forEach( index => {
      squares[currentPosition + index].classList.add("block");
      squares[currentPosition + index].style.backgroundImage = colors[random];

    });
  }

  function undraw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.remove("block");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  }

  //move shape down

  function moveDown(){
    undraw();
    currentPosition = currentPosition += width;
    draw();
    freeze();
  }

  //move right and left and prevent collisions with shapes

  function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if(!isAtRightEdge) currentPosition += 1;
    if(current.some(index => squares[currentPosition + index].classList.contains("block2"))){
      currentPosition -= 1;
    }
    draw();
  }

  function moveLeft(){
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!isAtLeftEdge) currentPosition -= 1;
    if(current.some(index => squares[currentPosition + index].classList.contains("block2"))){
      currentPosition += 1;
    }
    draw();
  }

  //rotate Tetrominoes

  function rotate(){
    undraw();
    currentRotation ++
    if(currentRotation === current.length){
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }


  //show previous shapes

  const displayWidth = 4;
  const displayIndex = 0;
  let nextRandom = 0;

  const smallTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], /* lTetromino */
    [0, displayWidth, displayWidth +1, displayWidth*2+1],  /* zTetromino */
    [1, displayWidth, displayWidth +1, displayWidth+2],  /* tTetromino */
    [0, 1, displayWidth, displayWidth+1],  /* oTetromino */
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]  /* iTetromino */
  ];

  function displayShape(){
    displaySquares.forEach(square => {
      square.classList.remove("block")
      square.style.backgroundImage = "none"
    });
    smallTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add("block")
      displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
    });
  }

  // freeze the shape

  function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains("block3")
    || squares[currentPosition + index + width].classList.contains("block2"))){
      current.forEach(index => squares[index + currentPosition].classList.add("block2"));

      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      gameOver();
      addScore();
    }
  }


//Add start button

  startBtn.addEventListener("click", () => {
    if(timerId){
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  })


  // game over

  function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains("block2"))){
      scoreDisplay.innerHTML = "Game Over";
      clearInterval(timerId);
    }
  }

  //add Score

  function addScore(){
    for(currentIndex = 0; currentIndex < 200; currentIndex += width){
      const row = [currentIndex, currentIndex +1, currentIndex+2, currentIndex+3, currentIndex+4, currentIndex+5, currentIndex+6, currentIndex+7, currentIndex+8, currentIndex+9];

      if(row.every(index => squares[index].classList.contains("block2"))){
        score += 10;
        lines += 1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;
        row.forEach(index => {
          squares[index].style.backgroundImage = "none";
          squares[index].classList.remove("block2") || squares[index].classList.remove("block");
        });
        //splice array
        const squaresRemoved = squares.splice(currentIndex, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }





});
