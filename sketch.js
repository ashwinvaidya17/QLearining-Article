// Author: Ashwin Vaidya
// Released under MIT License
// Simple grid-world with keyboard control

var start_x;
var start_y;
var square_length;
var player_size;
var player_pos_x; //start x
var player_pos_y;//start y
var state; //start state
var score;
var gameOver;

var LEFT;
var DOWN;
var RIGHT;
var UP;

function setup() {
createCanvas(400, 400);
resetEnv();
}

function resetEnv()
{
start_x = 10;
start_y= 10;
square_length = 200;
player_size = 10;
player_pos_x = start_x + (square_length/6); //start x
player_pos_y = start_y + (square_length*5/6);//start y
state = 0; //start state
score = 0;
gameOver=false;

LEFT = 0;
DOWN = 1;
RIGHT = 2;
UP = 3;
loop();
}

function draw() {
background(255);
drawGrid();
drawText();
drawPlayer();
}
function drawPlayer(){
//Draw Player
fill(0,255,255);
circle(player_pos_x , player_pos_y, player_size);
fill(255,255,255);
}
function drawText(){
fill(0,0,0);
textSize(20);
text("Score: "+score+" State: "+state+" Game Over? "+gameOver, start_x, square_length+ 30);
fill(255,255,255);
}

function step(action){
let returnArray = [];
let isOver = false;
let reward = 0;
let next_state = state;
switch(action){
    case LEFT:
        if (state != 0 && state !=3 && state != 6){
            player_pos_x -= (square_length/3);
            next_state = state - 1;
        }
        break;
    case RIGHT:
        if (state != 2 && state != 5 && state != 8){
            player_pos_x += (square_length/3);
            next_state = state + 1;
        }
        break;
    case UP:
        if (state != 6 && state != 7 && state != 8){
            player_pos_y -= (square_length/3);
            next_state = state+3;
        }
        break;
    case DOWN:
        if (state != 0 && state != 1 && state != 2){
            player_pos_y += (square_length/3);
            next_state = state - 3;
        }
        break;
}
//check end condition
if(next_state == 8){
    reward = 1;
    isOver = true;
}
else if (next_state ==4 || next_state ==5){
    isOver = true;
}
returnArray.push(next_state);
returnArray.push(reward);
returnArray.push(isOver);
return returnArray;
}

function drawGrid()
{
//outer square
square(start_x,start_y,square_length);
//grid lines
square(start_x, start_y, square_length/3);
square(start_x + (square_length/3), start_y, square_length/3);
fill('rgb(0%,100%,0%)');
square(start_x + (2*square_length/3), start_y, square_length/3);
fill(255,255,255);
square(start_x, start_y + (square_length/3), square_length/3);
fill(255,0,0);
square(start_x+(square_length/3), start_y + (square_length/3), square_length/3);
fill(255,0,0);
square(start_x+(2*square_length/3), start_y + (square_length/3), square_length/3);
fill(255,255,255);
square(start_x, start_y + (2*square_length/3), square_length/3);
square(start_x+(square_length/3), start_y + (2*square_length/3), square_length/3);
}

function keyPressed(){
switch(keyCode){
    case 65:
        ret = step(LEFT);
        state = ret[0];
        score = ret[1];
        gameOver = ret[2];
        break;
    case 68:
        ret = step(RIGHT);
        state = ret[0];
        score = ret[1];
        gameOver = ret[2];
        break;
    case 87:
        ret = step(UP);
        state = ret[0];
        score = ret[1];
        gameOver = ret[2];
        break;
    case 83:
        ret = step(DOWN);
        state = ret[0];
        score = ret[1];
        gameOver = ret[2];
        break;
		case 82:
				resetEnv();
				break;
}
if(gameOver)
    noLoop();
}