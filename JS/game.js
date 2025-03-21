let paused = false;
let menuPaused = false;
const userID = sessionStorage.getItem('userID');
const username = sessionStorage.getItem('username');
const victorySound = new Audio("../GameMusic/495002__evretro__unlocked-video-game-sound.wav");

const gameMusic = new Audio("../GameMusic/699618__seth_makes_sounds__164bpm-video-game-music-preview.mp3");

function startMusic () {

    var isMusicDisabled = localStorage.getItem('musicDisabled') === 'false';

    if (isMusicDisabled) {
        gameMusic.currentTime = 0;
        gameMusic.play();
        gameMusic.volume = 0.1; 
    }
    
}
class Game {
    constructor() {
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.spawnInterval = 2000;
        this.lastSpawn = Date.now();
    }
	//updates all on screen variables every game loop        
    update(dt) {
		if (paused == false)
        {
        const now = Date.now();
		updateWaveCountdown()
        // move enemies
        this.enemies.forEach(enemy => enemy.move(dt));

        // Update towers and projectiles
        this.towers.forEach(tower => tower.update(this.enemies, this.projectiles));
        this.projectiles.forEach(projectile => projectile.update(dt));

        // Remove off-screen or defeated enemies and projectiles
		this.enemies = this.enemies.filter(enemy => !enemy.offScreen);
        this.projectiles = this.projectiles.filter(projectile => !projectile.offScreen);
		}
    }

    draw() {
        // Clear canvas and redraw everything
		if (paused == false)
        {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawPath(); // Draw the path first
			this.enemies.forEach(enemy => enemy.draw());
			this.towers.forEach(tower => tower.draw());
			this.projectiles.forEach(projectile => projectile.draw());
		}
	}
}

const game = new Game();

let lastUpdateTime = performance.now();

function gameLoop() {
    const now = performance.now();
    const dt = (now - lastUpdateTime)/20;
    lastUpdateTime = now;
    
    if (gameRunning && !paused) {
        game.update(dt);
        game.draw();
    }
	var isMusicDisabled = localStorage.getItem('musicDisabled') === 'false';

    if (isMusicDisabled) {
        if (gameMusic.currentTime > 5.8) {
            gameMusic.currentTime = 0;
            gameMusic.play();
            gameMusic.volume = 0.1;
        } 
    }
    requestAnimationFrame(gameLoop);
}

function addScore(userID, score, waveReached, level) {
    // Ensure the data contains integers, not strings
	console.log("addScore function called"); 
    const data = {
        userID: parseInt(userID),  // Assuming userID is an integer or a valid ID
        score: parseInt(score), // Ensure score is an integer
        waveReached: parseInt(waveReached), // Ensure waveReached is an integer
        level: parseInt(level) // Ensure level is an integer
    };

    console.log(data);  // Check what is being sent
    fetch('../PHP/addScores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            alert("Score added successfully!");
        } else {
            alert("Error: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while adding the score.");
    });
}

function updateScore(userID, newScore, newWaveReached, level) {
    const data = {
        userID: parseInt(userID),
        score: parseInt(newScore),
        waveReached: parseInt(newWaveReached),		
        level: parseInt(level)
    };
	console.log(data);
    fetch('../PHP/updateScores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        if (result.status === 'success') {
            alert("Score and data updated successfully!");
        } else {
            alert("Error: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while updating the score.");
    });
}

function level1ToLevel2() {
    hideLevel2UnlockPopup();
    if((sessionStorage.getItem('unlock') == '2') || (sessionStorage.getItem('unlock') == '3')){
		console.log("level 2 button clicked");
		sessionStorage.setItem("level", 'level2'); // Set current level to level2 to determine waypoints.
		window.location.href = '../level2.html';
	}
}

function displayLevel2UnlockPopup() {
    console.log("displaying level2UnlockPopup");
    document.getElementById('level2UnlockPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
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
    setTimeout(paused = true, 1000);
	victorySound.currentTime = 0;
    victorySound.play();
}

function hideLevel2UnlockPopup() {
    console.log("hiding level2UnlockPopup");
    document.getElementById('level2UnlockPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
}

function displayLevel3UnlockPopup() {
    console.log("displaying level3UnlockPopup");
    document.getElementById('level3UnlockPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
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
    setTimeout(paused = true, 1000);
}

function hideLevel3UnlockPopup() {
    console.log("hiding level3UnlockPopup");
    document.getElementById('level3UnlockPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
}
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
		if (!menuPaused) {
			togglePause();
		}
    }
});