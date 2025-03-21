const menuMusic = new Audio("../GameMusic/685206__x1shi__video-game-music-seamless.mp3");

window.onload = function() {

	var isMusicDisabled = localStorage.getItem('musicDisabled') === 'false';

	if (isMusicDisabled) {
        menuMusic.currentTime = 16.6;
        menuMusic.play();
        menuMusic.volume = 0.1;
    }

	if(sessionStorage.getItem('unlock') == '2'){
		document.getElementById("button2").style.backgroundColor = "#ff69b4";
		console.log("test");
	}
	else if(sessionStorage.getItem('unlock') == '3'){
		document.getElementById('button2').style.backgroundColor = "#ff69b4";
		document.getElementById('button3').style.backgroundColor = "#ff69b4";
	}
};
function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    noLoop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function goBack() {
    window.location.href = '../HTML/questionSelect.html';
}

function goToIntroLevel() {
    console.log("intro level button clicked");
    sessionStorage.setItem("level", 'introLevel'); // Set current level to introLevel to determine waypoints.
    window.location.href = '../HTML/introLevel.html';
}

function goToSetSelect() {
    console.log("question selection button clicked");
    window.location.href = '../HTML/questionSelect.html';
}

function goToLevel1() {
    console.log("level 1 button clicked");
    sessionStorage.setItem("level", 'level1'); // Set current level to level1 to determine waypoints.
    window.location.href = '../HTML/level1.html';
}
function goToLevel2() {
	if((sessionStorage.getItem('unlock') == '2') || (sessionStorage.getItem('unlock') == '3')){
		console.log("level 2 button clicked");
		sessionStorage.setItem("level", 'level2'); // Set current level to level2 to determine waypoints.
		window.location.href = '../HTML/level2.html';
	}
}
function goToLevel3() {
	if(sessionStorage.getItem('unlock') == '3'){
		console.log("level 3 button clicked");
		sessionStorage.setItem("level", 'level3'); // Set current level to level3 to determine waypoints.
		window.location.href = '../HTML/Menu.html';
	}
}