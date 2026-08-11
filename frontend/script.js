
    

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

        cell.onclick = async function () {

            if (gameOver || board[index] !== "") {
                return;
            }

            board[index] = player;

            draw();

            const winner = await checkWinner();

            if (winner) {

                gameOver = true;

                if (winner === "Draw") {
                    result.innerHTML = "It's a Draw!";
                } else {
                    result.innerHTML = `Winner: ${winner}`;
                }

                turn.innerHTML = "Game Over";

                return;
            }

            player = player === "X" ? "O" : "X";

            turn.innerHTML = `Player ${player}'s Turn`;
        };

        boardDiv.appendChild(cell);
    });
}

async function checkWinner() {

    try {

        const response = await fetch("/api/move", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                board: board
            })
        });

        const data = await response.json();

        return data.winner;

    } catch (error) {

        console.error("API Error:", error);

        return null;
    }
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
