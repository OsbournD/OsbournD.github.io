const pauseMenu = document.getElementById('pauseMenu');
const hintsPanel = document.getElementById('hintsPanel');
const resumeButton = document.getElementById('resumeButton');
const settingsButton = document.getElementById('settingsButton');
const hintsButton = document.getElementById('hintsButton');
const saveButton = document.getElementById('saveButton');
const quitButton = document.getElementById('quitButton');
const pauseButton = document.getElementById('pauseButton');
const settings = document.getElementById('settings');

let hintsActive = false;
let activeOverlay = null;

pauseButton.addEventListener('click', togglePause);

function togglePause() {
    if (menuPaused) {
        pauseMenu.style.display = 'none';
        menuPaused = false;
        paused = false;
        if(questionAsked)
            newRound();
		if(newWave){
			if(round % 5 == 0) {
				bossRound();
			} else {
				startNormalRound();
			}
			newWave = false;
		}
        questionAsked = false;
    } else {
        pauseMenu.style.display = 'block';
        menuPaused = true;
        paused = true;
    }
}

resumeButton.addEventListener('click', togglePause);

quitButton.addEventListener('click', () => {
    stopSpeech();
    window.location.href = '../HTML/levelSelect.html';
});

saveButton.addEventListener('click', () => {
    if (currentScore > 0) {
        if (firstHighScore && userID !== '1') {
            addScore(userID, currentScore, round, level);
            firstHighScore = false;
        } else if (newHighScore) {
            updateScore(userID, level, currentScore, round);
            newHighScore = false;
        }
    }
});

function toggleHints() {
    const hintContainers = document.querySelectorAll('.hint-container');

    if (hintsActive) {
        hintsPanel.style.display = 'none';
        hintContainers.forEach((container) => {
            const overlay = container.querySelector('.hint-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                overlay.removeEventListener('click', handleOverlayClick);
            }
        });
        hintsActive = false;
    } else {
        hintsPanel.style.display = 'flex';
        addHintListeners();
        hintsActive = true;
    }
}

function addHintListeners() {
    const hintContainers = document.querySelectorAll('.hint-container');
    hintContainers.forEach((container) => {
        const overlay = container.querySelector('.hint-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.addEventListener('click', handleOverlayClick);
        }
    });
}

function handleOverlayClick(event) {
    const overlay = event.target;
    const hintTarget = overlay.previousElementSibling;
    const hint = hintTarget.getAttribute('data-hint');
    const hintText = document.getElementById('hintText');

    if (activeOverlay === overlay) {
        overlay.classList.remove('active');
        activeOverlay = null;
        hintText.textContent = "Welcome to the game! Follow the hints to succeed. You can see hints by clicking on any yellow panel.";
    } else {
        if (activeOverlay) {
            activeOverlay.classList.remove('active');
        }
        overlay.classList.add('active');
        activeOverlay = overlay;
        hintText.textContent = hint;
        if (hintTarget.classList.contains('tower-slot') && towersToPlace > 0) {
            document.querySelectorAll('.tower-slot').forEach(slot => 
                slot.style.border = '2px solid #165c1a'
            );
            selectedTowerType = hintTarget.dataset.towerType;
            hintTarget.style.border = '2px solid #00ff00';
        }
    }
}

hintsButton.addEventListener('click', toggleHints);

settingsButton.addEventListener('click', () => {
    settings.style.display = 'block';
	
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
        togglePause();
    }
});

function goBack() {
    settings.style.display = 'none';
}

function toggleTextToSpeech() {
    var textToSpeechToggle = document.getElementById('textToSpeechToggle');
    var isChecked = textToSpeechToggle.checked;

    // Save the state to localStorage
    localStorage.setItem('textToSpeechEnabled', isChecked);
    if (isChecked) {
        console.log("Text-to-Speech Enabled");
    } else {
        console.log("Text-to-Speech Disabled");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var textToSpeechToggle = document.getElementById('textToSpeechToggle');

    // Retrieve the saved state from localStorage
    var savedState = localStorage.getItem('textToSpeechEnabled');

    if (savedState !== null) {
        textToSpeechToggle.checked = (savedState === 'true');
    }
});

function toggleMusic() {
    var musicToggle = document.getElementById('musicToggle');
    var isChecked = musicToggle.checked;

    // Save the state to localStorage
    localStorage.setItem('musicDisabled', isChecked);
	isMusicDisabled = localStorage.getItem('musicDisabled') === 'false';
    if (isChecked) {
        console.log("Music Disabled");
        gameMusic.pause();
    } else {
        console.log("Music Enabled");
        gameMusic.currentTime = 16.6;
        gameMusic.play();
        gameMusic.volume = 0.1;
    }
}

// Run this function when the settings page loads to apply the saved state
document.addEventListener('DOMContentLoaded', function () {
    var musicToggle = document.getElementById('musicToggle');

    // Retrieve the saved state from localStorage
    var savedState = localStorage.getItem('musicDisabled');

    if (savedState !== null) {
        musicToggle.checked = (savedState === 'true');
    }
});