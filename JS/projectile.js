let enemiesKilled = 0;
const defeatedSound = new Audio("../SoundEffects/bbc_comedy-sou_07005040.mp3");
const BaseShootingSound = new Audio("../SoundEffects/BaseShooting.mp3");
BaseShootingSound.volume = 0.2;

class Projectile {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 5;
        this.target = target;
        this.offScreen = false;
        BaseShootingSound.currentTime = 0;
        BaseShootingSound.play();
    }
	
	//runs every game loop to move projectile
    update(dt) {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x); //calculates angle to move towards target
        this.x += Math.cos(angle) * this.speed*dt; //moves towards target
        this.y += Math.sin(angle) * this.speed*dt;
		
		//calculates if projectile is on target
        if (Math.hypot(this.target.x - this.x, this.target.y - this.y) < this.size) {
            if (!this.target.offScreen) {
                this.target.health -= 1;
                checkBotHealth(this.target);
            }
            this.offScreen = true;
        }
    }
	
    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
	
	
}



function checkBotHealth(target){
	if (target.health <= 0 && target.defeated==false) {
		defeatedSound.currentTime = 0;
        defeatedSound.play();
        target.offScreen = true;
		target.defeated = true;
		if(target.type == 'basic'){
			enemiesKilled++;
		}else{
			bossKilled();
		}
		increaseScoreBot();
		if (currentLevel == 'introLevel' && round == 1 && enemiesKilled == 1) { // If the intro level is running, and all enemies have been defeated in the first round.
            enemiesKilled = 0;
        }else if (currentLevel == 'introLevel' && round == 2 && enemiesKilled == 2) { // If the intro level is running, and all enemies have been defeated in the second round.
                displayIntroFourthPopup(); // Displays the fourth intro level popup.
                enemiesKilled = 0;
            } else if (currentLevel == 'introLevel' && round == 3 && enemiesKilled == 3) { // Displays pop up only if the introduction level is being displayed and they have completed wave 3.
                displayIntroQuestionSecondPopup();
                enemiesKilled = 0;
            } else if (currentLevel == 'introLevel' && round == 4 && enemiesKilled == 4) { // Ends intro level once the fourth wave is complete.
                displayIntroEndPopup();
                enemiesKilled = 0;
            } else if(!(round%5==0)&&enemiesKilled>=round){
			enemiesKilled = 0;
			if (currentLevel != 'introLevel') {
                        setTimeout(askQuestion, 100);
            }
		}else if(enemiesKilled>=2*round){
			enemiesKilled = 0;
			setTimeout(askQuestion, 100);
		}
	}	
}