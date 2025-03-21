const menuMusic = new Audio("../GameMusic/685206__x1shi__video-game-music-seamless.mp3");

function setup() {
    var isMusicDisabled = localStorage.getItem('musicDisabled') === 'false';

	if (isMusicDisabled) {
        menuMusic.currentTime = 16.6;
        menuMusic.play();
        menuMusic.volume = 0.1;
    }
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    noLoop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function goBack() {
    window.location.href = '../HTML/Menu.html';
}

function goToMainSettings() {
    window.location.href = '../HTML/mainSettings.html';
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

// Run this function when the settings page loads to apply the saved state
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

    if (isChecked) {
        console.log("Music Disabled");
        menuMusic.pause();
    } else {
        console.log("Music Enabled");
        menuMusic.currentTime = 16.6;
        menuMusic.play();
        menuMusic.volume = 0.1;
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

window.onload = setup;