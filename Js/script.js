const items = document.querySelectorAll(".item");
const popup = document.querySelector(".popup");
const newGame = document.getElementById("new-game");
const mensaje = document.getElementById("mensaje");
const playerTurn = document.getElementById("player-turn");
const playerForm = document.getElementById("player-form");
const playerNameInput = document.getElementById("player-name");
const scoresList = document.getElementById("scores-list");

let xTurn = true;
let count = 0;
let startTime;

const loadScores = () => {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scoresList.innerHTML = scores.map(
        (score, index) => `<li>${index + 1}. ${score.name} - ${score.time} s - ${score.date}</li>`
    ).join("");
};

const saveScore = (name, time) => {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name, time, date: new Date().toLocaleString() });
    scores.sort((a, b) => a.time - b.time);
    const topScores = scores.slice(0, 10); 
    localStorage.setItem("scores", JSON.stringify(topScores));
    loadScores();
};

items.forEach((element) => {
    element.addEventListener("click", () => {
        if (element.innerText === "") {
            element.innerText = xTurn ? "X" : "O";
            playerTurn.innerText = xTurn ? "Turno de las O" : "Turno de las X";
            playerTurn.classList.toggle("x");
            playerTurn.classList.toggle("o");
            xTurn = !xTurn;
            count++;
            if (count === 9) drawMatch();
            checkwin();
        }
    });
});

const disabledButtons = () => {
    items.forEach(element => element.style.pointerEvents = "none");
    popup.classList.remove("hide");
};

const enableButtons = () => {
    items.forEach(element => {
        element.innerText = "";
        element.style.pointerEvents = "auto";
    });
    popup.classList.add("hide");
};

const winMatch = (player) => {
    disabledButtons();
    mensaje.innerText = player === "X" ? "Ganan las X" : "Ganan las O";
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    playerForm.classList.remove("hide");
    playerForm.onsubmit = (e) => {
        e.preventDefault();
        saveScore(playerNameInput.value, timeTaken);
        playerForm.classList.add("hide");
    };
};

const drawMatch = () => {
    disabledButtons();
    mensaje.innerText = "Empate";
};

newGame.addEventListener("click", () => {
    count = 0;
    enableButtons();
    xTurn = true;
    playerTurn.innerText = "Turno de las X";
    playerTurn.classList.replace("o", "x");
    startTime = Date.now();
});

const checkwin = () => {
    const winningPatterns = [
        [0, 1, 2],
        [0, 3, 6],
        [2, 5, 8],
        [6, 7, 8],
        [3, 4, 5],
        [1, 4, 7],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (items[a].innerText !== "" && items[a].innerText === items[b].innerText && items[a].innerText === items[c].innerText) {
            winMatch(items[a].innerText);
            return;
        }
    }
};

window.onload = () => {
    loadScores();
    startTime = Date.now();
};
