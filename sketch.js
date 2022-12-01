const BACK_COLOR = 60;
const SIDE_COLOR = 40
const BACK_OUTLINE_COLOR = 'rgb(130, 0, 0)';
const SCORE_BOX_COLOR = 240;
const SNEK_COLOR = 'rgb(0, 230, 0)';
const SNEK_OUTLINE_COLOR = 'black';
const MAP_SIZE_HOME = 21;
const MAP_SIZE_V1 = 10;
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

var SPEED = 1;
var CURR_DIFF = 0;
var MAP_SIZE;
var WIN_SIZE;
var GRID_WIDTH;
var ALL_SPOTS = [];
var STATUS;
var PREV_STATUS;
var SNEK;
var CURRENT_SCORE = 0;
var HIGH_SCORE = 0;
var V1_HIGH = 0;
var V2_HIGH = 0;
var OBJECT_LIST = [];
var BUTTON_LIST = [];
var BUTTON_POSITIONS = [];
var COUNTER;

function setup() { 
  MAP_SIZE = MAP_SIZE_HOME;
  WIN_SIZE = floor(min(windowHeight, windowWidth)/MAP_SIZE)*MAP_SIZE;
  GRID_WIDTH = WIN_SIZE/MAP_SIZE;

  cnv = createCanvas(1.5*WIN_SIZE,WIN_SIZE);
  cnv.parent('screen');
  cnv.position((windowWidth - 1.5*WIN_SIZE)/2,(windowHeight - WIN_SIZE)/2);

  startHomeScreen();
}

function draw() {

  if (STATUS === 'homescreen') {
    drawHomeScreen();
  } 
  else if (STATUS === 'playing one' || STATUS === 'playing two') {
    checkObjectCollision();
    drawGameFrame();
    if (SNEK.isSelfCollision() || SNEK.isWallCollision(0, 0, WIN_SIZE, WIN_SIZE)){
      endGame();
    }
    if ( STATUS === 'playing two' && SNEK.health == 0) {
      endGame();
    }
  }
  else if (STATUS === 'instructions') {
    drawInstructions();
  }
  else if (STATUS === 'endscreen'){
    drawEndScreen();
  }
}

function windowResized() {

  prev_grid_width = GRID_WIDTH;
  WIN_SIZE = floor(min(windowHeight, windowWidth)/MAP_SIZE)*MAP_SIZE;
  GRID_WIDTH = WIN_SIZE/MAP_SIZE;

  resizeCanvas(1.5*WIN_SIZE, WIN_SIZE);
  cnv.position((windowWidth - 1.5*WIN_SIZE)/2,(windowHeight - WIN_SIZE)/2);

  if (SNEK.tail.length > 0) {
    SNEK.size = GRID_WIDTH;
    SNEK.x = SNEK.x/prev_grid_width*GRID_WIDTH;
    SNEK.y = SNEK.y/prev_grid_width*GRID_WIDTH;
    for (var i=0; i<SNEK.tail.length; i++){
      SNEK.tail[i].x = SNEK.tail[i].x/prev_grid_width*GRID_WIDTH;
      SNEK.tail[i].y = SNEK.tail[i].y/prev_grid_width*GRID_WIDTH;
    }
  }

  if (OBJECT_LIST.length > 0) {
    for (var i=0; i<OBJECT_LIST.length; i++){
      if (OBJECT_LIST[i].type !== 'snek') {
        OBJECT_LIST[i].size = GRID_WIDTH;
        OBJECT_LIST[i].x = OBJECT_LIST[i].x/prev_grid_width*GRID_WIDTH;
        OBJECT_LIST[i].y = OBJECT_LIST[i].y/prev_grid_width*GRID_WIDTH;
      } else if (OBJECT_LIST[i].tail.length > 0){
        snek = OBJECT_LIST[i];
        snek.size = GRID_WIDTH;
        snek.x = snek.x/prev_grid_width*GRID_WIDTH;
        snek.y = snek.y/prev_grid_width*GRID_WIDTH;
        for (var i=0; i<snek.tail.length; i++){
          snek.tail[i].x = snek.tail[i].x/prev_grid_width*GRID_WIDTH;
          snek.tail[i].y = snek.tail[i].y/prev_grid_width*GRID_WIDTH;
        }
      }
    }
  }
 
  if (BUTTON_LIST.length > 0) {
    for (var i=0; i<BUTTON_POSITIONS.length; i++){
      posX = cnv.x + WIN_SIZE * BUTTON_POSITIONS[2*i];
      posY = cnv.y + WIN_SIZE * BUTTON_POSITIONS[2*i+1];
      var btn = BUTTON_LIST[i];
      btn.position(posX, posY);
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW){
    SNEK.change_dir('up');
  } else 
  if (keyCode === DOWN_ARROW){
    SNEK.change_dir('down');
  } else 
  if (keyCode === LEFT_ARROW){
    SNEK.change_dir('left');
  } else 
  if (keyCode === RIGHT_ARROW){
    SNEK.change_dir('right');
  } else
  if (key === 'p'){
    SNEK.change_dir('stop');
  // } else 
  // if (key === 'g'){
  //   SNEK.grow();
  } else 
  if (key === 'q'){
    endGame();
  }
  // if (key === 'a'){
  //   for (var i=0; i<20; i++){
  //     apple = createApple();
  //     OBJECT_LIST.push(apple);
  //   }
  // }
}


// --------------------------------------------------- Home Screen ----------------------------------------------------//
function startHomeScreen() {
  OBJECT_LIST = [];
  CURRENT_SCORE = 0;
  HIGH_SCORE = V1_HIGH + '/' + V2_HIGH;
  removeAllButtons();

  PREV_STATUS = STATUS;
  STATUS = 'homescreen';
  //------------------Create All Buttons -------------------------//
  btn1 = newButton(.12, .6, 'Play');
  btn1.mouseReleased(startGameOne);
  btn2 = newButton(.12, .8, 'Change Difficulty');
  btn2.mouseReleased(changeDifficulty);
  btn3 = newButton(.58, .6, 'Poison Apples');
  btn3.mouseReleased(startGameTwo);
  btn4 = newButton(.58, .8, 'Instructions');
  btn4.mouseReleased(startInstructionsPage);
 
  //------------------Create Apple Outline-------------------------//
  x = GRID_WIDTH; y = GRID_WIDTH*2;
  for (var i=1; i>-2; i-=2) {
    for (var j=0; j<18; j++) {
      apple = createApple(x=x, y=y);
      OBJECT_LIST.push(apple);
      x += GRID_WIDTH*i;
    }
    for (var j=0; j<8; j++) {
      apple = createApple(x=x, y=y);
      OBJECT_LIST.push(apple);
      y += GRID_WIDTH*i;
    }
  }

  SNEK = new SnakeHead(GRID_WIDTH, SNEK_COLOR, SNEK_OUTLINE_COLOR);
  //------------------Create "S" for SNEK-------------------------//
  x += GRID_WIDTH*4; y += GRID_WIDTH*2; SNEK.grow(x, y);
  for (var i=0; i < 2; i++){x -= GRID_WIDTH; SNEK.grow(x, y);}
  for (var i=0; i < 2; i++){y += GRID_WIDTH; SNEK.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; SNEK.grow(x, y);}
  for (var i=0; i < 2; i++){y += GRID_WIDTH; SNEK.grow(x, y);}
  for (var i=0; i < 2; i++){x -= GRID_WIDTH; SNEK.grow(x, y);}

  //------------------Create "N" for SNEK-------------------------//
  x += GRID_WIDTH*3.85; SNEK.grow(x,y);
  for (var i=0; i < 4; i++){y -= GRID_WIDTH;SNEK.grow(x, y);}
  for (var i=0; i < 4; i++){y += GRID_WIDTH;x += .6*GRID_WIDTH;SNEK.grow(x, y);}
  for (var i=0; i < 4; i++){y -= GRID_WIDTH;SNEK.grow(x, y);}


  //------------------Create "E" for SNEK-------------------------//
  x += GRID_WIDTH*3.85; SNEK.grow(x, y);
  for (var i=0; i < 2; i++){x -= GRID_WIDTH;SNEK.grow(x, y);}
  for (var i=0; i < 4; i++){y += GRID_WIDTH;SNEK.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH;SNEK.grow(x, y);}
  x -= GRID_WIDTH*2; y -= GRID_WIDTH*2;
  for (var i=0; i < 2; i++){x += GRID_WIDTH;SNEK.grow(x, y);}


  //------------------Create "K" for SNEK-------------------------//
  x += GRID_WIDTH*2;  y -= GRID_WIDTH*2; SNEK.grow(x,y);
  for (var i=0; i < 4; i++){y += GRID_WIDTH; SNEK.grow(x, y);}
  x += GRID_WIDTH*2.2; SNEK.grow(x, y);
  for (var i=0; i < 2; i++){y -= GRID_WIDTH; x -= .6*GRID_WIDTH; SNEK.grow(x, y);}
  for (var i=0; i < 2; i++){y -= GRID_WIDTH; x += .6*GRID_WIDTH; SNEK.grow(x, y);}

}

function drawHomeScreen() {
  drawBackground();
  drawObjects();
  SNEK.show();
}

// ------------------------------------------------ Instruction Page ---------------------------------------------------//
function startInstructionsPage() {
  OBJECT_LIST = [];
  CURRENT_SCORE = 0;
  HIGH_SCORE = V1_HIGH + '/' + V2_HIGH;
  SNEK = null;
  removeAllButtons();
  PREV_STATUS = STATUS;
  STATUS = 'instructions';

  btn = newButton(.65, .85, "Home Page");
  btn.mouseReleased(startHomeScreen);
}

function drawInstructions() {
  title = "INSTRUCTIONS";
  goal = "The goal of SNEK is to make your snake as long as possible. ";
  instructions = "Eating apples increases the length of your snake. Use the arrow keys to lead the snake to eat apples and powerups.";
  how_to_lose = "Avoid running into yourself and into walls!!!";

  drawBackground();
  //----------------------------- draw visual rectangle for instructions ----------------------------//
  fill(100); strokeWeight(1); stroke('black');
  rect(GRID_WIDTH, GRID_WIDTH*(MAP_SIZE/2 - 5), GRID_WIDTH*(MAP_SIZE-2), GRID_WIDTH*(MAP_SIZE/2));


  //------------------------------------- print intructions -----------------------------------------//
  fill('rgb(200, 200, 0)'); stroke(40); textSize(GRID_WIDTH); textAlign(CENTER); textStyle(BOLD);
  text(title, GRID_WIDTH, GRID_WIDTH, GRID_WIDTH*(MAP_SIZE-2), GRID_WIDTH*2);
  
  textSize(GRID_WIDTH/1.7); textStyle(NORMAL);
  text(goal, GRID_WIDTH, GRID_WIDTH*2.75, GRID_WIDTH*(MAP_SIZE-2), GRID_WIDTH*2);
  text(instructions, GRID_WIDTH, GRID_WIDTH*3.9, GRID_WIDTH*(MAP_SIZE-2), GRID_WIDTH*3);

  fill('rgb(250, 20, 20)'); textStyle(BOLD);
  text(how_to_lose, GRID_WIDTH, GRID_WIDTH*16.75, GRID_WIDTH*(MAP_SIZE-2), GRID_WIDTH*2);
  textStyle(NORMAL);
}

// --------------------------------------------------- Version 1  -----------------------------------------------------//
function startGameOne() {
 
  OBJECT_LIST = [];
  CURRENT_SCORE = 0;
  HIGH_SCORE = V1_HIGH;
  removeAllButtons();
  PREV_STATUS = STATUS;
  STATUS = 'playing one';
   
  frameRate(SPEED*10);
    
  snek_start = floor(MAP_SIZE/2)*GRID_WIDTH;
  SNEK = new SnakeHead(GRID_WIDTH, SNEK_COLOR, SNEK_OUTLINE_COLOR, snek_start, snek_start);
  SNEK.grow();
   
  for (var i=0; i < 5-CURR_DIFF*2; i++) {
    OBJECT_LIST.push(createApple(x=null, y=null)); 
  }
}


// --------------------------------------------------- Version 2  -----------------------------------------------------//
function startGameTwo() {
 
  OBJECT_LIST = [];
  CURRENT_SCORE = 0;
  HIGH_SCORE = V2_HIGH;
  removeAllButtons();
  PREV_STATUS = STATUS;
  STATUS = 'playing two';
   
  frameRate(10);
    
  snek_start = floor(MAP_SIZE/2)*GRID_WIDTH;
  SNEK = new SnakeHead(GRID_WIDTH, SNEK_COLOR, SNEK_OUTLINE_COLOR, snek_start, snek_start);
  SNEK.grow();
   
  for (var i=0; i < 3-CURR_DIFF; i++) {
    OBJECT_LIST.push(createApple(x=null, y=null)); 
  }
  for (var i=0; i<3+CURR_DIFF*3; i++){
    OBJECT_LIST.push(createApple(x=null, y=null, type='poison'));
  }
  
  
}


// ------------------------------------------------- End  Screen --------------------------------------------------------//
function endGame(){
  removeAllButtons();

  SNEK.change_dir('stop');
  SNEK.changeColor('rgb(21,71,52)');

  btn1 = newButton(.15, .45, 'Play Again?');
  if (STATUS === 'playing one') {
    btn1.mouseReleased(startGameOne);
    V1_HIGH = HIGH_SCORE;
  }
  else if (STATUS === 'playing two') {
    btn1.mouseReleased(startGameTwo);
    V2_HIGH = HIGH_SCORE;
  }  

  btn2 = newButton(.55, .45, 'Home Screen');
  btn2.mouseReleased(startHomeScreen);
  PREV_STATUS = STATUS;
  STATUS = 'endscreen';

  //------------------Create "G" in Game Over----------------------//
  end_snek = new SnakeHead(GRID_WIDTH, 'white', 'white');
  OBJECT_LIST.push(end_snek);

  x = GRID_WIDTH*4.5; y = GRID_WIDTH*4; end_snek.grow(x, y);
  x += GRID_WIDTH*.5; end_snek.grow(x, y);
  for (var i=0; i < 2; i++){y += GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}

  //------------------Create "A" in Game Over----------------------//
  x += GRID_WIDTH*2; y += GRID_WIDTH*4; end_snek.grow(x, y);
  for (var i=0; i < 4; i++){y -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y += GRID_WIDTH; end_snek.grow(x, y);}
  y -= GRID_WIDTH*2; x -= GRID_WIDTH; end_snek.grow(x, y);

  //------------------Create "M" in Game Over----------------------//
  x += GRID_WIDTH*2.8; y += GRID_WIDTH*2; end_snek.grow(x, y);
  for (var i=0; i < 4; i++){y -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 3; i++){x += GRID_WIDTH*.4; y += GRID_WIDTH*.75; end_snek.grow(x, y);}
  for (var i=0; i < 3; i++){x += GRID_WIDTH*.4; y -= GRID_WIDTH*.75; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y += GRID_WIDTH; end_snek.grow(x, y);}
  
  //------------------Create "E" for Game Over---------------------//
  x += GRID_WIDTH*3.8; y-=GRID_WIDTH*4; end_snek.grow(x, y);
  for (var i=0; i < 2; i++){x -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y += GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}
  x -= GRID_WIDTH*2; y -= GRID_WIDTH*2;
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}


  //------------------Create "O" in Game Over----------------------//
  x = GRID_WIDTH*3; y = GRID_WIDTH*14;
  for (var i=0; i < 4; i++){y += GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x -= GRID_WIDTH; end_snek.grow(x, y);}

  //------------------Create "V" in Game Over----------------------//
  x += GRID_WIDTH*3.8; end_snek.grow(x, y);
  for (var i=0; i < 4; i++){y += GRID_WIDTH; x+=GRID_WIDTH*.30; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y -= GRID_WIDTH; x+=GRID_WIDTH*.30; end_snek.grow(x, y);}

  //------------------Create "E" for Game Over---------------------//
  x += GRID_WIDTH*3.8; end_snek.grow(x, y);
  for (var i=0; i < 2; i++){x -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 4; i++){y += GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}
  x -= GRID_WIDTH*2; y -= GRID_WIDTH*2;
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}

  //------------------Create "R" for Game Over---------------------//
  x += GRID_WIDTH*2; y+= GRID_WIDTH*2; end_snek.grow(x, y);
  for (var i=0; i < 4; i++){y -= GRID_WIDTH; end_snek.grow(x, y);}
  for (var i=0; i < 2; i++){x += GRID_WIDTH; end_snek.grow(x, y);}
  y += GRID_WIDTH; end_snek.grow(x, y);
  x -= GRID_WIDTH*.9; y += GRID_WIDTH; end_snek.grow(x, y);
  x -= GRID_WIDTH*.1; end_snek.grow(x, y);
  x += GRID_WIDTH; y += GRID_WIDTH; end_snek.grow(x, y);
  y += GRID_WIDTH; end_snek.grow(x, y);

}

function drawEndScreen() {
  drawBackground();
  SNEK.show();
  drawObjects();
}




// ---------------------------------------------------Generic Functions-----------------------------------------------------//
function drawBackground() {
  fill(BACK_COLOR);
  noStroke();
  rect(0, 0, WIN_SIZE, WIN_SIZE);
  fill(SIDE_COLOR);
  rect(WIN_SIZE, 0, 1.5*WIN_SIZE, WIN_SIZE);
  noFill();
  strokeWeight(2);
  stroke(BACK_OUTLINE_COLOR);
  rect(0, 0, 1.5*WIN_SIZE, WIN_SIZE);
  strokeWeight(2);
  line(WIN_SIZE, 0, WIN_SIZE, WIN_SIZE);
  drawScores();
  if (STATUS === 'playing two' || PREV_STATUS === 'playing two') {  
    drawHealth();
  } 
}

function drawHealth() {
  noStroke();
  fill(SCORE_BOX_COLOR);
  rect(WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*18, GRID_WIDTH*7, GRID_WIDTH*1.75);
  fill("#c00782");
  rect(WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*18, GRID_WIDTH*SNEK.health*.7, GRID_WIDTH*1.75);
  
  fill(SCORE_BOX_COLOR);
  textSize(GRID_WIDTH);
  textAlign(LEFT);
  stroke('black');
  strokeWeight(2);
  text("Snake Health:", WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*17.5);
  noFill();
  rect(WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*18, GRID_WIDTH*7, GRID_WIDTH*1.75);
}

function drawObjects () {
  for (var i=0; i<OBJECT_LIST.length; i++) {
    OBJECT_LIST[i].show();
  }
}

function drawScores() {
  fill(SCORE_BOX_COLOR);
  stroke(BACK_OUTLINE_COLOR);
  strokeWeight(2);
  rect(WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*3, GRID_WIDTH*7, GRID_WIDTH*1.75); 
  rect(WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*8, GRID_WIDTH*7, GRID_WIDTH*1.75);
  rect(WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*13, GRID_WIDTH*7, GRID_WIDTH*1.75); 
  stroke('black');
  textSize(GRID_WIDTH);
  textAlign(LEFT);
  text("Current Score:", WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*2.5);
  text("High Score:", WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*7.5);
  text("Current Difficulty:", WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*12.5);
  fill('black');
  textAlign(CENTER);
  textSize(GRID_WIDTH);
  text(CURRENT_SCORE, WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*3.5, GRID_WIDTH*7, GRID_WIDTH*2);
  text(HIGH_SCORE, WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*8.5, GRID_WIDTH*7, GRID_WIDTH*2);
  text(DIFFICULTIES[CURR_DIFF], WIN_SIZE + GRID_WIDTH*1.75, GRID_WIDTH*13.5, GRID_WIDTH*7, GRID_WIDTH*2);
}

function drawGameFrame() {
  drawBackground();
  drawObjects();
  SNEK.move();
  SNEK.show();
}

function changeDifficulty() {
  CURR_DIFF = (CURR_DIFF+1) % 3
  SPEED = CURR_DIFF * .6 + 1
}

function createApple(x=null, y=null, type='apple'){
  
  if (x === null && y === null){
    apple = new Apple(GRID_WIDTH, MAP_SIZE, x=x, y=y, type=type);
    new_spot = findFreeSpot();
    if (new_spot === null) {
      console.log("No More Spots to Place Apple");
    } else {
      apple.move(new_spot["x"], new_spot["y"]);
    }
    
  } else {
    apple = new Apple(GRID_WIDTH, MAP_SIZE, x=x, y=y, type=type);
  }
  return apple;
}

function newButton(posX, posY, message) {
  button = createButton(message);
  button.parent('screen');
  button.position(cnv.x + WIN_SIZE*posX, cnv.y + WIN_SIZE*posY);

  BUTTON_LIST.push(button);
  BUTTON_POSITIONS.push(posX);
  BUTTON_POSITIONS.push(posY);

  return button
}

function checkObjectCollision() {
  
  for (var i=0; i<OBJECT_LIST.length; i++){
    object = OBJECT_LIST[i];
    distance = dist(object.x, object.y, SNEK.x, SNEK.y);

    if (distance < object.size/2 && (object.type === 'apple'|| object.type === 'poison')) {
      new_spot = findFreeSpot();
      if (new_spot === null) {
        console.log('Ran out of Free Spots to move Apple');
      } else {
        object.move(new_spot["x"], new_spot["y"]);
      }
      SNEK.grow();
      if (STATUS === 'playing two') {
        if (object.type === 'poison') {
          SNEK.health --;
          CURRENT_SCORE += 10;
          n = floor(random(1, 4));
        } else {
          CURRENT_SCORE += 15;
          n = floor(random(0, 2));
        }
        console.log(n);
        for (var i=0; i<n; i++) {
          apple = createApple(x = 0, y = 0, type = 'poison');
          OBJECT_LIST.push(apple);
          apple.move();
        }
      } else {
        CURRENT_SCORE += 15;
      }
      HIGH_SCORE =  max(CURRENT_SCORE, HIGH_SCORE);
    }
  }
}

function findFreeSpot() {
  taken_spots = SNEK.get_positions();
  taken_spots = taken_spots.concat(OBJECT_LIST);
 
  all_spots = new Array(MAP_SIZE*MAP_SIZE).fill(false);

  for (var i=0; i<taken_spots.length; i++){
    idx_x = taken_spots[i].x/GRID_WIDTH;
    idx_y = taken_spots[i].y/GRID_WIDTH;
    
    all_spots[idx_y*MAP_SIZE+idx_x] = true;
  }
  
  free_spots = [];
  for (var i=MAP_SIZE-1; i>=0; i--){
    for (var j=MAP_SIZE-1; j>=0; j--){
      if (all_spots[i*MAP_SIZE+j] === false) {
        free_spots.push({"x": j, "y": i});
      }
    }
  }
  if (free_spots.length != 0) {
    random_spot = floor(random(0, free_spots.length));
    return free_spots[random_spot];
  }
  else {
    return null;
  }
}

function removeAllButtons() {
  for(var i=0; i<BUTTON_LIST.length; i++){
    BUTTON_LIST[i].remove();
  }
  BUTTON_LIST = [];
  BUTTON_POSITIONS = [];
}