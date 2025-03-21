let currentLevelHP = 10;
let gameRunning = true;

const hpLost = new Audio("../SoundEffects/273873__beskhu__xylo-nd-60-c3.mp3");

document.getElementById('levelHP').innerHTML = 'Level Hitpoints: ' + currentLevelHP + '/10'; // Updates level1.html to show current hitpoints.
function decreaseLevelHP() {
	
	hpLost.currentTime = 0;
	hpLost.play();
	
	currentLevelHP = currentLevelHP - 1; // Removes a hitpoint from the level when an enemy reaches the end.
	currentLevel = sessionStorage.getItem('level'); // Gets current level from session storage.
	console.log(currentLevel + ' testing');
	if (currentLevel == 'introLevel') { // displays the second popup if the introduction level is running, the level hitpoints == 9 and it is the first round.
		if (currentLevelHP == 9 && round == 1) {
			displayIntroSecondPopup();
		}
	} 
	console.log('level HP: ' + currentLevelHP);
	document.getElementById('levelHP').innerHTML = 'Level Hitpoints: ' + currentLevelHP + '/10'; // Updates level1.html to show current hitpoints.
	if (currentLevelHP == 0) {
		gameRunning = false;
		document.getElementById('levelHP').innerHTML = 'GAME OVER';
		console.log('game over.  ', 'game running: ' + gameRunning);
		console.log(firstHighScore);
		console.log(newHighScore);
		if (currentScore > 0) {
			if (firstHighScore && userID !== '1') {
				addScore(userID, currentScore, round, level); // Add score if it's the first high score (not userID 1)
				firstHighScore = false;
			} else if (newHighScore) {
				updateScore(userID, currentScore, round, level); // Update score if it's a new high score
				newHighScore = false;
			}
		}
		localStorage.setItem('level1_currentScore', currentScore);
		localStorage.setItem('level1_highScore', highScore);
		window.location.href = '../HTML/gameOver.html';
	}
}