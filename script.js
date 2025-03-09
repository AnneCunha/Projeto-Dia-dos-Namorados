const questions = [
    { question: "Qual meu filme favorito??", options: ["Narnia", "Howl Moving Castle"], answer: "Howl Moving Castle" },
    { question: "Qual meu cozy game favorito?", options: ["Sun Haven", "Animal Crossing"], answer: "Sun Haven" },
    { question: "Qual minha matéria preferida da faculdade?", options: ["Banco de Dados", "Nenhuma"], answer: "Nenhuma" },
    { question: "Sua namorada é desenvolvedora...", options: ["Backend", "Frontend"], answer: "Frontend" },
    { question: "Qual meu salgado favorito?", options: ["Coxinha", "Pastel"], answer: "Coxinha" },
    { question: "Qual meu número para calçados?", options: ["36", "37"], answer: "36" },
    { question: "Qual é a minha peça de roupa favorita?", options: ["Shorts", "Vestidos"], answer: "Vestidos" },
    { question: "Qual é a minha linguagem do amor?", options: ["Palavras de afirmação", "Toque físico"], answer: "Palavras de afirmação" },
    { question: "A Anne tem medo de...", options: ["Tubarão", "Mar"], answer: "Tubarão" },
    { question: "Qual meu sabor de sorvete favorito?", options: ["Pistache", "Coco"], answer: "Coco" }

];

let currentQuestionIndex = 0;
let lives = 4;


function startGame() {
    document.getElementById("click-sound").play();
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    lives = 4; // Reinicia as vidas
    updateLives(); // Atualiza os corações
    loadQuestion();

    function startGame() {
        document.getElementById("click-sound").play();
        document.getElementById("menu").style.display = "none";
        document.getElementById("game").style.display = "block";
        lives = 4;
        updateLives();
        loadQuestion();
        applyHoverSound(); // Aplica o som de hover nos botões do jogo
    }
    
}

function moveNoButton() {
    const noButton = document.getElementById("no-button");
    if (!noButton) return;

    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);

    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}


function updateLives() {
    const livesContainer = document.getElementById("lives-container");
    livesContainer.innerHTML = ""; // Limpa o container antes de adicionar as vidas

    for (let i = 0; i < lives; i++) {
        const img = document.createElement("img");
        img.src = "/img/HeartLife.gif"; // Caminho para o gif na pasta img
        img.alt = "Vida"; // Texto alternativo
        img.classList.add("life-icon"); // Classe CSS para estilizar
        livesContainer.appendChild(img);
    }
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
            button.onmouseover = () => {
                const hoverSound = document.getElementById("hover-sound");
                hoverSound.pause();  // Para o som caso já esteja tocando
                hoverSound.currentTime = 0;  // Reseta para o início
                hoverSound.play();  // Toca o som novamente
            };
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
        lives--;
        updateLives();
        if (lives === 0) {
            document.getElementById("game-over-sound").play(); // 🔊 Toca o som do Game Over
            setTimeout(() => {
                document.getElementById("game").innerHTML = "<h1>Game Over 💔</h1><img src='/img/YouLose.gif' class='game-over-img'><button onclick='goToMenu()'>Voltar ao Menu</button>";
            }, 1000);
        }
        
    }
}

function goToMenu() {
    currentQuestionIndex = 0;  // Reinicia o índice das perguntas
    lives = 4;  // Reinicia as vidas
    document.getElementById("game").style.display = "none";
    document.getElementById("menu").style.display = "block";

    // Resetar o conteúdo do jogo para evitar travamentos
    document.getElementById("game").innerHTML = `
        <div id="lives-container">❤️❤️❤️❤️</div>
        <h2 id="question-title"></h2>
        <p id="question"></p>
        <div id="options"></div>
        <p id="feedback"></p>
    `;
}

function applyHoverSound() {
    const buttons = document.querySelectorAll("button"); // Seleciona todos os botões
    buttons.forEach(button => {
        button.onmouseover = () => {
            const hoverSound = document.getElementById("hover-sound");
            hoverSound.pause(); // Para o som caso já esteja tocando
            hoverSound.currentTime = 0; // Reseta para o início
            hoverSound.play(); // Toca o som novamente
        };
    });
}

document.addEventListener("DOMContentLoaded", applyHoverSound);



