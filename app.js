let cards = [];
let currentNumber = 1;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameActive = false;
let isProcessing = false;

function initGame() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    cards = numbers.sort(() => Math.random() - 0.5);
    
    currentNumber = 1;
    moves = 0;
    timer = 0;
    gameActive = false;
    isProcessing = false;

    if (timerInterval) clearInterval(timerInterval);
    updateDisplay();
    renderCards();
    closeModal();
}

function renderCards() {
    const grid = document.getElementById('cardsGrid');
    grid.innerHTML = '';
    
    cards.forEach((number, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';
        wrapper.style.animationDelay = `${index * 0.1}s`;
        
        wrapper.innerHTML = `
            <div class="card-inner">
                <div class="card-back">♠</div>
                <div class="card-front">${number}</div>
            </div>
        `;
        
        wrapper.onclick = () => handleFlip(wrapper, number);
        grid.appendChild(wrapper);
        
        setTimeout(() => wrapper.classList.add('dealing'), 50);
    });
}

function handleFlip(cardElement, number) {
    if (isProcessing) return;
    if (cardElement.classList.contains('found') || cardElement.classList.contains('flipped')) return;

    if (!gameActive) {
        gameActive = true;
        startTimer();
    }

    moves++;
    cardElement.classList.add('flipped');

    if (number === currentNumber) {
        cardElement.classList.add('found');
        currentNumber++;
        updateDisplay();

        if (currentNumber > 9) {
            setTimeout(gameWon, 600);
        }
    } else {
        isProcessing = true;
        cardElement.classList.add('wrong');
        
        document.getElementById('message').textContent = "Wrong sequence!";

        setTimeout(() => {
            document.getElementById('message').textContent = "";
            resetBoard();
            isProcessing = false;
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateDisplay();
    }, 1000);
}

function updateDisplay() {
    document.getElementById('moves').textContent = moves;
    const mins = Math.floor(timer / 60).toString().padStart(2, '0');
    const secs = (timer % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${mins}:${secs}`;
    document.getElementById('nextNumber').textContent = currentNumber <= 9 ? currentNumber : "✔";
}

function resetBoard() {
    currentNumber = 1;
    document.querySelectorAll('.card-wrapper').forEach(c => {
        c.classList.remove('flipped', 'found', 'wrong');
    });
    updateDisplay();
}

function newGame() {
    initGame();
}

function gameWon() {
    clearInterval(timerInterval);
    document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('winModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('winModal').style.display = 'none';
}

initGame();