function isEmpty(value) 
{
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}

function isArray(value) {
    return (false)
}

//Checks for undefined or invalid data within the question sets

//Structure of question set

//Array of question sets

//Each question set is made of 3 arrays

// [Set:
//      [Question, Type]
//      [Total answers]
//      [Correct answer(s)]
// ]

//1 Iterates through each question set
//2 Iterates through question grouping
//3 Iterates through total answers
//4 Iterates through correct answers

//This function is a work and progress and currently will not be called

function DataValidation(QandA2D)
{
    //Check if the question set is empty or undefined
    if (isEmpty(QandA2D) == true)
    {
        console.log("Data set was invalid or missing");
        return;
    }
    //Iterate through every question set
    for (let x = 0; x < QandA2D.length; x++)
    {
        //Iterate through Question
        for (let a = 0; a < QandA2D[x].length; a++)
        {
            if (isEmpty(QandA2D[x][a]) == true)
            {
                console.log('Removing question set', x);
                QandA2d.splice(x, 1);
            }
        }
    }
}



/////////////////////////
//Initial Data Processing
/////////////////////////
let currentSet = [];

//Creating a 2d array to store all assosciated arrays
let QandA2D = [];

function fillQuestionsStack()
{
        //let possibleIndexes = [];

        //for (let a = 0; a < QandA2D.length -1; a++)
        //{
        //    possibleIndexes[a] = a;
        //}
        
        //while (possibleIndexes.length > 0)
        for (let o = 0; o < QandA2D.length;o++)
        {
            pendingQuestionsStack.push(QandA2D[o]);
        }
        pendingQuestionsStack = mixAnswers(pendingQuestionsStack);
        //console.log('Full pending stack is ' + pendingQuestionsStack);

    //console.log('The second element of the stack is' + pendingQuestionsStack[1]);
}

//Choose JSON File

//

//JSON method


//Choose JSON File based on localStorage
function getSelectedJsonFile() {
    // Get the selected file from localStorage, or use default if not set
    const selectedFile = localStorage.getItem('selectedQuestionFile') || 'Questions.json';
    console.log('Loading question set from:', selectedFile);
    return selectedFile;
}

//JSON method - modified to use the selected file
fetch(`../JSON/${getSelectedJsonFile()}`)
    .then(response => response.json())
    .then(questions => {
        for (let k = 0; k < questions.length; k++) {
            QandA2D[k] = [[questions[k].question, questions[k].type], questions[k].options, questions[k].answer];
        }
        //Initialize the questions stack after loading
        fillQuestionsStack();
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
        //If there's an error, try to load the default file as a fallback
        if (localStorage.getItem('selectedQuestionFile') && 
            localStorage.getItem('selectedQuestionFile') !== 'Questions.json') {
            console.log('Attempting to load default question set');
            localStorage.setItem('selectedQuestionFile', 'Questions.json');
            // Retry with the default file
            fetch('../JSON/Questions.json')
                .then(response => response.json())
                .then(questions => {
                    for (let k = 0; k < questions.length; k++) {
                        QandA2D[k] = [[questions[k].question, questions[k].type], questions[k].options, questions[k].answer];
                    }
                    fillQuestionsStack();
                })
                .catch(err => console.error('Error loading default JSON:', err));
        }
    });
//Create stack to store unanswered questions in
let pendingQuestionsStack = [];


function removeQuotationMarks(js)
{
    for (let i = 0; i < js.length; i++) 
        {
            if (js[i] == "\"")
            {
                js[i] = "&quot;";
            }

            if (js[i] == "\"")
                {
                    js[i] = "#39;";
                } 
        }
        return js;
}


let mixedAnswers = [];

function mixAnswers(answers) 
{
    //Shuffle the array using the Fisher-Yates algorithm
    for (let i = answers.length - 1; i > 0; i--)
        {
            let j = Math.floor(Math.random() * (i + 1)); // Random index
            [answers[i], answers[j]] = [answers[j], answers[i]]; // Swap elements
        }
    return answers;
}


/////////////////////////////
//End Initial Data Processing
/////////////////////////////



//Different types of questions

function createSingleAnswerQuestion(currentSet, answers)
{
    let currentQuestion = currentSet[0];
    let correctAnswer = currentSet[2][0];


    if (currentSet[0][1] != "SA") {
        console.log('Requirements not met: '+currentSet[0][1]);
        alert('SA entered without meeting requirements '+currentSet[0][1]);
    }

    //Update the popup content
    let popup = document.getElementById('questionPopup');
    popup.innerHTML = `
        <h2>${currentQuestion[0]}</h2>
        <div id="answers">
            ${answers.map((answer) => `
                <button 
                style="font-size: 1rem; padding: 0.5rem 1rem; border: none; border-radius: 8px; cursor: pointer; transition: transform 0.1s ease; box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.4);"                 onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
                onmousedown="this.style.transform='scale(0.95)'"
                onmouseup="this.style.transform='scale(1.05)'"
                onclick="singleAnswerSelection('${answer.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', '${correctAnswer.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">                    
                    ${answer}
                </button>
            `).join('')}
        </div>`;

        return popup;
}

function createMultipleChoiceQuestion(currentSet) {
    // Validate the question set
    if (currentSet[0][1] != "MC" || currentSet[2].length < 2) {
        console.log('Requirements not met');
        alert('MC entered without meeting requirements');
        return;
    }

    //Extract question components
    const question = currentSet[0][0];
    const answers = currentSet[1];
    const correctAnswers = currentSet[2];

    //Get the popup element
    let popup = document.getElementById('questionPopup');

    // Add styles if they don't exist
    if (!document.getElementById('mcStyles')) {
        const styles = document.createElement('style');
        styles.id = 'mcStyles';
        styles.textContent = `
            .mc-option {
                font-size: 1rem;
                padding: 0.5rem 1rem;
                margin: 0.5rem 0;
                width: 100%;
                text-align: left;
                border: 2px solid #ddd;
                border-radius: 8px;
                cursor: pointer;
                background-color: white;
            }
            .mc-option.selected {
                background-color:rgb(120, 194, 254);
                color: white;
            }
            .mc-option.correct {
                background-color: #4CAF50;
                color: white;
            }
            .mc-option.incorrect {
                background-color: #f44336;
                color: white;
            }
            .mc-option.unselected-correct {
                border: 8px solid #4CAF50;
            }
        `;
        document.head.appendChild(styles);
    }

    //Create a hidden input field to store the correct answers as JSON
    const hiddenDataId = 'mc-data-' + Math.random().toString(36).substring(2, 9);

    //Create the HTML structure
    popup.innerHTML = `
        <h2>${question}</h2>
        <div id="answers">
            <input type="hidden" id="${hiddenDataId}" value='${JSON.stringify(correctAnswers).replace(/'/g, "&apos;")}'>
            ${answers.map((answer) => `
                <button class="mc-option" 
                        onclick="this.classList.toggle('selected')" 
                        data-value="${encodeURIComponent(answer)}">
                        ${answer}
                </button>
            `).join('')}
            <button style="margin-top: 1rem;"
                id="quest-submit"
                class="answer-btn"
                onclick="checkboxAnswerSelectionWithHiddenData('${hiddenDataId}', ${answers.length})">
                Submit
            </button>
        </div>`;

    return popup;
}

function checkboxAnswerSelectionWithHiddenData(hiddenDataId, totalAnswersCount) {
    stopSpeech();

    //Remove the submit button
    const submitButton = document.getElementById('quest-submit');
    if (submitButton) {
        submitButton.remove();
    }

    //Get correct answers from hidden field
    const correctAnswersArray = JSON.parse(document.getElementById(hiddenDataId).value);
    
    //Get all options and find which ones are selected
    const options = document.querySelectorAll('.mc-option');
    const selectedOptions = Array.from(options).filter(opt => opt.classList.contains('selected'));
    
    //Get the values of selected options
    const selectedAnswers = selectedOptions.map(opt => decodeURIComponent(opt.dataset.value));
    
    //Calculate score using existing logic
    let score = 0;
    correctAnswersArray.forEach((answer) => {
        if (selectedAnswers.includes(answer)) {
            score++;
        }
    });

    selectedAnswers.forEach((answer) => {
        if (!correctAnswersArray.includes(answer)) {
            score--;
        }
    });

    if (selectedAnswers.length === parseInt(totalAnswersCount)) {
        score = 0;
    }

    if (score < 0) {
        score = 0;
    }

    const allCorrect = correctAnswersArray.every((answer) => selectedAnswers.includes(answer)) &&
        selectedAnswers.length === correctAnswersArray.length;
    if (allCorrect) {
        score++;
    }

    //Visual feedback
    options.forEach(option => {
        const value = decodeURIComponent(option.dataset.value);
        const isSelected = option.classList.contains('selected');
        option.classList.remove('selected');
        
        if (isSelected && correctAnswersArray.includes(value)) {
            option.classList.add('correct');
        } else if (isSelected && !correctAnswersArray.includes(value)) {
            option.classList.add('incorrect');
        } else if (!isSelected && correctAnswersArray.includes(value)) {
            option.classList.add('unselected-correct');
        }

        // Disable the answer
        option.disabled = true;
        option.onclick = null;
        option.style.cursor = 'default';
    });

    towersToPlace += score;

    let resultMessage;
    if (allCorrect) {
        resultMessage = `Correct! You've selected all the right answers! You earned ${score} points.`;
    } else if (selectedAnswers.length === parseInt(totalAnswersCount)) {
        resultMessage = "You selected all the answers, nice try. No points awarded.";
    } else {
        resultMessage = `You earned ${score} points.`;
    }

    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = `
        <p>${resultMessage}</p>
        <p>Total towers to place: ${towersToPlace}.</p>
        <button class="answer-btn" onclick="closeQuestion()">Close</button>
    `;
    document.getElementById('answers').appendChild(resultDiv);
    speakText(resultMessage);
}


function displayQuestion() 
{
    document.getElementById('questionPopup').style.display = 'block';
}

let questionAsked = false;

function closeQuestion() 
{
    document.getElementById('questionPopup').style.display = 'none';
    stopSpeech();
	if(!menuPaused){
		paused = false;
		newRound();
	}else{
		questionAsked = true;	
	}
}


function singleAnswerSelection(selectedAnswer, correctAnswer) 
{
    stopSpeech();

    let resultMessage;
    if (selectedAnswer == correctAnswer) {
        resultMessage = "Correct. You may now place extra towers.";
        towersToPlace += 3;
    } else {
        resultMessage = `Incorrect. The correct answer was: ${correctAnswer}.`;
    }

    let popupContent = `
        <p>${resultMessage}</p>
        <button class="answer-btn" onclick="closeQuestion()">Close</button>
    `;
    document.getElementById('questionPopup').innerHTML = popupContent;

    setTimeout(() => speakText(resultMessage), 300);
}

function askQuestion() 
{
    if (paused == false)
    {
        //Pause the game
        paused = true;

        console.log("Question stack length is", pendingQuestionsStack.length);

        //Pop a question and answer set from the 2D array
        if (pendingQuestionsStack.length > 0)
        {
            currentSet = pendingQuestionsStack.pop();
            
        }
        else
        {
            //let questionIndex = Math.round(Math.floor(Math.random() * QandA2D.length - 1));
            //let questionIndex = Math.floor(Math.random() * QandA2D.length)
            //currentSet = QandA2D[questionIndex];
            //console.log("Stack is empty");
            console.log("Refill the stack");

            fillQuestionsStack();
            currentSet = pendingQuestionsStack.pop();
        }


        //Mix answers
        let currentQuestion = currentSet[0];
        
        //console.log('Current set is' + currentSet[0]);
        let answers = currentSet[1];
        answers = mixAnswers(answers);

        let correctAnswer = currentSet[2];


        // Update the popup content
        let popup = document.getElementById('questionPopup');

        switch(currentQuestion[1])
        {
            case "SA":
                popup = createSingleAnswerQuestion(currentSet, answers);
            break;
            case "MC":
                popup = createMultipleChoiceQuestion(currentSet);
            break
        }

        //popup = createSingleAnswerQuestion(currentSet, answers);

        //console.log("Final popup before display is:", popup);
        //console.log('New popup is: \n', popup);
        document.getElementById('questionPopup').innerHTML = popup.innerHTML;
        displayQuestion(); // Show the popup
        speakText(currentQuestion[0]+answers);
    }
}

console.log("questions.js compiled successfully");