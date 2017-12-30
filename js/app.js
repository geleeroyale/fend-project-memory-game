/*jshint esversion: 6 */

/*
 * Create a list that holds all the cards
 * Double the set of cards for memory game
 * declare starting variables
 */
const baseSet = ['fa-anchor',
                  'fa-bicycle',
                  'fa-bomb',
                  'fa-bolt',
                  'fa-cube',
                  'fa-diamond',
                  'fa-leaf',
                  'fa-paper-plane-o'];

const allCards = [...baseSet, ...baseSet];


let counter = 0;
let openCards = [];
let lockedCards = [];
const gameboard = document.querySelector('#gameboard');
const movesDisplay = document.querySelector('#moves');
const ratingDisplay = document.querySelector('#rating');
let move = 0;
let rating = 3;
let deltaTime = 0;
let lastCard = '';
let match = false;


/**
 * Start event listener for restartIcon
 * Shuffle the cards
 * Set up the board and display it
 * Start the timer
 */

restartListener();
shuffle(allCards);
displayCards();
setTimer();
let timerStart = new Date();

// Increment a counter for moves the player took
function moveCounter() {
  move++;
}

// Render the move counter as textContent
function renderMoveCounter() {
  movesDisplay.textContent = move;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create all the cards and append them as children of the gameboard
function displayCards () {
    for (card of allCards) {
        const card = document.createElement('li');
        const cardIcon = document.createElement('i');
        const cardString = this.card;

        card.classList.add('card');
        cardIcon.classList.add('fa', cardString);
        card.appendChild(cardIcon);
        gameboard.appendChild(card);
        card.addEventListener('click', cardClicked);
    }
}

// This is the main game loop
function cardClicked() {
    card = this;
    showCard(card);
    addOpenCards(card.innerHTML);
    if (openCards.length === 2) {
      matchCards(card);
    }
    else if (openCards.length === 1) {
      lastCard = this;
    }
    else {
      removeOpenCards();
    }
    checkWinCondition();
}

// If all cards are matched, the game ends with calculating the time the player took and displays a scoreboard.
function checkWinCondition() {
  if (lockedCards.length === 8){
    calculateDeltaTime();
    delayStep(200, showScoreboard());
  }
}

// General purpose delay function
function delayStep(func, time) {
  timeoutID = window.setTimeout(func, time);
}

// Lock matched cards by pushing the openCards
function lockCards() {
    lockedCards.push(openCards);
}

// Find out if the two picked cards match
function matchCards() {
  //To find if a value or element exists in an array
  if (openCards[0] === openCards[1] && card !== lastCard) {
    isMatch();
  }
  //To find if a value or element DOES NOT exist in an array
  else if (openCards[0] != openCards[1] && card != lastCard) {
    delayStep(isNotMatch, 200);
  }
}

/**
 * isMatch triggers when a match is found, and ...
 * - adds a 'match' class to the cards
 * - pushes them to the lockCards array
 * - removes them from the openCards list
 * - removes the event listeners, so they are not clickable anymore
 * - updates the moves and rating trackers
 */
function isMatch() {
  console.log('Match!');
  lastCard.classList.add('match');
  card.classList.add('match');
  lockCards();
  removeOpenCards(lastCard);
  removeOpenCards(card);
  lastCard.removeEventListener('click', cardClicked);
  card.removeEventListener('click', cardClicked);
  moveCounter();
  renderMoveCounter();
  updateRating();
}

/**
 * isNotMatch triggers when a match is NOT found, and ...
 * - removes the cards from the openCards list
 * - hides the cards again
 * - updates the moves and rating trackers
 */
 function isNotMatch() {
  console.log('No Match!');
  removeOpenCards(lastCard);
  removeOpenCards(card);
  hideCard(lastCard);
  hideCard(card);
  moveCounter();
  renderMoveCounter();
  updateRating();
}

/**
 * This section handles card behaviour
 */

// adds the open cards to an array
function addOpenCards(card) {
  openCards.push(card);
}

// clears the open cards array
function removeOpenCards(card) {
  openCards = [];
}

// hides a card from view and makes it clickable
function hideCard(card) {
  card.classList.remove('open', 'show');
  lastCard.classList.remove('open', 'show');
  card.addEventListener('click', cardClicked);
}

// reveals a card and makes it unclickable
function showCard(card) {
  card.classList.add('open', 'show');
  card.removeEventListener('click', cardClicked);
}

// calculates the time between start and end of the game
function calculateDeltaTime() {
    let timerStop = new Date() - timerStart;
    deltaTime = timerStop/1000;
    return deltaTime;
}

// general purpose timer for display (less accurate and only for display)
let sec = 0;

function pad(val) {
    return val > 9 ? val : "0" + val;
}

function setTimer() {
let timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
}, 1000);
return timer;
}

// reset the timer display on restart
function clearTimer() {
    sec = 0;
    return sec;
}


// updates the star rating, depending on how many moves the player took
function updateRating() {
  if (move < 10) {
    rating = 3;
    ratingDisplay.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
  }
  else if (move < 20) {
    rating = 2;
    ratingDisplay.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
  }
  else if (move >= 30) {
    rating = 1;
    ratingDisplay.innerHTML = '<li><i class="fa fa-star"></i></li>';
  }
}

// reset the rating when game is restarted
function resetRating() {
  rating = 3;
  ratingDisplay.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
}

// shows a simple modal, displaying moves, time and rating of a player
function showScoreboard() {
  if (window.confirm('You have won! Moves needed: ' + move + '. Time to clear board: ' + deltaTime + ' seconds. We think, you should be awarded ' +  rating + ' stars. Click OK to restart the game!')) {
  restart();
  }
}

// clears the game board on game restart
function clearGameboard() {
  gameboard.innerHTML = '';
}

// main restart function, resetting the variables and calling the functions to create a new game
function restart() {
  counter = 0;
  openCards = [];
  lockedCards = [];
  move = 0;
  deltaTime = 0;
  lastCard = '';
  match = false;

  clearTimer();
  resetRating();
  clearGameboard();
  renderMoveCounter();
  shuffle(allCards);
  displayCards();
  timerStart = new Date();
}

// starts an event listener for the game restart graphic
function restartListener() {
  restartIcon = document.querySelector('#restart');
  restartIcon.addEventListener('click', restart);
}
