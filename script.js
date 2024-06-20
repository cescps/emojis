const emojis = ['😀', '😂', '😍', '😎', '😜', '😡', '😱', '🥶'];
const boardSize = 5;
let board = [];
let score = 0;

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');

function createBoard() {
    board = [];
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
function handleTileClick(e) {
    const clickedTile = e.target;
    const clickedIndex = parseInt(clickedTile.dataset.index);

    if (firstTile === null) {
        firstTile = clickedTile;
        firstTile.classList.add('selected');
    } else {
        const firstIndex = parseInt(firstTile.dataset.index);
        if (areAdjacent(firstIndex, clickedIndex)) {
            swapTiles(firstIndex, clickedIndex);
            if (checkMatches()) {
                firstTile.classList.remove('selected');
                firstTile = null;
                updateBoard();
            } else {
                setTimeout(() => {
                    swapTiles(firstIndex, clickedIndex); // swap back if no match
                    firstTile.classList.remove('selected');
                    firstTile = null;
                }, 200);
            }
        } else {
            firstTile.classList.remove('selected');
            firstTile = clickedTile;
            firstTile.classList.add('selected');
        }
    }
}

function areAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / boardSize);
    const col1 = index1 % boardSize;
    const row2 = Math.floor(index2 / boardSize);
    const col2 = index2 % boardSize;

    return (row1 === row2 && Math.abs(col1 - col2) === 1) ||
           (col1 === col2 && Math.abs(row1 - row2) === 1);
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
            }
            board[i % boardSize] = emojis[Math.floor(Math.random() * emojis.length)];
        }
    }
    drawBoard();
    if (checkMatches()) {
        updateBoard();
    }
}

// Handle mouse events for desktop
function handleMouseDown(e) {
    const tile = e.target;
    tile.addEventListener('mouseup', handleMouseUp);
    tile.addEventListener('mousemove', handleMouseMove);
}

function handleMouseUp(e) {
    const tile = e.target;
    tile.removeEventListener('mouseup', handleMouseUp);
    tile.removeEventListener('mousemove', handleMouseMove);
    handleTileClick(e);
}

function handleMouseMove(e) {
    // Prevent default to avoid text selection
    e.preventDefault();
}

// Handle touch events for mobile
function handleTouchStart(e) {
    const tile = e.target;
    tile.addEventListener('touchend', handleTouchEnd);
    tile.addEventListener('touchmove', handleTouchMove);
}

function handleTouchEnd(e) {
    const tile = e.target;
    tile.removeEventListener('touchend', handleTouchEnd);
    tile.removeEventListener('touchmove', handleTouchMove);
    handleTileClick(e);
}

function handleTouchMove(e) {
    // Prevent default to avoid screen scrolling
    e.preventDefault();
}

createBoard();
