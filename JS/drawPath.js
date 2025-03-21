if (sessionStorage.getItem('userID') == null) {
    window.location.href = '../HTML/login.html';
}
const basicBot = new Image();
const bossBot = new Image();

const basicPirateBot = new Image();
const bossPirateBot = new Image();


const basicTower = new Image();
const freezeTower = new Image();
const lightningTower = new Image();

let waypoints;

let currentLevel;
let level;

let waypointsLevel1 = [
    { x: 50, y: 70 },
    { x: 50, y: 200 },
    { x: 300, y: 200 },
    { x: 300, y: 270 },
    { x: 150, y: 270 },
    { x: 150, y: 500 },
    { x: 550, y: 500 },
    { x: 550, y: 100 },
    { x: 700, y: 100 },
    { x: 700, y: 580 }

];
let waypointsLevel2 = [
    { x: 670, y: 190 },
    { x: 700, y: 270 },
    { x: 700, y: 400 },
    { x: 660, y: 530 },
    { x: 520, y: 540 },
    { x: 480, y: 500 },
    { x: 400, y: 330 },
    { x: 380, y: 220 },
    { x: 390, y: 120 },
    { x: 360, y: 60 },
    { x: 200, y: 40 },
    { x: 70, y: 70 },
    { x: 30, y: 200 },
    { x: 40, y: 320 },
    { x: 120, y: 350 },
    { x: 190, y: 360 },
    { x: 220, y: 420 },
    { x: 190, y: 480 },
    { x: 120, y: 520 },
    
];
let waypointsIntroLevel = [
    { x: 50, y: 80 },
    { x: 100, y: 400 },
    { x: 400, y: 400 },
    { x: 450, y: 200 },
    { x: 700, y: 200 },
    { x: 650, y: 600 } 
];



let canvas, ctx;

function selectWaypoints() { // Depending on the current level opened, draws a different shaped path.

    currentLevel = sessionStorage.getItem('level');

    if (currentLevel == 'level1') {
        console.log('level1');
        level = 1;
        waypoints = waypointsLevel1;
        console.log(waypoints);
    } else if (currentLevel == 'level2') {
        console.log('level2');
        level = 2;
        waypoints = waypointsLevel2;
        console.log(waypoints);
    } else if (currentLevel == 'introLevel') {
        console.log('introLevel');
        level = 0;
        waypoints = waypointsIntroLevel;
    }
}

function initCanvas() {

    selectWaypoints(); // Determines waypoints to be used when level html loaded.

    canvas = document.createElement('canvas'); // Creates canvas
    canvas.width = 800;
    canvas.height = 600;

    const container = document.getElementById('canvasContainer');
    if (container) {
        container.appendChild(canvas); // Adds canvas to the container
    } else {
        console.error('Canvas container not found');
        return;
    }

    ctx = canvas.getContext('2d'); // Creates 2D context that allows changing graphics

    basicPirateBot.src = '../Assets/basicPirateBot.png'; // Assigns basic pirate bot image location to basicPirateBot
    bossPirateBot.src = '../Assets/bossPirateBot.png'; // Assigns boss pirate bot image location to bossPirateBot

    basicBot.src = '../Assets/basicBot.png'; // Assigns basic bot image location to basicBot
    bossBot.src = '../Assets/bossBot.png'; // Assigns boss bot image location to bossBot

    basicTower.src = '../Assets/basicTower.png'; // Assigns basic tower image location to basicTower
	freezeTower.src = '../Assets/freezeTower.png';
	lightningTower.src = '../Assets/teslaTower.png';
	
	
    // Attach event listener to handle clicks for placing towers
    canvas.addEventListener('click', (e) => {
        if (currentLevel == 'introLevel' && round == 1) { // Player should not be able to place towers on the first round of the intro level.
            return;
        }
        else if (currentLevel == 'introLevel' && round == 2) { // Game does not start again until the user has placed their towers.
            if (towersToPlace != 0) {
                paused = true;
                console.log("game is paused");
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                canvasClicked(x, y);
                game.towers.forEach(tower => tower.draw());
                console.log("tower placed");
            }
            if (towersToPlace == 0) {
                paused = false;
            }
        }
        else {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            canvasClicked(x, y);
        }
    });

    initScore();

    updateScores();
	startMusic();
    newRound(); // Start first round
    gameLoop(); // Start the game loop
}



function drawPath() { // Depending on the current level opened, draws a different style path.

    if (currentLevel == 'level1') {

        ctx.lineWidth = 34;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

        ctx.lineWidth = 30;
        ctx.strokeStyle = 'gold';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

    } else if (currentLevel == 'level2') {

        ctx.lineWidth = 24;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

        ctx.lineWidth = 20;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

    } else if (currentLevel == 'introLevel') {

        ctx.lineWidth = 34;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

        ctx.lineWidth = 30;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

    }


}

window.onload = initCanvas;