// Initialize audio
const menuMusic = new Audio("../GameMusic/685206__x1shi__video-game-music-seamless.mp3");

// DOM references
const status = document.getElementById('status');
const selector = document.getElementById('jsonSelector');

// Page initialization
window.onload = function() {
    var isMusicDisabled = localStorage.getItem('musicDisabled') === 'false';

    if (isMusicDisabled) {
        menuMusic.currentTime = 16.6;
        menuMusic.play();
        menuMusic.volume = 0.1;
    }
}

// Back button functionality
document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'Menu.html';
});

// Select Level button functionality
document.getElementById('selectLevelButton').addEventListener('click', function() {
    window.location.href = 'levelSelect.html'; // Navigate to level select page
});

// Function to update status message based on current selection
function updateStatusMessage(filename) {
    status.textContent = `Currently using: ${filename}`;
}

// Function to save the selected file
function saveSelectedFile(filename) {
    localStorage.setItem('selectedQuestionFile', filename);
    
    // Update dropdown to match selection
    if (selector.value !== filename) {
        // Look for the option with this value
        let found = false;
        for (let i = 0; i < selector.options.length; i++) {
            if (selector.options[i].value === filename) {
                selector.selectedIndex = i;
                found = true;
                break;
            }
        }
        
        // If not found in dropdown, add it
        if (!found) {
            const option = document.createElement('option');
            option.value = filename;
            option.textContent = filename;
            selector.appendChild(option);
            selector.value = filename;
        }
    }
    
    // Update status message
    updateStatusMessage(filename);
    
    // Flash status to indicate saving
    status.style.backgroundColor = "rgba(50, 205, 50, 0.7)";  // Green background
    
    setTimeout(() => {
        status.style.backgroundColor = "rgba(0, 0, 0, 0.7)";  // Back to original
    }, 1000);
    
    // Update visual selection of difficulty buttons
    updateDifficultyButtonSelection(filename);
}

// Function to update which difficulty button appears selected
function updateDifficultyButtonSelection(filename) {
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    
    // Remove selected class from all buttons
    difficultyButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to matching button if any
    difficultyButtons.forEach(btn => {
        if (btn.dataset.file === filename) {
            btn.classList.add('selected');
        }
    });
}

//Difficulty button click handling (shortcut for specific files)
const difficultyButtons = document.querySelectorAll('.difficulty-button');

difficultyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filename = this.dataset.file;
        saveSelectedFile(filename);
    });
});

//Function to fetch available JSON files
async function fetchAvailableJsonFiles() {
    try {
        //Hardcoded list of JSON files
        const files = ["Questions.json", "PureMA.json"];
        // You can add more files to this array as needed
        
        //Clear existing options except the default
        while (selector.options.length > 1) {
            selector.remove(1);
        }
       
        //Add options for each file
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            selector.appendChild(option);
        });
        
        //Get the saved file selection
        const savedFile = localStorage.getItem('selectedQuestionFile') || 'Questions.json';
        
        //Update the selector to show the saved file
        let fileExists = false;
        for (let i = 0; i < selector.options.length; i++) {
            if (selector.options[i].value === savedFile) {
                selector.selectedIndex = i;
                fileExists = true;
                break;
            }
        }
        
        //If a saved file doesn't exist in options, add it
        if (!fileExists) {
            const option = document.createElement('option');
            option.value = savedFile;
            option.textContent = savedFile;
            selector.appendChild(option);
            selector.value = savedFile;
        }
        
        //Update the status message and button selection
        updateStatusMessage(savedFile);
        updateDifficultyButtonSelection(savedFile);
        
    } catch (error) {
        console.error('Error fetching JSON files:', error);
        status.textContent = "Couldn't load question sets. Using default only.";
        status.style.backgroundColor = "rgba(255, 69, 0, 0.7)";  // Red background for error
        
        setTimeout(() => {
            status.style.backgroundColor = "rgba(0, 0, 0, 0.7)";  // Back to original
            updateStatusMessage(localStorage.getItem('selectedQuestionFile') || 'Questions.json');
        }, 1500);
    }
}

//Save button click handler
document.getElementById('saveButton').addEventListener('click', function() {
    const selectedFile = selector.value;
    saveSelectedFile(selectedFile);
});

//Add hover and active effects to buttons
const buttons = [
    document.getElementById('backButton'),
    document.getElementById('selectLevelButton'),
    document.getElementById('saveButton')
];

buttons.forEach(button => {
    button.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
    
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.05)';
    });
});

//Load available files and previous settings when page loads
window.addEventListener('DOMContentLoaded', fetchAvailableJsonFiles);