let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let player = "X";
let gameOver = false;

const boardDiv = document.getElementById("board");
const result = document.getElementById("result");
const turn = document.getElementById("turn");

function draw() {

    boardDiv.innerHTML = "";

    board.forEach((value, index) => {

        let cell = document.createElement("button");

        cell.className = "cell";

        cell.innerHTML = value;

        cell.onclick = function () {

            // Stop if game is over or cell is already filled
            if (gameOver || board[index] !== "") {
                return;
            }

            board[index] = player;

            draw();

            checkWinner();

            if (!gameOver) {
                player = player === "X" ? "O" : "X";
                turn.innerHTML = `Player ${player}'s Turn`;
            }

        };

        boardDiv.appendChild(cell);

    });

}

function checkWinner() {

    fetch("http://65.2.33.80:5000/move", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            board: board
        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.winner) {

            gameOver = true;

            if (data.winner === "Draw") {

                result.innerHTML = "?? It's a Draw!";

            } else {

                result.innerHTML = `?? Winner: ${data.winner}`;

            }

            turn.innerHTML = "Game Over";

        }

    });

}

function restart() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    player = "X";

    gameOver = false;

    result.innerHTML = "";

    turn.innerHTML = "Player X's Turn";

    draw();

}

draw();
