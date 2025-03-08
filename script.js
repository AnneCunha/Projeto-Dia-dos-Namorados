const questions = [
    { question: "Qual meu filme favorito??", options: ["Narnia", "Howl Moving Castle"], answer: "Howl Moving Castle" },
    { question: "Qual meu cozy game favorito?", options: ["Sun Haven", "Animal Crossing"], answer: "Sun Haven" },
    { question: "Qual minha matéria preferida da faculdade?", options: ["Banco de Dados", "Nenhuma"], answer: "Nenhuma" },
    { question: "Sua namorada é desenvolvedora...", options: ["Backend", "Frontend"], answer: "Frontend" },
    { question: "Qual meu salgado favorito?", options: ["Coxinha", "Pastel"], answer: "Coxinha" }

];

let currentQuestionIndex = 0;

function startGame() {
    document.getElementById("click-sound").play();
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    loadQuestion();
}

function moveNoButton() {
    document.getElementById("click-sound").play(); // Toca o som de clique
    const noButton = document.getElementById("no-button");
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

function typeText(element, text, callback) {
    let index = 0;
    element.textContent = "";
    document.getElementById("typing-sound").play();
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
            document.getElementById("typing-sound").pause();
            document.getElementById("typing-sound").currentTime = 0;
            if (callback) callback();
        }
    }, 50);
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById("game").innerHTML = "<h1>Parabéns, meu amor! Você venceu! 🎉</h1><button onclick='goToMenu()'>Jogar Novamente</button>";
        return;
    }
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question-title").textContent = `Pergunta ${currentQuestionIndex + 1}`;
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    typeText(questionElement, questionData.question, () => {
        questionData.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => checkAnswer(option);
            button.onmouseover = () => document.getElementById("hover-sound").play();
            optionsContainer.appendChild(button);
        });
    });
}

function checkAnswer(answer) {
    document.getElementById("click-sound").play();
    if (answer === questions[currentQuestionIndex].answer) {
        document.getElementById("correct-sound").play();
        currentQuestionIndex++;
        loadQuestion();
    } else {
        document.getElementById("wrong-sound").play();
        setTimeout(() => {
            goToMenu();
        }, 1000); // Espera um pouco antes de voltar ao menu
    }
}


function goToMenu() {
    currentQuestionIndex = 0;
    document.getElementById("game").style.display = "none";
    document.getElementById("menu").style.display = "block";
}
