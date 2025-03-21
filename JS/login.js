let username;
let password;

function signUp() {
    classCode = document.getElementById('classCode').value;
	username = document.getElementById('usernameSignUp').value;
	password = document.getElementById('passwordSignUp').value;
    if (classCode === '') {
        alert('Please enter a class code.');
        return;
    }
    
    const generatedUsername = generateUsername();
    const data = {
        username: username,
		password: password,
		displayName: generatedUsername,
        classCode: classCode
    };

    fetch('../PHP/addUser.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(text => {
        try {
            const result = JSON.parse(text);
            if (result.status === 'success') {
                sessionStorage.setItem("username", generatedUsername);
                sessionStorage.setItem("userID", result.UserID);
                sessionStorage.setItem("classCode", classCode);
                window.location.href = '../HTML/Menu.html';
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            console.error("Response was:", text);
            alert("An unexpected error occurred. Check console for details.");
        }
    })
    .catch(error => {
        console.error("Network error:", error);
        alert("A network error occurred while creating the user.");
    });
}

function login() {
    const username = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;
    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    fetch('studentLogin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        if (result.status === 'success') {
            sessionStorage.setItem("username", result.displayName);
            sessionStorage.setItem("userID", result.UserID);
			localStorage.setItem('musicDisabled', 'false');
            window.location.href = '../HTML/Menu.html';
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Login failed. Please try again.");
    });
}

function guestLogin() {
    const guestName = generateUsername();
    sessionStorage.setItem("username", guestName);
    sessionStorage.setItem("userID", '1');
	sessionStorage.setItem("unlock", '2');
	localStorage.setItem('musicDisabled', 'false');
    window.location.href = '../HTML/Menu.html';
}

function generateUsername() {
    const adjectiveList = ["Adorable", "Adventurous", "Aggressive", "Agreeable", "Alert", "Alive", "Amused", "Angry", "Annoyed", "Annoying", "Anxious", "Arrogant", "Ashamed", "Attractive", "Average", "Awful", "Bad", "Beautiful", "Better", "Bewildered", "Black", "Bloody", "Blue", "Blue-eyed", "Blushing", "Bored", "Brainy", "Brave", "Breakable", "Bright", "Busy", "Calm", "Careful", "Cautious", "Charming", "Cheerful", "Clean", "Clear", "Clever", "Cloudy", "Clumsy", "Colorful", "Combative", "Comfortable", "Concerned", "Condemned", "Confused", "Cooperative", "Courageous", "Crazy", "Creepy", "Crowded", "Cruel", "Curious", "Cute", "Dangerous", "Dark", "Dead", "Defeated", "Defiant", "Delightful", "Depressed", "Determined", "Different", "Difficult", "Disgusted", "Distinct", "Disturbed", "Dizzy", "Doubtful", "Drab", "Dull", "Eager", "Easy", "Elated", "Elegant", "Embarrassed", "Enchanting", "Encouraging", "Energetic", "Enthusiastic", "Envious", "Evil", "Excited", "Expensive", "Exuberant", "Fair", "Faithful", "Famous", "Fancy", "Fantastic", "Fierce", "Filthy", "Fine", "Foolish", "Fragile", "Frail", "Frantic", "Friendly", "Frightened", "Funny", "Gentle", "Gifted", "Glamorous", "Gleaming", "Glorious", "Good", "Gorgeous", "Graceful", "Grieving", "Grotesque", "Grumpy", "Handsome", "Happy", "Healthy", "Helpful", "Helpless", "Hilarious", "Homeless", "Homely", "Horrible", "Hungry", "Hurt", "Ill", "Important", "Impossible", "Inexpensive", "Innocent", "Inquisitive", "Itchy", "Jealous", "Jittery", "Jolly", "Joyous", "Kind", "Lazy", "Light", "Lively", "Lonely", "Long", "Lovely", "Lucky", "Magnificent", "Misty", "Modern", "Motionless", "Muddy", "Mushy", "Mysterious", "Nasty", "Naughty", "Nervous", "Nice", "Nutty", "Obedient", "Obnoxious", "Odd", "Old-fashioned", "Open", "Outrageous", "Outstanding", "Panicky", "Perfect", "Plain", "Pleasant", "Poised", "Poor", "Powerful", "Precious", "Prickly", "Proud", "Putrid", "Puzzled", "Quaint", "Real", "Relieved", "Repulsive", "Rich", "Scary", "Selfish", "Shiny", "Shy", "Silly", "Sleepy", "Smiling", "Smoggy", "Sore", "Sparkling", "Splendid", "Spotless", "Stormy", "Strange", "Stupid", "Successful", "Super", "Talented", "Tame", "Tasty", "Tender", "Tense", "Terrible", "Thankful", "Thoughtful", "Thoughtless", "Tired", "Tough", "Troubled", "Ugliest", "Ugly", "Uninterested", "Unsightly", "Unusual", "Upset", "Uptight", "Vast", "Victorious", "Vivacious", "Wandering", "Weary", "Wicked", "Wide-eyed", "Wild", "Witty", "Worried", "Worrisome", "Wrong", "Zany", "Zealous"]
    const nounList = ["Adjustment", "Cat", "Door", "Elephant", "Fish", "Grass", "Iron", "Jumper", "Leg", "Money", "Night", "Oyster", "Paper", "Rain", "Wind", "Advertisement", "Bell", "Coat", "Duck", "Earring", "Game", "Kangaroo", "Laptop", "Morning", "Newspaper", "Party", "Ring", "Table", "Window", "Agreement", "Chair", "Day", "Floor", "Interest", "Koala", "Lamb", "Nail", "Painting", "Raincoat", "Tree", "Watch", "Air", "Back", "Corn", "Elbow", "Goat", "Horse", "Invention", "Jelly", "Knife", "Napkin", "Parrot", "Thing", "Wood", "Amount", "Bird", "Chicken", "Elevator", "Flower", "Gown", "Hamburger", "Idea", "Lung", "Mouse", "Pencil", "Rattle", "Snow", "Train", "Wallet", "Amusement", "Bread", "Cow", "Engine", "Garlic", "Journey", "Monkey", "Pen", "Rectangle", "Sun", "Tablecloth", "Animal", "Cake", "Finger", "Ginger", "Heart", "Jam", "Kite", "Luggage", "Mouth", "Notebook", "Piano", "Television", "Answer", "Birthday", "Eyeball", "Fox", "Giraffe", "Horn", "Jellybean", "Knowledge", "Lamp", "Mango", "Nose", "Pillow", "Rocket", "Song", "Thought", "Week", "Apparatus", "Chin", "Design", "Frog", "Gift", "Hat", "Mobile", "Pizza", "Roll", "Squirrel", "Toe", "Word", "Approval", "Bear", "Destruction", "Fan", "Kiss", "Music", "Sandwich", "Boat", "Detail", "Flag", "Guitar", "Hammer", "Knee", "Mirror", "Plastic", "Sand", "Backbone", "Canvas", "Fruit", "Helicopter", "Lizard", "Potato", "Screen", "Tractor", "Bag", "Cause", "Fork", "Lunch", "Sentence", "Beard", "Chalk", "Direction", "Film", "Glass", "Holiday", "Laugh", "Pajamas", "Shadow", "Beetroot", "Cloth", "Discovery", "Flame", "Honey", "Letter", "Shirt", "Body", "Color", "Discussion", "Flight", "Hour", "Lettuce", "Moonlight", "Shoe", "Book", "Committee", "Fold", "Life", "Medicine", "Phone", "Shoulder", "Bookcase", "Disgust", "Food", "Light", "Microscope", "Point", "Shovel", "Boot", "Camel", "Distance", "Force", "Skeleton", "Bottle", "Caravan",  "Form", "Lipstick", "Machine", "Bowl", "Chocolate", "Circle", "Slip", "Bus", "Class", "Dark", "Family", "Motorcycle", "Socks", "Clock", "Daytime", "March", "Soil", "Computer", "Desert", "Foot", "Star", "Doorway", "Fridge", "Minute", "Stomach", "Cupcake", "Dream", "Frown", "Movie", "Dress", "Custard", "Ocean", "Apple", "Queen", "Bed", "Restaurant", "Car", "School", "Dog", "Eye", "Santa", "Fire", "Farmer", "Waterfall", "Judge", "England", "Ice", "River", "Jacket", "Farm", "House", "Lemon", "Designer", "Garden", "Name", "Zoo", "Picture", "Hill", "Kitchen", "Island", "Show", "King", "Earth", "Time", "Doctor", "Home", "Umbrella", "Dentist", "Ground", "Voice", "Street", "Water", "Detective", "Kitchen", "Yard", "Garage", "Zebra", "Lawyer", "Hotel", "Nurse", "Library", "Planet", "Christmas", "Room", "Doll", "Customer", "Galaxy", "Egg", "Grandmother", "Hospital", "Insect", "Musician", "Forest", "Jewelry", "Land", "Keyboard", "Grandfather", "Lion", "Mall", "Milk", "Museum", "Nest", "People", "Park", "Oil", "Daisy", "Company", "Friend", "Market", "Question", "Pond", "Rabbit", "Magician", "Pool", "Bridge", "Top", "Robin", "Way"];
    return adjectiveList[Math.floor(Math.random() * adjectiveList.length)] + 
           nounList[Math.floor(Math.random() * nounList.length)] + 
           Math.floor(Math.random() * 9999);
}