const armenianAlphabet = [
   'Ա', 'Բ', 'Գ', 'Դ', 'Ե', 'Զ', 'Է', 'Ը', 'Թ', 'Ժ', 'Ի', 'Լ', 'Խ', 'Ծ', 'Կ', 'Հ', 'Ձ', 'Ղ', 'Ճ', 'Մ', 'Յ', 'Ն', 'Շ', 'Ո', 'Չ', 'Պ', 'Ջ', 'Ռ', 'Ս', 'Վ', 'Տ', 'Ր', 'Ց', 'ւ', 'Փ', 'Ք', 'և', 'Օ', 'Ֆ'
];

const vowels = new Set(['Ա', 'Ե', 'Է', 'Ը', 'Ի', 'Ո', 'Օ', 'և', 'ւ']); // Set of Armenian vowels

const phoneticKeyboardMap = {
 //'Ա': 'A',   'Բ': 'B',   'Գ': 'G',   'Դ': 'D',   'Ե': 'E',   'Զ': 'Z',   'Է': '1',   'Ը': 'Y',   'Թ': '2',   'Ժ': '=',   'Ի': 'I',   'Լ': 'L',   'Խ': '{',   'Ծ': '}',   'Կ': 'K',   'Հ': 'H',   'Ձ': '4',   'Ղ': 'X',   'Ճ': '0',   'Մ': 'M',   'Յ': 'J',   'Ն': 'N',   'Շ': '\\',   'Ո': 'w',   'Չ': '9',   'Պ': 'P',   'Ջ': '5',   'Ռ': 'R',   'Ս': 'S',   'Վ': 'V',   'Տ': 'T',   'Ր': '8',   'Ց': 'C',   'Փ': '3',   'Ք': 'q',   'Օ': 'O',   'Ֆ': 'F',   'և': '7',   'ւ': 'U' };
 'Ա': '',   'Բ': '',   'Գ': '',   'Դ': '',   'Ե': '',   'Զ': '',   'Է': '1',   'Ը': 'Y',   'Թ': '2',   'Ժ': '=',   'Ի': '',   'Լ': '',   'Խ': '{',   'Ծ': '}',   'Կ': '',   'Հ': '',   'Ձ': '4',   'Ղ': 'X',   'Ճ': '',   'Մ': '',   'Յ': '',   'Ն': '',   'Շ': '\\',   'Ո': 'w',   'Չ': '9',   'Պ': '',   'Ջ': '5',   'Ռ': '',   'Ս': '',   'Վ': '',   'Տ': '',   'Ր': '8',   'Ց': '',   'Փ': '3',   'Ք': '',   'Օ': '',   'Ֆ': '',   'և': '7',   'ւ': 'U' };

const gameContainer = document.getElementById('game');
const messageDiv = document.getElementById('message');
const speedDisplay = document.getElementById('speedDisplay');
let currentLetter = null;
let letterElement = null;
let gameInterval = null;
let isPaused = false;
let userName = '';
let speedMultiplier = 1; // Multiplier to adjust speed based on performance
let hitCount = 0; // Number of consecutive hits without mistakes

function getUserName() {
    userName = prompt('Մուտքագրե՛ք Ձեր անունը:');
    if (!userName) {
        userName = 'Հարգելի օգտագործող';
    }
}

function getRandomArmenianLetter() {
    return armenianAlphabet[Math.floor(Math.random() * armenianAlphabet.length)];
}

function createLetterElement(letter) {
    const element = document.createElement('div');
    element.classList.add('letter');
    const phoneticSymbol = phoneticKeyboardMap[letter] || '';
    element.textContent = `${letter} ${letter.toLowerCase()} - ${phoneticSymbol}`;
    element.classList.add(vowels.has(letter) ? 'vowel' : 'consonant');
    element.style.left = `${Math.random() * 230}px`; // Random horizontal position within game container
    return element;
}

function startGame() {
    currentLetter = getRandomArmenianLetter();
    letterElement = createLetterElement(currentLetter);
    gameContainer.appendChild(letterElement);

    let position = 0;
    gameInterval = setInterval(() => {
        if (!isPaused) {
            position += 2 * speedMultiplier; // Increase speed based on performance
            letterElement.style.top = `${position}px`;

            if (position > 500) { // Letter reached the bottom
                clearInterval(gameInterval);
                alert(`${userName}, խաղն ավարտվեց։`);
                resetGame();
            }
        }
    }, 50);

    // Update speed display
    updateSpeedDisplay();
}

function updateSpeedDisplay() {
    speedDisplay.textContent = `Շարահյուսական արագություն: ${speedMultiplier}x`;
}

function resetGame() {
    if (letterElement) {
        gameContainer.removeChild(letterElement);
    }
    currentLetter = null;
    letterElement = null;
    gameInterval = null;
    updateSpeedDisplay(); // Update speed display
    startGame();
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        showMessage('Ընդմիջում');
    } else {
        hideMessage();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        togglePause();
        return;
    }

    if (isPaused) return;

    hideMessage();

    if (currentLetter && event.key.toUpperCase() === currentLetter.toUpperCase())
    {
        clearInterval(gameInterval);
        resetGame();
        hitCount++; // Increment hit count on correct input
        if (hitCount % 5 === 0) { // Increase speed every 5 consecutive hits
            speedMultiplier += 0.5;
            updateSpeedDisplay(); // Update speed display
        }
    }
    else
    {
        showMessage(`${userName}, Դուք մուտքագրել եք սխալ տառ։ Փորձե՛ք նորից։`);
        hitCount = 0; // Reset hit count on mistake
        speedMultiplier = Math.max(0.5, speedMultiplier - 0.5); // Decrease speed on mistake 
        updateSpeedDisplay(); // Update speed display
    }

});

function showMessage(message) {
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
}

function hideMessage() {
    messageDiv.style.display = 'none';
}

getUserName(); // Prompt for user name when the game starts
startGame();
