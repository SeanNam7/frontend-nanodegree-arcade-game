"use strict";

// 'constant' variables
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;

// Character super-class
var Character = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// Player class
var Player = function(x, y, sprite) {
    Character.call(this, x, y, sprite);
    this.width = 65;
    this.height = 75;
    this.lives = 5;
    this.score = 0;
};

// Enemy class
var Enemy = function(x, y, sprite, speed) {
    Character.call(this, x, y, sprite);
    this.width = 75;
    this.height = 65;
    this.speed = ((Math.floor(Math.random() * 200) + 100) + (75 * speed));
};

/* PROTOTYPES */

// Renders character images onto the canvas
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Set up prototype delegation relationship to Character prototype using Object.create technique
Player.prototype = Object.create(Character.prototype);
Enemy.prototype = Object.create(Character.prototype);

// Set up proper subclass constructor delegation to Character
Player.prototype.constructor = Character;
Enemy.prototype.constructor = Character;


// Updates the game to show the latest sprite-positions/movement
Enemy.prototype.update = function(dt) {
    /* Multiply speed(distance/time) by dt(time), so (distance/time * dt = distance)
    will give a distance of how far to move the enemy bugs on each update */
    /* This helped me figure out how to setup the enemy speed correctly */
    this.x = this.x + (this.speed * dt);
    if (this.x >= 707) {
        this.x = -50;
    }
};

// Resets the position of the player to the original location
Player.prototype.reset = function() {
    this.x = 303;
    this.y = 460;
};

// Restarts the game.
Player.prototype.restart = function() {
    this.lives = 5;
    this.score = 0;
    $("#lives").text("Lives: " + this.lives);
    $("#score").text("Score: " + this.score);
};

Player.prototype.update = function(dt) {
    this.x = this.x;
    this.y = this.y;
    this.lives = this.lives;
    this.score = this.score;

    if(this.x >= 700) {
        this.reset();
    }
    if(this.x <= -10) {
        this.reset();
    }
    if(this.y >= 500) {
        this.reset();
    }
    if(this.y <= 10) {
        this.scoreupdate();
        this.reset();
    }
};

// Player score
Player.prototype.scoreupdate = function() {
    water.play();
    this.score += 100;
    $("#score").text("Score: " + this.score);
    if(this.score === 1000) {
        victory.play();
        // Used setTimeout because .play and alert caused random results
        setTimeout(function() {alert("YOU WIN!!! Press OK to restart.");}, 100);
        this.restart();
    }
};

// Manages player movement
Player.prototype.handleInput = function(movement) {

    if(movement === 'up') {
        this.y -= TILE_HEIGHT;
    }
    if(movement === 'right') {
        this.x += TILE_WIDTH;
    }
    if(movement === 'down') {
        this.y += TILE_HEIGHT;
    }
    if(movement === 'left') {
        this.x -= TILE_WIDTH;
    }
};

// Enemy collision function
Player.prototype.enemyCollision = function() {
    if (checkCollisions.call(this, allEnemies) === true) {
        squish.play();
        this.lives -= 1;
        $("#lives").text("Lives: " + this.lives);
        if(this.lives == 0) {
            alert("Game Over. Click OK to restart");
            this.restart();
        }
    }
};

// Checks the player's collision with other objects
function checkCollisions(targetArray) {
    for (var i = 0; i < targetArray.length; i++) {
        if (this.x < (targetArray[i].x + targetArray[i].width) &&
            (this.x + this.width) > targetArray[i].x &&
            this.y < (targetArray[i].y + targetArray[i].height) &&
            (this.y + this.height) > targetArray[i].y) {
                //to reset the player
                this.reset();
                return true;
            }
        }
    }

// Instantiate Player
var player = new Player(303, 460, 'images/char-boy.png');

// Instantiate Enemy
var allEnemies = [
    new Enemy(30,60,'images/enemy-bug.png',4),
    new Enemy(200,60,'images/enemy-bug.png',1),
    new Enemy(30,140,'images/enemy-bug.png',2),
    new Enemy(220,140,'images/enemy-bug.png',1),
    new Enemy(370,225,'images/enemy-bug.png',2),
    new Enemy(290,310,'images/enemy-bug.png',1)
    ];

// Sound effects
var victory = new Audio('sounds/FFVII.mp3');
var squish = new Audio('sounds/squish.mp3');
var water = new Audio('sounds/water.mp3');

// var loop = new Audio('sounds/loop.wav');
// document.addEventListener("load", loop.play());

// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});