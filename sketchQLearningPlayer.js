// Author: Ashwin Vaidya
// Released under MIT License
// Q-Table with player control

var start_x;
var start_y;
var square_length;
var player_size;
var player_pos_x; //start x
var player_pos_y; //start y
var state; //start state
var score;
var gameOver;
var action;

var LEFT;
var DOWN;
var RIGHT;
var UP;

var qtable = [];

for (var rows = 0; rows < 9; rows++) { //# of states
	qtable.push([0.0, 0.0, 0.0, 0.0]); // 4 actions Left, Right, Up, Down
}

// hyperparameters
var episodes = 0;
var total_episodes = 30;
var max_steps = 10; // max steps per episode
var learning_rate = 0.8;
var gamma = 0.95; //discounting rate

var epsilon = 1.0;
var max_epsilon = 1.0;
var min_epsilon = 0.01;
var decay_rate = 0.05;

function setup() {
	createCanvas(500, 750);
	resetEnv();
}


function draw() {
	background(255);
	drawGrid();
	drawText();
	drawQTable();
	drawPlayer();
}

function argMax(array) {
	return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function drawQTable() {
	fill(0, 0, 0);
	textSize(20);
	let table_text = "Action: \t\t\tL \t\t\tD \t\t\tR \t\t\tU\n";
	for (var rows = 0; rows < 9; rows++) {
		table_text += "____________________________\n";
		table_text += "State " + (rows + 1) + ": |" + qtable[rows][0].toFixed(2) +
			" | " + qtable[rows][1].toFixed(2) +" | "+ qtable[rows][2].toFixed(2)+" | " + qtable[rows][3].toFixed(2) +"\n";
	}
	text(table_text, start_x, square_length + 75);
	fill(255, 255, 255);
}

function resetEnv() {
	start_x = 10;
	start_y = 10;
	square_length = 200;
	player_size = 10;
	player_pos_x = start_x + (square_length / 6); //start x
	player_pos_y = start_y + (square_length * 5 / 6); //start y
	state = 0; //start state
	score = 0;
	gameOver = false;

	LEFT = 0;
	DOWN = 1;
	RIGHT = 2;
	UP = 3;
}


function drawPlayer() {
	//Draw Player
	fill(0, 255, 255);
	circle(player_pos_x, player_pos_y, player_size);
	fill(255, 255, 255);
}

function drawText() {
	fill(0, 0, 0);
	textSize(20);
	text("Score: " + score + " State: " + state + " Game Over? " +
		gameOver + " Epsilon: " + epsilon +
		"\nEpisode: " + episodes + " Action: " + action, start_x, square_length + 30);
	fill(255, 255, 255);
}

function step(action) {
	let returnArray = [];
	let isOver = false;
	let reward = 0;
	let next_state = state;
	switch (action) {
		case LEFT:
			if (state != 0 && state != 3 && state != 6) {
				player_pos_x -= (square_length / 3);
				next_state = state - 1;
			}
			break;
		case RIGHT:
			if (state != 2 && state != 5 && state != 8) {
				player_pos_x += (square_length / 3);
				next_state = state + 1;
			}
			break;
		case UP:
			if (state != 6 && state != 7 && state != 8) {
				player_pos_y -= (square_length / 3);
				next_state = state + 3;
			}
			break;
		case DOWN:
			if (state != 0 && state != 1 && state != 2) {
				player_pos_y += (square_length / 3);
				next_state = state - 3;
			}
			break;
	}
	//check end condition
	if (next_state == 8) {
		reward = 100;
		isOver = true;
	} else if (next_state == 4 || next_state == 5) {
		reward = -100;
		isOver = true;
	}
	returnArray.push(next_state);
	returnArray.push(reward);
	returnArray.push(isOver);
	return returnArray;
}

function drawGrid() {
	//outer square
	square(start_x, start_y, square_length);
	//grid lines
	square(start_x, start_y, square_length / 3);
	square(start_x + (square_length / 3), start_y, square_length / 3);
	fill('rgb(0%,100%,0%)');
	square(start_x + (2 * square_length / 3), start_y, square_length / 3);
	fill(255, 255, 255);
	square(start_x, start_y + (square_length / 3), square_length / 3);
	fill(255, 0, 0);
	square(start_x + (square_length / 3), start_y + (square_length / 3), square_length / 3);
	fill(255, 0, 0);
	square(start_x + (2 * square_length / 3), start_y + (square_length / 3), square_length / 3);
	fill(255, 255, 255);
	square(start_x, start_y + (2 * square_length / 3), square_length / 3);
	square(start_x + (square_length / 3), start_y + (2 * square_length / 3), square_length / 3);
}

function keyPressed() {
	var action;
	switch (keyCode) {
		case 65:
			ret = step(LEFT);
			action = LEFT;
			break;
		case 68:
			ret = step(RIGHT);
			action = RIGHT;
			break;
		case 87:
			ret = step(UP);
			action = UP;
			break;
		case 83:
			ret = step(DOWN);
			action = DOWN;
            break;
        case 82:
            resetEnv();
            qtable = [];
            for (var rows = 0; rows < 9; rows++) { //# of states
                qtable.push([0.0, 0.0, 0.0, 0.0]); // 4 actions Left, Right, Up, Down
            }

	}
	var next_state = ret[0];
	score = ret[1] - 1; //penlaty for steps taken
	gameOver = ret[2];

	qtable[state][action] = qtable[state][action] +
		learning_rate * (score + gamma * Math.max(...qtable[next_state]) -
			qtable[state][action]);
	state = next_state;
	
	if(gameOver == true)
		resetEnv();
}