const startScreen = document.querySelector('.start-screen');
const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const newGameCpuButton = document.querySelector('.new-game-cpu');
const newGamePlayerButton = document.querySelector('.new-game-player');
const markXButton = document.querySelector('.mark-x');
const markOButton = document.querySelector('.mark-o');
const restartButton = document.querySelector('.restart-button');
const restartModal = document.querySelector('.restart-modal');
const cancelRestartButton = document.querySelector('.cancel-restart');
const confirmRestartButton = document.querySelector('.confirm-restart');
const winnerModal = document.querySelector('.winner-modal');
const quitGameButton = document.querySelector('.quit-game');
const nextRoundButton = document.querySelector('.next-round');
const turnIndicator = document.querySelector('.turn-indicator .turn-mark');
const scoreX = document.querySelector('.score-x .score');
const scoreTies = document.querySelector('.score-ties .score');
const scoreO = document.querySelector('.score-o .score');
const winnerMarkDisplay = document.querySelector('.winner-modal .winner-mark');
const winnerTextDisplay = document.querySelector('.winner-modal .winner-text');

let currentPlayer = 'x';
let playerMark = 'x';
let cpuMark = 'o';
let gameMode = null; // 'cpu' or 'player'
let gameActive = false;
let boardState = ['', '', '', '', '', '', '', '', ''];
let scores = {
    x: 0,
    o: 0,
    ties: 0
};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// --- Start Screen Logic ---
markXButton.addEventListener('click', () => {
    playerMark = 'x';
    cpuMark = 'o';
    markXButton.classList.add('selected');
    markOButton.classList.remove('selected');
});

markOButton.addEventListener('click', () => {
    playerMark = 'o';
    cpuMark = 'x';
    markOButton.classList.add('selected');
    markXButton.classList.remove('selected');
});

newGameCpuButton.addEventListener('click', () => {
    gameMode = 'cpu';
    startGame();
});

newGamePlayerButton.addEventListener('click', () => {
    gameMode = 'player';
    startGame();
});

function startGame() {
    startScreen.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    currentPlayer = 'x'; // X always starts
    updateTurnIndicator();
    if (gameMode === 'cpu' && playerMark === 'o') {
        makeCpuMove();
    }
}

// --- Game Board Logic ---
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.dataset.index);

    if (!gameActive || boardState[cellIndex] !== '') {
        return;
    }

    placeMark(cell, cellIndex, currentPlayer);
    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        switchPlayer();
        if (gameMode === 'cpu' && currentPlayer === cpuMark) {
            makeCpuMove();
        }
    }
}

function placeMark(cell, index, player) {
    boardState[index] = player;
    cell.textContent = player.toUpperCase();
    cell.classList.add(player);
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updateTurnIndicator();
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return boardState[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return boardState.every(cell => cell !== '');
}

function endGame(isDraw) {
    gameActive = false;
    if (isDraw) {
        scores.ties++;
        updateScores();
        showWinnerModal(null); // No winner for a draw
    } else {
        scores[currentPlayer]++;
        updateScores();
        showWinnerModal(currentPlayer);
    }
}

function updateTurnIndicator() {
    turnIndicator.textContent = currentPlayer.toUpperCase();
}

function updateScores() {
    scoreX.textContent = scores.x;
    scoreTies.textContent = scores.ties;
    scoreO.textContent = scores.o;
}

// --- CPU Logic (Basic Random Move) ---
function makeCpuMove() {
    if (!gameActive) return;

    const availableMoves = boardState.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const moveIndex = availableMoves[randomIndex];
        const cell = document.querySelector(`.cell[data-index="${moveIndex}"]`);

        // Simulate a slight delay for the CPU move
        setTimeout(() => {
            placeMark(cell, moveIndex, cpuMark);
            if (checkWin()) {
                endGame(false);
            } else if (checkDraw()) {
                endGame(true);
            } else {
                switchPlayer();
            }
        }, 500); // Adjust delay as needed
    }
}

// --- Restart Game Logic ---
restartButton.addEventListener('click', () => {
    restartModal.classList.remove('hidden');
});

cancelRestartButton.addEventListener('click', () => {
    restartModal.classList.add('hidden');
});

confirmRestartButton.addEventListener('click', () => {
    restartModal.classList.add('hidden');
    startGame();
});

// --- Winner Modal Logic ---
function showWinnerModal(winner) {
    if (winner) {
        winnerMarkDisplay.textContent = winner.toUpperCase();
        winnerMarkDisplay.classList.add(winner);
        winnerTextDisplay.textContent = 'TAKES THE ROUND';
    } else {
        winnerMarkDisplay.textContent = '';
        winnerTextDisplay.textContent = 'IT\'S A DRAW';
    }
    winnerModal.classList.remove('hidden');
}

quitGameButton.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    gameBoard.classList.add('hidden');
    startScreen.classList.remove('hidden');
    resetGame();
});

nextRoundButton.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    startGame();
});

function resetGame() {
    gameActive = false;
    gameMode = null;
    boardState = ['', '', '', '', '', '', '', '', ''];
}

// --- Bonus 1: Save Game State (Conceptual) ---
// localStorage.setItem('gameState', JSON.stringify({ boardState, scores, currentPlayer, gameMode }));
// const savedState = JSON.parse(localStorage.getItem('gameState'));

// --- Bonus 2: Improved CPU Logic (Conceptual - Minimax or similar) ---
// Function for a more strategic CPU move implementation