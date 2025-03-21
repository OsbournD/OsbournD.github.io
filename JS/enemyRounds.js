let spawnInterval = 500;
let round = 0;
let roundFlag = false;
let waveStartTime = 0;
let WAVE_START_DELAY = 3000; // 3 second delay
let newWave = false;

function newRound() 
{
    if (paused == false)
    {
        if(round == 0)
        {
            towersToPlace = 3;
        }
        console.log('New Round')
        round++;
        waveStartTime = Date.now(); // Record when wave starts
        
        if (currentLevel !== 'introLevel'){
            advanceWave();
        }
        if (round > 1) {
            increaseScoreRound();
        }
        
		if(currentLevel == 'level1'){
        document.getElementById('WaveCounter').innerHTML = 'Wave: ' + round + ' / 20 - Starting in 3s';
		}else{
        document.getElementById('WaveCounter').innerHTML = 'Wave: ' + round + ' - Starting in 3s';
		}
        document.getElementById('towerPoints').innerHTML = 'Tower Points: ' + towersToPlace;
        
        // Wait for delay then start spawning
		if(currentLevel == 'introLevel'){
			WAVE_START_DELAY = 0;
		}
        setTimeout(() => {
			if(menuPaused){
				newWave = true;
			}else{
				if(round % 5 == 0) {
					bossRound();
				} else {
					startNormalRound();
				}
			}
        }, WAVE_START_DELAY);
    }
	if(round == 21){
		if(level == 1){
			sessionStorage.setItem('unlock', '2');
            displayLevel2UnlockPopup();
		}else if(level == 2){
			sessionStorage.setItem('unlock', '3');
            // displayLevel3UnlockPopup();
		}
	}
}

function startNormalRound() {
	if(currentLevel == 'level1'){
        document.getElementById('WaveCounter').innerHTML = 'Wave: ' + round + ' / 20';
		}else{
        document.getElementById('WaveCounter').innerHTML = 'Wave: ' + round;
		}
    let spawnedInRound = 0;
    const currentInterval = setInterval(() => {
        if (spawnedInRound < round) {
            roundFlag = true;
            game.enemies.push(new Enemy());
            console.log('Spawned new enemy');
            spawnedInRound++;
        } else {
            roundFlag = false;
            clearInterval(currentInterval);
        }
    }, spawnInterval);
}

function bossRound()
{
    console.log('Boss Round')
	if(currentLevel == 'level1'){
        document.getElementById('WaveCounter').innerHTML = 'Wave: ' + round + ' / 20';
		}else{
        document.getElementById('WaveCounter').innerHTML = 'Wave: ' + round;
		}
    document.getElementById('towerPoints').innerHTML = 'Tower Points: ' + towersToPlace;  
    let spawnedInRound = 0;
    const currentInterval = setInterval(() => {
        if (spawnedInRound < round/5) {
            roundFlag = true;
            game.enemies.push(new Boss());
            console.log('Spawned new enemy');
            spawnedInRound++;
        } else {
            roundFlag = false;
            clearInterval(currentInterval);
        }
    }, spawnInterval);
}

function updateWaveCountdown() {
    if (Date.now() - waveStartTime < WAVE_START_DELAY) {
        const timeLeft = Math.ceil((WAVE_START_DELAY - (Date.now() - waveStartTime)) / 1000);
		if(currentLevel == 'level1'){
			document.getElementById('WaveCounter').innerHTML = `Wave ${round} / 20 - Starting in ${timeLeft}s`;
		}else{
			document.getElementById('WaveCounter').innerHTML = `Wave ${round} - Starting in ${timeLeft}s`;
		}
    }
}