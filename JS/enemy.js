let enemies = [];
class Enemy {
    constructor(health = 3, speed = 3, type = 'basic', colour = 'red', size = 20, x = waypoints[0].x, y = waypoints[0].y, waypointIndex = 1) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.type = type;
        this.waypointIndex = waypointIndex;
        this.offScreen = false;
        this.defeated = false;
        this.maxHealth = health;
        this.health = health;
        this.colour = colour;
        this.baseSpeed = this.speed; // Store the original speed
        this.slowed = false;
        this.slowEndTime = 0;
        this.tint = null;
    }
    move() {
        let endXIndex = waypoints.length - 2;
        //console.log(this.x, this.y);
        if (((this.x >= 160) && (this.x <= 180)) && ((this.y <= 520) && (this.y >= 510))) {
            console.log('Offscreen');
            this.offScreen = true;
        }
        const now = Date.now();
        if (this.slowed && now > this.slowEndTime) {
            this.speed = this.baseSpeed;
            this.slowed = false;
            this.tint = null;
        }
        if (this.waypointIndex < waypoints.length) {
            const next = waypoints[this.waypointIndex];
            const dx = next.x - this.x;
            const dy = next.y - this.y;
            const distance = Math.hypot(next.x - this.x, next.y - this.y);
            if (distance > this.speed) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
            else {
                this.waypointIndex++;
            }
        }
        else {
            console.log('marked');
            this.offScreen = true; // Mark enemy as offscreen if it reaches the end
            decreaseLevelHP(); // Calls decreaseLevelHP function in levelHP.js, removing hitpoints from the level when bot reaches the end.
            enemiesKilled++; // Ensures that bots are detected as being removed when they reach the end;
            if (this.size == 80) {
                currentLevelHP = 1;
                decreaseLevelHP();
            }
            if (currentLevel == 'introLevel' && round == 1 && enemiesKilled == 1) { // If the intro level is running, and all enemies have been defeated in the first round.
                enemiesKilled = 0;
            } else if (currentLevel == 'introLevel' && round == 2 && enemiesKilled == 2) { // If the intro level is running, and all enemies have been defeated in the second round.
                displayIntroFourthPopup(); // Displays the fourth intro level popup.
                enemiesKilled = 0;
            } else if (currentLevel == 'introLevel' && round == 3 && enemiesKilled == 3) { // Displays pop up only if the introduction level is being displayed and they have completed wave 3.
                displayIntroQuestionSecondPopup();
                enemiesKilled = 0;
            } else if (currentLevel == 'introLevel' && round == 4 && enemiesKilled == 4) { // Ends intro level once the fourth wave is complete.
                displayIntroEndPopup();
                enemiesKilled = 0;
            } else {
                if (!(round % 5 == 0) && enemiesKilled >= round) { //check if all enemies killed and not boss wave
                    enemiesKilled = 0;
                    setTimeout(askQuestion, 1000);
                    if (currentLevel != 'introLevel') {
                        setTimeout(askQuestion, 1000);
                    }
                } else if (enemiesKilled >= 2 * round) {
                    enemiesKilled = 0;
                    setTimeout(askQuestion, 1000);
                }
            }
        }
    }

    draw() {

        if (this.tint) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = this.tint;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        if (currentLevel == 'level1') {

            if (this.type == 'basic') {

                ctx.drawImage(basicBot, this.x - 30, this.y - 45, 60, 60); // Detects when basic bot spawns and assigns the image to it.

            } else if (this.type == 'boss') {

                ctx.drawImage(bossBot, this.x - 50, this.y - 75, 100, 100); // Detects when boss enemy spawns and assigns the image to it.

            }

        } else if (currentLevel == 'level2') { 

            if (this.type == 'basic') {

                ctx.drawImage(basicPirateBot, this.x - 30, this.y - 45, 60, 60); // Detects when basic bot spawns and assigns the image to it.

            } else if (this.type == 'boss') {

                ctx.drawImage(bossPirateBot, this.x - 50, this.y - 75, 100, 100); // Detects when boss enemy spawns and assigns the image to it.

            }

        } else if (currentLevel == 'introLevel') {

            if (this.speed == 3) {

                ctx.drawImage(basicBot, this.x - 30, this.y - 45, 60, 60); // Detects when basic bot spawns and assigns the image to it.

            } else if (this.speed == 1) {

                ctx.drawImage(bossBot, this.x - 50, this.y - 75, 100, 100); // Detects when boss enemy spawns and assigns the image to it.

            }

        }

    }

}


class TankEnemy extends Enemy {
    constructor() {
        super(10, 2, 'purple');
    }
}

class MotherEnemy extends Enemy {
    constructor() {
        super(10, 1, 'black', 50);
    }
}

class BabyEnemy extends Enemy {
    constructor(x, y, waypointIndex) {
        super(1, 4, 'black', 15, x, y, waypointIndex);
    }
}

function motherKilled(motherEnemy) { //checks if enemy killed was a mother enemy and if so spawns a baby
    if (motherEnemy.size == 50) {
        console.log('mother killed');
        let baby = new BabyEnemy(motherEnemy.x, motherEnemy.y, motherEnemy.waypointIndex);
        game.enemies.push(baby);
        console.log(`Baby spawned at (${baby.x}, ${baby.y})`);
        console.log(`Mother died at (${motherEnemy.x}, ${motherEnemy.y})`);
        enemiesKilled--; //makes enemy killed not incremented as baby not killed
    }
}

class Boss extends Enemy {
    constructor() {
        super(50, 1, 'boss', 'red', 80);
    }
}

let deathWave = 10;
function bossKilled() {
    let waveSpawned = 0;
    let deathWaveInterval = 100;
    const currentInterval = setInterval(() => {
        if (waveSpawned < deathWave) {
            game.enemies.push(new Enemy()); // Spawn a new enemy to the stack
            console.log('Spawned new enemy');
            waveSpawned++;
        } else {
            clearInterval(currentInterval); // Stop spawning once we've reached the round count
        }
    }, deathWaveInterval);
}	