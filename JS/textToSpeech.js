function speakText(text) {
    if ('speechSynthesis' in window) {
        // Retrieve and convert the setting to a boolean
        var isTextToSpeechEnabled = localStorage.getItem('textToSpeechEnabled') === 'true';

        if (isTextToSpeechEnabled) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = 1.2;    // Range: 0 (low) to 2 (high)
            utterance.rate = 0.9;     // Range: 0.1 (slow) to 10 (fast)
            utterance.volume = 1;
            window.speechSynthesis.speak(utterance);
        } else {
            console.log("Text-to-Speech is disabled.");
        }
    } else {
        console.error('Text-to-Speech is not supported in this browser.');
    }
}


function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}