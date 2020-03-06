webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// pokemon database
var pokemonDB = [{
  name: 'charmander',
  type: 'fire',
  hp: 39,
  attack: 52,
  defense: 43,
  level: 1,
  img: 'http://www.smogon.com/dex/media/sprites/xy/charmander.gif'
}, {
  name: 'bulbasaur',
  type: 'grass',
  hp: 45,
  attack: 49,
  defense: 49,
  level: 1,
  img: 'http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif'
}, {
  name: 'squirtle',
  type: 'water',
  hp: 44,
  attack: 48,
  defense: 65,
  level: 1,
  img: 'http://www.smogon.com/dex/media/sprites/xy/squirtle.gif'
}];

// game state
var gameState = {
  stage: 'select',
  userChar: '',
  cpuChar: '',
  userAttack: '',
  cpuAttack: ''

  // get all characters
};var pokemonsEl = document.querySelector('.select-screen').querySelectorAll('.character');
var battleScreenEL = document.getElementById('battle-screen');
var attackButtonsEL = battleScreenEL.querySelectorAll('.attack');
var playerLeft = document.querySelector('.player1').querySelector('.left');
var cpuLeft = document.querySelector('.player2').querySelector('.left');

// initial game loop
var i = 0;
while (i < pokemonsEl.length) {
  pokemonsEl[i].onclick = function () {
    var pokemonName = this.dataset.pokemon;
    gameState.userChar = pokemonName;

    // cpu select char
    cpuChoose();

    // change char images / text and load pokemon states
    var playerImage = document.querySelector('.player1').getElementsByTagName('img');
    var playerName = document.querySelector('.player1').querySelector('.name');
    console.log(playerName.innerHTML);
    var cpuImage = document.querySelector('.player2').getElementsByTagName('img');
    var cpuName = document.querySelector('.player2').querySelector('.name');

    for (i = 0; i < pokemonDB.length; i++) {
      if (pokemonDB[i].name == gameState.userChar) {
        gameState.userPokemon = pokemonDB[i];
        playerImage[0].src = pokemonDB[i].img;
        playerName.innerHTML = pokemonDB[i].name;
      }
      if (pokemonDB[i].name == gameState.cpuChar) {
        gameState.cpuPokemon = pokemonDB[i];
        cpuImage[0].src = pokemonDB[i].img;
        cpuName.innerHTML = pokemonDB[i].name;
      }
    }

    // switch to battle screen
    gameState.stage = 'battle';
    battleScreenEL.classList.add('active', 'animated', 'bounceInUp');
    console.log(gameState);

    // calculate initial health
    gameState.userPokemon.health = calculateInitialHealth(gameState.userPokemon);
    gameState.cpuPokemon.health = calculateInitialHealth(gameState.cpuPokemon);

    // display health
    playerLeft.innerHTML = gameState.userPokemon.health + '/' + gameState.userPokemon.health;
    cpuLeft.innerHTML = gameState.cpuPokemon.health + '/' + gameState.cpuPokemon.health;
  };
  i++;
}

// attacks
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  var _loop = function _loop() {
    var a = _step.value;

    a.onclick = function () {
      gameState.userAttack = a.dataset.attack;
      play();
    };
  };

  for (var _iterator = attackButtonsEL[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    _loop();
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

function playerAttack(stack) {
  var critical = Math.random() / 5;
  var damage = Math.floor(gameState.userPokemon.attack * gameState.userPokemon.level * (stack + critical));
  console.log("player 1 did " + damage + " damage to computer");
  var oldHealth = gameState.cpuPokemon.health;
  gameState.cpuPokemon.health -= damage;

  // adjust health bar
  var cpuHB = document.querySelector('.player2').querySelector('.inside');
  var total = calculateInitialHealth(gameState.cpuPokemon);
  var percent = Math.floor(gameState.cpuPokemon.health / total * 100);
  console.log(percent);

  // if (percent < 0) {
  //   cpuHB.style.width = '0%'
  // } else if (percent < 25) {
  //   cpuHB.style.background = 'red'
  // } else if (percent < 50) {
  //   cpuHB.style.background = 'yellow'
  // }
  // cpuHB.style.width = percent + '%'
  // if (gameState.cpuPokemon.health < 0) {
  //   gameState.cpuPokemon.health = 0;
  // }

  // count down quickly
  var number = oldHealth;
  var target = gameState.cpuPokemon.health;
  if (target < number) {
    var interval = setInterval(function () {
      var newPercent = Math.floor(number / total * 100);
      if (newPercent < 0) {
        cpuHB.style.width = '0%';
      } else if (newPercent < 25) {
        cpuHB.style.background = 'red';
      } else if (newPercent < 50) {
        cpuHB.style.background = 'yellow';
      }
      cpuHB.style.width = newPercent + '%';
      if (gameState.cpuPokemon.health < 0) {
        gameState.cpuPokemon.health = 0;
      }
      cpuLeft.innerHTML = number + '/' + calculateInitialHealth(gameState.userPokemon);
      if (target >= number) {
        clearInterval(interval);
        return;
      }
      number--;
    }, 10);
  }
  cpuLeft.innerHTML = gameState.cpuPokemon.health + '/' + calculateInitialHealth(gameState.cpuPokemon);
}

function cpuDoAttack(stack) {
  var critical = Math.random() / 5;
  var damage = Math.floor(gameState.cpuPokemon.attack * gameState.cpuPokemon.level * (stack + critical));
  console.log("computer did " + damage + " damage to player");
  var oldHealth = gameState.userPokemon.health;
  gameState.userPokemon.health -= damage;

  // adjust health bar
  var playerHB = document.querySelector('.player1').querySelector('.inside');
  var total = calculateInitialHealth(gameState.userPokemon);
  var percent = Math.floor(gameState.userPokemon.health / total * 100);
  console.log(percent);

  // if (percent < 0) {
  //   playerHB.style.width = '0%'
  // } else if (percent < 25) {
  //   playerHB.style.background = 'red'
  // } else if (percent < 50) {
  //   playerHB.style.background = 'yellow'
  // }
  // playerHB.style.width = percent + '%'
  // if (gameState.userPokemon.health < 0) {
  //   gameState.userPokemon.health = 0;
  // }

  // count down quickly
  var number = oldHealth;
  var target = gameState.userPokemon.health;
  if (target < number) {
    var interval = setInterval(function () {
      var newPercent = Math.floor(number / total * 100);
      if (newPercent < 0) {
        playerHB.style.width = '0%';
      } else if (newPercent < 25) {
        playerHB.style.background = 'red';
      } else if (newPercent < 50) {
        playerHB.style.background = 'yellow';
      }
      playerHB.style.width = newPercent + '%';
      if (gameState.userPokemon.health < 0) {
        gameState.userPokemon.health = 0;
      }

      playerLeft.innerHTML = number + '/' + calculateInitialHealth(gameState.userPokemon);
      if (target >= number) {
        clearInterval(interval);
        return;
      }
      number--;
    }, 10);
  }
  playerLeft.innerHTML = gameState.userPokemon.health + '/' + calculateInitialHealth(gameState.userPokemon);
}

// check for a winner
function checkWinner() {
  console.log("player: " + gameState.userPokemon.health + ", computer: " + gameState.cpuPokemon.health);
  if (gameState.cpuPokemon.health <= 0) {
    gameState.stage = 'end';
    if (gameState.userPokemon.health > 0) {
      gameState.win = 'win';
      console.log("You WIN!");
    } else {
      gameState.win = 'draw';
      console.log("Both pokemon died. It's a draw.");
    }
    return true;
  } else {
    if (gameState.userPokemon.health <= 0) {
      gameState.stage = 'end';
      gameState.win = 'lose';
      console.log("You LOST!");
      return true;
    }
  }
  return false;
}

// play the game
function play() {
  cpuAttack();
  console.log("attacking with " + gameState.userAttack);
  console.log("cpu attacking with " + gameState.cpuAttack);
  switch (gameState.userAttack) {
    case 'rock':
      if (gameState.cpuAttack == 'paper') {
        console.log('paper beats rock');
        playerAttack(.5);
        cpuDoAttack(2);
      } else if (gameState.cpuAttack == 'scissors') {
        console.log('rock beats scissors');
        playerAttack(2);
        cpuDoAttack(.5);
      } else {
        console.log("it's a draw");
        playerAttack(1);
        cpuDoAttack(1);
      }
      break;
    case 'paper':
      if (gameState.cpuAttack == 'rock') {
        console.log('paper beats rock');
        playerAttack(2);
        cpuDoAttack(.5);
      } else if (gameState.cpuAttack == 'scissors') {
        console.log('scissors beats paper');
        playerAttack(.5);
        cpuDoAttack(2);
      } else {
        console.log("it's a draw");
        playerAttack(1);
        cpuDoAttack(1);
      }
      break;
    case 'scissors':
      if (gameState.cpuAttack == 'rock') {
        console.log('rock beats scissors');
        playerAttack(.5);
        cpuDoAttack(2);
      } else if (gameState.cpuAttack == 'paper') {
        console.log('scissors beats paper');
        playerAttack(2);
        cpuDoAttack(.5);
      } else {
        console.log("it's a draw");
        playerAttack(1);
        cpuDoAttack(1);
      }
      break;
  }

  // check for end game
  if (checkWinner()) {

    // bounce stuff off screen
    var player1Stuff = document.querySelector('.player1');
    var player2Stuff = document.querySelector('.player2');
    var aButtons = document.getElementById('battle-screen').querySelector('.battle-btns');
    var mainText = document.getElementById('battle-screen').querySelector('.fight-btn');
    player1Stuff.classList.add('animated', 'bounceOutLeft', 'delay-1s');
    player2Stuff.classList.add('animated', 'bounceOutRight', 'delay-1s');
    aButtons.classList.add('animated', 'bounceOutDown', 'delay-1s');
    mainText.classList.add('animated', 'fadeOut', 'delay-1s');

    // display win/loss/draw text
    mainText.addEventListener('animationend', function () {
      switch (gameState.win) {
        case 'win':
          mainText.innerHTML = "You WIN!";
          break;
        case 'lose':
          mainText.innerHTML = "You LOSE!";
          break;
        case 'draw':
          mainText.innerHTML = "It's a DRAW!";
          break;
      }
      mainText.classList.remove('fadeOut');
      mainText.removeEventListener('animationend', function () {
        mainText.classList.add('fadeIn', 'slow');
      });

      // display reset button
      var resetBtn = document.getElementById('battle-screen').querySelector('.again');
      resetBtn.style.display = 'flex';
    });
  }
}

// cpu select character
function cpuChoose() {
  var r = Math.floor(Math.random() * 3);
  gameState.cpuChar = pokemonsEl[r].dataset.pokemon;
  console.log(gameState);
}

// cpu select attack
function cpuAttack() {
  var r = Math.floor(Math.random() * 3);
  gameState.cpuAttack = attackButtonsEL[r].dataset.attack;
  console.log(gameState);
}

// calculate health
function calculateInitialHealth(user) {
  return Math.floor(0.20 * Math.sqrt(user.level) * user.defense * user.hp);
}

/***/ })
],[0]);