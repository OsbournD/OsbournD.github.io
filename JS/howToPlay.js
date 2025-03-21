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

window.onload = setup;