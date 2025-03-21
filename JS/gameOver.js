function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    noLoop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function goToLevelSelect() {

    window.location.href = '../HTML/levelSelect.html';
}

let gameOverCurrentScore = parseInt(localStorage.getItem('level1_currentScore')) || 0; // Grabs current score from local storage or sets high score to 0 if not present.
console.log(gameOverCurrentScore);

document.getElementById('levelScore').innerHTML = 'Score: ' + gameOverCurrentScore; // Displays level score in html.


let gameOverHighScore = parseInt(localStorage.getItem('level1_highScore')) || 0;  // Grabs high score from local storage or sets high score to 0 if not present.
console.log(gameOverHighScore);

document.getElementById('highScore').innerHTML = 'High Score: ' + gameOverHighScore; // Displays high score in html.