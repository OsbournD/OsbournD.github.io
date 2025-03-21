const waves = [
    [{ type: 'basicBot', src: '../Assets/basicBot.png' }],
    [{ type: 'basicBot', src: '../Assets/basicBot.png' }],
    [{ type: 'basicBot', src: '../Assets/basicBot.png' }],
    [{ type: 'basicBot', src: '../Assets/basicBot.png' }],
    [{ type: 'bossBot', src: '../Assets/bossBot.png' }, { type: 'basicBot', src: '../Assets/basicBot.png' }],
    [{ type: 'basicBot', src: '../Assets/basicBot.png' }]
];

let currentWaveIndex = -1;

function updateWavePreviews() {
    const currentWaveEnemies = document.getElementById('currentWavePreview');
    const nextWaveEnemies = document.getElementById('nextWavePreview');
    
    currentWaveEnemies.innerHTML = '<h3>Current Wave</h3>';
    nextWaveEnemies.innerHTML = '<h3>Next Wave</h3>';

    waves[currentWaveIndex].forEach((enemy) => {
        const enemyBox = document.createElement('div');
        enemyBox.classList.add('enemy-box');
        enemyBox.classList.add('hint-container');

        const img = document.createElement('img');
        img.src = enemy.src;
        img.alt = enemy.type;
        img.classList.add('hint-target');
        img.dataset.hint = `This is a ${enemy.type}. It will spawn in the current wave!`;

        const overlay = document.createElement('div');
        overlay.classList.add('hint-overlay');

        const label = document.createElement('span');
        label.textContent = enemy.type;

        enemyBox.appendChild(img);
        enemyBox.appendChild(overlay);
        enemyBox.appendChild(label);
        currentWaveEnemies.appendChild(enemyBox);
    });

    if (waves[currentWaveIndex + 1]) {
        waves[currentWaveIndex + 1].forEach((enemy) => {
            const enemyBox = document.createElement('div');
            enemyBox.classList.add('enemy-box');
            enemyBox.classList.add('hint-container');

            const img = document.createElement('img');
            img.src = enemy.src;
            img.alt = enemy.type;
            img.classList.add('hint-target');
            img.dataset.hint = `This is a ${enemy.type}. It will spawn in the next wave!`;

            const overlay = document.createElement('div');
            overlay.classList.add('hint-overlay');

            const label = document.createElement('span');
            label.textContent = enemy.type;

            enemyBox.appendChild(img);
            enemyBox.appendChild(overlay);
            enemyBox.appendChild(label);
            nextWaveEnemies.appendChild(enemyBox);
        });
    }

    if (hintsActive) {
        addHintListeners();
    }
}

function advanceWave() {
    currentWaveIndex++;
    if(currentWaveIndex == 5)
        currentWaveIndex = 0;
    updateWavePreviews();
}