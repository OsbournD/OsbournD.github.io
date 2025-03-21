function displayIntroStartPopup() { // Displays welome pop up after drawPath has been executed on the intro level.
    console.log("displaying introStartPopup");
    document.getElementById('introStartPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
    setTimeout(paused = true, 1000);
}
setTimeout(displayIntroStartPopup, 500);

function hideIntroStartPopup() { // Hides the pop up once the next button is clicked.
    console.log("hiding introStartPopup");
    document.getElementById('introStartPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
    setTimeout(displayIntroStartSecondPopup, 100);
}

function displayIntroStartSecondPopup() {
    paused = true;
    console.log("displaying introStartSecondPopup");
    document.getElementById('introStartSecondPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function hideIntroStartSecondPopup() { // Hides the pop up once the next button is clicked.
    console.log("hiding introStartSecondPopup");
    document.getElementById('introStartSecondPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
    setTimeout(displayIntroFirstPopup, 2000);
}


function displayIntroFirstPopup() { // Displays the first pop up once a bot has spawned.
    console.log("displaying introFirstPopup");
    document.getElementById('introFirstPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
    setTimeout(paused = true, 1000);
}

function hideIntroFirstPopup() { 
    console.log("hiding introFirstPopup");
    document.getElementById('introFirstPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
}


function displayIntroSecondPopup() { // Displays the second pop up once the first bot makes it to the end of the path.
    console.log("displaying introSecondPopup");
    document.getElementById('introSecondPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
    setTimeout(paused = true, 1000);
}

function hideIntroSecondPopup() { // Hides the pop up once the next button is clicked.
    console.log("hiding introSecondPopup");
    document.getElementById('introSecondPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
    newRound(); // Starts a new round once the pop up disappears.
    setTimeout(displayIntroThirdPopup, 1000); // Third pop up is displayed once the second wave of bots are spawned.
}


function displayIntroThirdPopup() {
    console.log("displaying introThirdPopup");
    document.getElementById('introThirdPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
    setTimeout(paused = true, 1000);
}

function hideIntroThirdPopup() { // Hides the pop up once the next button is clicked.
    console.log("hiding introThirdPopup");
    document.getElementById('introThirdPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    //paused = false;
}

function displayIntroFourthPopup() { // Displays the fourth pop up only once round 2 has been completed.
    if (round == 2 && enemiesKilled == 2) {
        console.log("displaying introFourthPopup");
        document.getElementById('introFourthPopup').style.display = 'block';
        document.getElementById('AgentSwiggle').style.display = 'block';
        setTimeout(paused = true, 500);
    }
}

function hideIntroFourthPopup() { // Hides the pop up once the next button is clicked.
    console.log("hiding introFourthPopup");
    document.getElementById('introFourthPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
    //setTimeout(askQuestion(), 100); // Asks the player their first question once the pop up is closed.
    setTimeout(displayIntroQuestionPopup, 600);
}

function displayIntroQuestionPopup() {
    paused = true;
    console.log("displaying introQuestionPopup"); 
    document.getElementById('introQuestionPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function incorrectIntroAnswer() {
    console.log("incorrect intro question answer");
    hideIntroQuestionPopup();
    displayIntroQuestionIncorrectPopup();
}

function displayIntroQuestionIncorrectPopup() {
    console.log("displaying introQuestionIncorrectPopup");
    document.getElementById('introQuestionIncorrectPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function hideIntroQuestionIncorrectPopup() {
    document.getElementById('introQuestionIncorrectPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    newRound(); // Starts a new round once the pop up disappears.
    console.log("game running");
    paused = false;
}
function correctIntroAnswer() {
    console.log("correct intro question answer");
    towersToPlace = towersToPlace + 3;
    hideIntroQuestionPopup();
    displayIntroQuestionCorrectPopup();
}

function displayIntroQuestionCorrectPopup() {
    console.log("displaying introQuestionCorrectPopup");
    document.getElementById('introQuestionCorrectPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function hideIntroQuestionCorrectPopup() {
    document.getElementById('introQuestionCorrectPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    newRound(); // Starts a new round once the pop up disappears.
    console.log("game running");
    paused = false;
}

function hideIntroQuestionPopup() {
    console.log("hiding introQuestionPopup");
    document.getElementById('introQuestionPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
}



function displayIntroQuestionSecondPopup() {
    paused = true;
    console.log("displaying introQuestionSecondPopup");
    document.getElementById('introQuestionSecondPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function incorrectIntroSecondAnswer() {
    console.log("incorrect intro question answer");
    hideIntroQuestionSecondPopup();
    displayIntroQuestionIncorrectSecondPopup();
}

function displayIntroQuestionIncorrectSecondPopup() {
    console.log("displaying introQuestionIncorrectSecondPopup");
    document.getElementById('introQuestionIncorrectSecondPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function hideIntroQuestionIncorrectSecondPopup() {
    document.getElementById('introQuestionIncorrectSecondPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    newRound(); // Starts a new round once the pop up disappears.
    console.log("game running");
    paused = false;
}
function correctIntroSecondAnswer() {
    console.log("correct intro question answer");
    towersToPlace = towersToPlace + 3;
    hideIntroQuestionSecondPopup();
    displayIntroQuestionCorrectSecondPopup();
}

function displayIntroQuestionCorrectSecondPopup() {
    console.log("displaying introQuestionCorrectSecondPopup");
    document.getElementById('introQuestionCorrectSecondPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function hideIntroQuestionCorrectSecondPopup() {
    document.getElementById('introQuestionCorrectSecondPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    newRound(); // Starts a new round once the pop up disappears.
    console.log("game running");
    paused = false;
}

function hideIntroQuestionSecondPopup() {
    console.log("hiding introQuestionSecondPopup");
    document.getElementById('introQuestionSecondPopup').style.display = 'none';
    document.getElementById('AgentSwiggle').style.display = 'none';
    paused = false;
}

function displayIntroEndPopup() {
    paused = true;
    console.log("displaying introEndPopup");
    document.getElementById('introEndPopup').style.display = 'block';
    document.getElementById('AgentSwiggle').style.display = 'block';
}

function introLevelToLevelSelect() {
    window.location.href = '../HTML/levelSelect.html';
}
 