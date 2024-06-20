const emojis = ['😀', '😂', '😍', '😎', '😜', '😡', '😱', '🥶'];
const boardSize = 5;
let board = [];
let score = 0;

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', shuffleBoard);

// Mostrar el tablero al principio
createBoard();

function createBoard() {
    board = [];
    score = 0;
    scoreDisplay.textContent = score;
    for (let i = 0; i < boardSize * boardSize; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        board.push(emoji);
    }
    drawBoard();
}

function drawBoard() {
    gameBoard.innerHTML = '';
    board.forEach((emoji, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = emoji;
        tile.dataset.index = index;
        setPosition(tile, index);
        tile.addEventListener('mousedown', handleMouseDown);
        tile.addEventListener('touchstart', handleTouchStart);
        gameBoard.appendChild(tile);
    });
}

function setPosition(tile, index) {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    tile.style.top = `${row * 65}px`;
    tile.style.left = `${col * 65}px`;
}

let firstTile = null;
let startX, startY;

function handleMouseDown(e) {
    firstTile = e.target;
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e) {
    e.preventDefault();
}

function handleMouseUp(e) {
    const endX = e.clientX;
    const endY = e.clientY;
    handleSwipe(endX - startX, endY - startY);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

function handleTouchStart(e) {
    firstTile = e.target;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    firstTile.addEventListener('touchmove', handleTouchMove);
    firstTile.addEventListener('touchend', handleTouchEnd);
}

function handleTouchMove(e) {
    e.preventDefault();
}

function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    handleSwipe(endX - startX, endY - startY);
    firstTile.removeEventListener('touchmove', handleTouchMove);
    firstTile.removeEventListener('touchend', handleTouchEnd);
}

function handleSwipe(deltaX, deltaY) {
    if (!firstTile) return;
    const firstIndex = parseInt(firstTile.dataset.index);
    let secondIndex = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30 && (firstIndex % boardSize) < boardSize - 1) {
            secondIndex = firstIndex + 1; // Swipe right
        } else if (deltaX < -30 && (firstIndex % boardSize) > 0) {
            secondIndex = firstIndex - 1; // Swipe left
        }
    } else {
        if (deltaY > 30 && firstIndex + boardSize < board.length) {
            secondIndex = firstIndex + boardSize; // Swipe down
        } else if (deltaY < -30 && firstIndex - boardSize >= 0) {
            secondIndex = firstIndex - boardSize; // Swipe up
        }
    }

    if (secondIndex !== null) {
        swapTiles(firstIndex, secondIndex);
        if (!checkMatches()) {
            setTimeout(() => {
                swapTiles(firstIndex, secondIndex); // Swap back if no match
            }, 200);
        } else {
            updateBoard();
        }
    }
    firstTile = null;
}

function swapTiles(index1, index2) {
    const temp = board[index1];
    board[index1] = board[index2];
    board[index2] = temp;
    const tile1 = document.querySelector(`.tile[data-index='${index1}']`);
    const tile2 = document.querySelector(`.tile[data-index='${index2}']`);
    setPosition(tile1, index2);
    setPosition(tile2, index1);
    tile1.dataset.index = index2;
    tile2.dataset.index = index1;
}

function checkMatches() {
    let matchFound = false;

    // Check horizontal matches
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize - 2; col++) {
            const index = row * boardSize + col;
            if (board[index] === board[index + 1] && board[index] === board[index + 2]) {
                removeTile(index);
                removeTile(index + 1);
                removeTile(index + 2);
                matchFound = true;
            }
        }
    }

    // Check vertical matches
    for (let col = 0; col < boardSize; col++) {
        for (let row = 0; row < boardSize - 2; row++) {
            const index = row * boardSize + col;
            if (board[index] === board[index + boardSize] && board[index] === board[index + 2 * boardSize]) {
                removeTile(index);
                removeTile(index + boardSize);
                removeTile(index + 2 * boardSize);
                matchFound = true;
            }
        }
    }

    return matchFound;
}

function removeTile(index) {
    board[index] = null;
    score += 10;
    scoreDisplay.textContent = score;
}

function updateBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        if (board[i] === null) {
            for (let j = i; j >= boardSize; j -= boardSize) {
                board[j] = board[j - boardSize];
                board[j - boardSize] = null;
            }
            board[i % boardSize] = emojis[Math.floor(Math.random() * emojis.length)];
        }
    }
    drawBoard();
    if (checkMatches()) {
        updateBoard();
    }
}

function shuffleBoard() {
    board = [];
    for (let i = 0; i < boardSize * boardSize; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        board.push(emoji);
    }
    drawBoard();
}
