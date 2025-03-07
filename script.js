const questions = [
    { question: "Qual meu filme favorito?", options: ["Narnia", "Howl Moving Castle"], answer: "Howl Moving Castle" },
    { question: "Nos conhecemos na escola ou na internet?", options: ["Escola", "Internet"], answer: "Internet" },
    { question: "Minha cor favorita é azul ou vermelho?", options: ["Azul", "Vermelho"], answer: "Vermelho" }
];

let currentQuestionIndex = 0;

function startGame() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    loadQuestion();
}

function moveNoButton() {
    const noButton = document.getElementById("no-button");
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById("game").innerHTML = "<h1>Parabéns, meu amor! Você venceu! 🎉</h1><button onclick='restartGame()'>Jogar Novamente</button>";
        return;
    }
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(answer) {
    if (answer === questions[currentQuestionIndex].answer) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        document.getElementById("game").innerHTML = "<h1>Game Over 💔</h1><button onclick='restartGame()'>Tentar Novamente</button>";
    }
}

function restartGame() {
    currentQuestionIndex = 0;
    document.getElementById("game").innerHTML = '<p id="question"></p><div id="options"></div><p id="feedback"></p>';
    loadQuestion();
}