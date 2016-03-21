//jQuery Countdown Timer
$(document).ready(function() {

  var timer = setInterval(function() {

    var count = parseInt($('#theTarget').html());
    if (count !== 0) {
      $('#theTarget').html(count - 1);
    } 
    else {
      clearInterval(timer);

    }
  }, 1000);
});

//Dimensions
var BLOCK_HEIGHT = 80;
var ENEMY_HEIGHT = 70;
var ENEMY_WIDTH = 100;
var PLAYER_HEIGHT = 80;
var PLAYER_WIDTH = 75;

//Enemy Characteristics
var ENEMY_SPEED = [220, 240, 280];
var MAX_ENEMY = 6;

//Enemy starts 75px down vertically
var SLIDE_ENEMY_Y = 75;
var SLIDE_PLAYER_X = 15;
var SLIDE_PLAYER_Y = 60;

//New Player Position
var X_PLAYER = 200;
var Y_PLAYER = 400;

// Player moves vertically
var STEP_Y = 80;
// Player moves horizaontally
var STEP_X = 95;

// Enemies the Player must avoid
var Enemy = function(x, y, speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    // Enemies return
    if (this.x > 505) {
        this.x = 0;
        var enemyreturnPosition = Math.floor(Math.random() * 3);
        if (enemyreturnPosition === 0) {
            this.y = 60;
        }
        if (enemyreturnPosition == 1) {
            this.y = 130;
        }
        if (enemyreturnPosition == 2) {
            this.y = 225;
        }
    }
};
// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
};
//Update method
Player.prototype.update = function(dt) {
    //Player position
    var player1 = {
        'top': this.y + SLIDE_PLAYER_Y,
        'bottom': this.y + SLIDE_PLAYER_Y + PLAYER_HEIGHT,
        'right': this.x + SLIDE_PLAYER_X + PLAYER_WIDTH,
        'left': this.x + SLIDE_PLAYER_X
    };
    //Enemy position
    for (var TheEnemy in allEnemies) {
        enemy = {
            'top': allEnemies[TheEnemy].y + SLIDE_ENEMY_Y,
            'bottom': allEnemies[TheEnemy].y + SLIDE_ENEMY_Y + ENEMY_HEIGHT,
            'right': allEnemies[TheEnemy].x + ENEMY_WIDTH - 20,
            'left': allEnemies[TheEnemy].x + 20
        };
        //Collision
        if (!(player1.left > (enemy.right - 10) || player1.right < (enemy.left + 10) || player1.top >= (enemy.bottom - 10) || player1.bottom <= (enemy.top + 10))) {
            this.handleEnemyCollision();
            break;
        }
    }
};
//Render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// handleInput method: Player movements
Player.prototype.handleInput = function(keycode) {
    var newPosition;
    switch (keycode) {
        case 'up':
            newPosition = this.y - STEP_Y;
            this.y = newPosition;
            break;
        case 'down':
            newPosition = this.y + STEP_Y;
            this.y = (newPosition <= Y_PLAYER) ? newPosition : Y_PLAYER;
            break;
        case 'left':
            newPosition = this.x - STEP_X;
            if (newPosition >= 0) {
                this.x = newPosition;
            }
            break;
        case 'right':
            newPosition = this.x + STEP_X;
            if ((newPosition + SLIDE_PLAYER_X + PLAYER_WIDTH) <= 505) {
                this.x = newPosition;
            }
    }
    if (this.y < 50) {
        this.handleEnemyCollision();
    }
};
Player.prototype.handleEnemyCollision = function() {
    this.x = X_PLAYER;
    this.y = Y_PLAYER;
};

// Instantiate objects
var allEnemies = [];

function instantiateEnemies() {
    for (i = 0; i < MAX_ENEMY; i++) {

        var positionEnemyX = 0;
        var speedRandom = Math.floor(Math.random() * 3);

        var positionEnemyY = Math.floor(Math.random() * 3);
        var y;
        if (positionEnemyY === 0) {
            y = 65;
        }
        if (positionEnemyY === 1) {
            y = 145;
        }
        if (positionEnemyY === 2) {
            y = 225;
        }

        var enemy1 = new Enemy(0, y, ENEMY_SPEED[speedRandom]);
        allEnemies.push(enemy1);
    }
}

var player = new Player(X_PLAYER, Y_PLAYER);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

instantiateEnemies();