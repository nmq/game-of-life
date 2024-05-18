function getGridSize() {
    let isValidChoice = false;
    while (!isValidChoice) {
        gridSize = +(prompt("Enter grid size:"));
        if (Number.isInteger(gridSize) && gridSize > 0 && gridSize < 101) {
            isValidChoice = true;
        } else {
            alert("Enter a valid grid size (integer between 1 and 100).");
        };
    }
    makeGrid(gridSize);
    return;
}

function makeGrid(size) {
    while (container.firstChild) container.removeChild(container.firstChild);
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = 0;
        }
    }
    moves.textContent = "Moves: 0";
    counter = 0;
    clearInterval(game);
    for (let i = 0; i < size; i++) {
        const row = document.createElement("div");
        for (let j = 0; j < size; j++) {
            const square = document.createElement("div");
            square.id = `${i}-${j}`;
            square.setAttribute("style", `background-color: ${deadColor};
                opacity: 1;
                border: 1px solid grey;
                width: ${containerWidth/size}px;
                height: ${containerHeight/size}px;`);
            square.addEventListener("mousedown", () => {
                const coordinates = square.id.split('-');
                const squareRow = coordinates[0];
                const squareCol = coordinates[1];
                if (square.style.backgroundColor === aliveColor) {
                    square.style.backgroundColor = deadColor;
                    board[squareRow][squareCol] = 0;
                }
                else {
                    square.style.backgroundColor = aliveColor;
                    board[squareRow][squareCol] = 1;
                }
            });
            row.appendChild(square);
        }
        container.appendChild(row);
    }
}

function clearGrid() {
    makeGrid(gridSize);
}

function gameOfLife() {
    /*  0: dead -> dead
        1: live -> live
        2: dead -> live
        3: live -> dead
    */
    function getNeighbors(row, col) {
        let neighbors = 0;
        for (let i = row-1; i < row+2; i++) {
            if (i < 0) continue;
            if (i >= gridSize) break;
            for (let j = col-1; j < col+2; j++) {
                if (j < 0 || (i === row && j === col)) continue;
                if (j >= gridSize) break;
                if (board[i][j] === 1 || board[i][j] === 3) neighbors++;
            }
        }
        return neighbors;
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let neighbors = getNeighbors(i, j);
            if (board[i][j] === 0) {
                if (neighbors === 3) board[i][j] = 2;
            }
            else {
                if (neighbors !== 2 && neighbors !== 3) board[i][j] = 3;
            }
        }
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 2) {
                board[i][j] = 1;
                document.getElementById(`${i}-${j}`).style.backgroundColor = aliveColor;
            }
            else if (board[i][j] === 3) {
                board[i][j] = 0
                document.getElementById(`${i}-${j}`).style.backgroundColor = deadColor;
            }
        }
    }

    counter++;
    moves.textContent = `Moves: ${counter}`;
}

const deadColor = `rgb(255, 255, 255)`;
const aliveColor = `rgb(255, 0, 127)`;

let gridSize = 32;
let board = [];
let counter = 0;
let game;

const container = document.querySelector("#container");
const buttons = document.querySelectorAll("button");
const setGridSize = document.querySelector("#setGridSize");
const startGame = document.querySelector("#start");
const stopGame = document.querySelector("#stop");
const clear = document.querySelector("#clear");
const moves = document.querySelector("#moves");

setGridSize.addEventListener("click", getGridSize);
startGame.addEventListener("click", () => {
    game = setInterval(gameOfLife, 200);
});
stopGame.addEventListener("click", () => {
    clearInterval(game);
});
clear.addEventListener("click", clearGrid);

const containerWidth = +(getComputedStyle(container).width.slice(0,-2));
const containerHeight = +(getComputedStyle(container).height.slice(0,-2));

makeGrid(gridSize);