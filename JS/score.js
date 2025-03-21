let highScore;
let firstHighScore = true;

let currentScore = 0; // Resets current level score to 0 at the start of a new level.
let newHighScore = false;

function initScore(){
	getHighScore(userID, level);
    if (currentLevel == 'level1') {
       
	localStorage.setItem('level1_highScore', highScore);

    } else if (currentLevel == 'introLevel') {

        localStorage.setItem('introLevel_highScore', highScore);
		
    }
	if (!(highScore === 0 || highScore === null || highScore === "undefined")) {
		firstHighScore = false;
	}
    updateScores();
}

function increaseScoreBot() { // Increases current score when a bot is defeated.

    currentScore = currentScore + 50;
	
    if (currentScore > highScore) { // If the user beats their high score, high score is updated.

        highScore = currentScore;
		newHighScore = true;
    }
    updateScores();
}

function increaseScoreRound() { // Increases the score by 250 when a new round is started.

    currentScore = currentScore + 250;

    if (currentScore > highScore) { // If the user beats their high score, high score is updated.

		newHighScore = true;
        highScore = currentScore;
    }
	updateScores();
}

function updateScores() { // Updated the html to show the current score to the user whenever the scores are changed.
		console.log('score updated');
        document.getElementById('currentScore').innerHTML = 'Current Score: ' + currentScore; // Updates introLevel.html to show current score.
        document.getElementById('highScore').innerHTML = 'High Score: ' + highScore; // Updates introLevel.html to show high score.

}

function getHighScore(userID, level) {
    const data = {
        userID: userID,
        level: level
    };

    fetch('../PHP/getScores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            console.log("High score for user " + userID + " on level " + currentLevel + ": " + result.highscore);
			highScore=result.highscore; 
			console.log(highScore);
			updateScores();
        } else {
            console.log("Error: " + result.message);
			highScore=0; 
			updateScores();
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
