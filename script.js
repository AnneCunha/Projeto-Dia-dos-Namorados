const questions = [
    { question: "Qual meu filme favorito?", options: ["Narnia", "Howl Moving Castle"], answer: "Howl Moving Castle" },
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

function moveNoButton() {
    const button = document.getElementById("no-button");
    const maxX = window.innerWidth - button.clientWidth;
    const maxY = window.innerHeight - button.clientHeight;

    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);

    button.style.position = "absolute";
    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;
}

function playHoverSound() {
    const hoverSound = document.getElementById("hover-sound");
    hoverSound.pause();
    hoverSound.currentTime = 0;
    hoverSound.play();
}


let currentQuestionIndex = 0;
let lives = 4;
let bonusLifeEarned = false;
let incorrectLetters = [];
let remainingLives;

function startGame() {
    document.getElementById("click-sound").play();
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    lives = 4;
    bonusLifeEarned = false;
    updateLives();
    loadQuestion();
}

function loadQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question-title").textContent = `Pergunta ${currentQuestionIndex + 1}`;
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    typeQuestion(questionData.question);
    
    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        button.onmouseover = () => {
            const hoverSound = document.getElementById("hover-sound");
            hoverSound.pause();
            hoverSound.currentTime = 0;
            hoverSound.play();
        };
        optionsContainer.appendChild(button);
    });
}

function typeQuestion(text, index = 0) {
    const questionElement = document.getElementById("question");
    const typingSound = document.getElementById("typing-sound");

    if (index === 0) {
        questionElement.textContent = ""; // Limpa o texto antes de começar
        typingSound.play(); // Começa o som de digitação
    }

    if (index < text.length) {
        questionElement.textContent += text[index];
        setTimeout(() => typeQuestion(text, index + 1), 50); // Ajuste a velocidade se necessário
    } else {
        typingSound.pause(); // Para o som quando a digitação acabar
        typingSound.currentTime = 0; // Reseta o áudio para o início
    }
}



function updateLives() {
    const livesContainer = document.getElementById("lives-container");
    livesContainer.innerHTML = "";
    for (let i = 0; i < lives; i++) {
        const img = document.createElement("img");
        img.src = "img/HeartLife.gif";
        img.alt = "Vida";
        img.classList.add("life-icon");
        livesContainer.appendChild(img);
    }
}

function checkAnswer(answer) {
    document.getElementById("click-sound").play();
    if (answer === questions[currentQuestionIndex].answer) {
        document.getElementById("correct-sound").play();
        currentQuestionIndex++;
        if (currentQuestionIndex >= questions.length) {
            showPhaseCompletion();
        } else {
            loadQuestion();
        }
    } else {
        document.getElementById("wrong-sound").play();
        lives--;
        updateLives();
        if (lives === 0) {
            document.getElementById("game-over-sound").play();
            setTimeout(() => {
                document.getElementById("game").innerHTML = `
                    <h1>Game Over 💔</h1>
                    <img src='/img/YouLose.gif' class='game-over-img'>
                    <button onclick='goToMenu()'>Voltar ao Menu</button>
                `;
            }, 1000);            
        }
    }
}

function showPhaseCompletion() {
    if (!bonusLifeEarned && lives < 4) {
        lives++;
        bonusLifeEarned = true;
    }
    remainingLives = lives;
    document.getElementById("game").innerHTML = `
        <div class="phase-completion">
            <h1>Parabéns! 🎉 Você completou a primeira fase!</h1>
            <img src="img/EstrelaPixel.gif" class="phase-gif">
            <p>Você ganhou uma vida bônus para a próxima fase!</p>
            <button onclick="startHangman()">Prosseguir</button>
        </div>
    `;
}





// Segunda fase do jogo
function startHangman() {
    document.getElementById("game").innerHTML = `
        <div id="hangman-container">
            <h1>Jogo da Forca</h1>
            <img src="img/TotoroPixel.gif" class="hangman-gif" style="width: 150px;"> <!-- Reduzi a imagem -->
            <div id="lives-container"></div> <!-- Onde exibir as vidas -->
            <p id="word-display"></p>
            <div id="letter-buttons"></div>
            <p id="incorrect-letters">Letras erradas: </p>
            <p id="hangman-feedback"></p>
            <button id="finish-game-button" onclick="showFinalCompletion()" style="display: none;">Finalizar Fase</button>
        </div>
    `;
    initializeHangman();
}


function initializeHangman() {
    const phrase = "KAKTUS";
    let displayedWord = phrase.replace(/[A-ZÀ-Ú]/g, "_");
    document.getElementById("word-display").textContent = displayedWord;
    incorrectLetters = [];
    
    updateLivesDisplay(); // Exibir vidas iniciais

    const letterButtons = document.getElementById("letter-buttons");
    letterButtons.innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÃÕÊÇ".split("").map(letter => {
        return `<button onclick="guessLetter('${letter}')" id="letter-${letter}">${letter}</button>`;
    }).join(" ");
}


function guessLetter(letter) {
    const phrase = "KAKTUS";
    let displayedWord = document.getElementById("word-display").textContent;
    let updatedWord = "";
    let found = false;

    // Tocar som de clique ao apertar uma letra
    document.getElementById("click-sound").play();

    for (let i = 0; i < phrase.length; i++) {
        if (phrase[i] === letter) {
            updatedWord += letter;
            found = true;
        } else {
            updatedWord += displayedWord[i];
        }
    }

    document.getElementById("word-display").textContent = updatedWord;
    document.getElementById(`letter-${letter}`).disabled = true;

    if (!found) {
        incorrectLetters.push(letter);
        document.getElementById("incorrect-letters").textContent = `Letras erradas: ${incorrectLetters.join(", ")}`;
        
        lives--; // Perde uma vida
        updateLivesDisplay();

        if (lives === 0) {
            document.getElementById("game-over-sound").play(); // Toca som de Game Over
            showGameOver();
            return;
        }
    }

    if (!updatedWord.includes("_")) {
        document.getElementById("finish-game-button").style.display = "block";
    }
}



function showFinalCompletion() {
    lives++; // Ganha mais uma vida para a próxima fase
    document.getElementById("game").innerHTML = `
        <div class="phase-completion">
            <h1>Parabéns! 🎉 Você completou a segunda fase!</h1>
            <img src="img/EstrelaPixel.gif" class="phase-gif">
            <p>Você ganhou mais uma vida!</p>
            <button onclick="startNextPhase()">Continuar</button>
        </div>
    `;
}


// Função para iniciar a próxima fase
function startNextPhase() {
    showPhaseThreeIntro();
}

// Função para voltar ao menu
function goToMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("game").innerHTML = ""; // Limpa o jogo para reiniciar

    // Resetar variáveis da fase 1
    currentQuestionIndex = 0;
    lives = 4;
    bonusLifeEarned = false;

    // Resetar variáveis da fase 2
    incorrectLetters = [];
    remainingLives = 0;

    // Resetar interface do jogo
    document.getElementById("game").innerHTML = `
        <div id="question-container">
            <h2 id="question-title"></h2>
            <p id="question"></p>
            <div id="options"></div>
            <div id="lives-container"></div>
        </div>
    `;
}

// contador de vidas
function updateLivesDisplay() {
    const livesContainer = document.getElementById("lives-container");
    livesContainer.innerHTML = "";
    for (let i = 0; i < lives; i++) {
        const img = document.createElement("img");
        img.src = "img/HeartLife.gif"; // Mantém o mesmo coração da fase 1
        img.alt = "Vida";
        img.classList.add("life-icon");
        livesContainer.appendChild(img);
    }
}


// Função para exibir a tela de Game Over
function showGameOver() {
    document.getElementById("game").innerHTML = `
        <h1>Game Over 💔</h1>
        <img src='/img/YouLose.gif' class='game-over-img'>
        <button onclick='goToMenu()'>Voltar ao Menu</button>
    `;
}





//terceira fase do jogo

function showPhaseThreeIntro() {
    document.getElementById("game").innerHTML = `
        <div class="phase-intro">
            <h1>Atenção! ⚠️</h1>
            <p>Na próxima fase, você terá um tempo limitado para responder! Cada vida disponível equivale a 30 segundos para tentar acertar.</p>
            <button onclick="startPhaseThree()">Estou pronto</button>
        </div>
    `;
}

function startPhaseThree() {
    document.getElementById("game").innerHTML = `
        <div id="phase-three-container">
            <h1>Complete a Frase</h1>
            <p id="hidden-phrase" style="display: none;"><strong>Minha namorada é...</strong></p>
            <input type="text" id="answer-input" placeholder="Digite a resposta">
            <button onclick="checkPhaseThreeAnswer()">Responder</button>
            <p id="timer">Tempo restante: <span id="time-left"></span> segundos</p>
            <div id="lives-container"></div>
            <button id="finish-game-button" onclick="showFinalCompletion()" style="display: none;">Finalizar Jogo</button>
        </div>
    `;

    // Mostrar a frase somente após iniciar o jogo
    setTimeout(() => {
        document.getElementById("hidden-phrase").style.display = "block";
    }, 500);

    startPhaseThreeTimer();
    updateLivesDisplay();
    stylePhaseThreeElements();
}

let phaseThreeTime;
let timerInterval;

function startPhaseThreeTimer() {
    phaseThreeTime = 30; // Cada rodada começa com 30 segundos
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (phaseThreeTime > 0) {
            phaseThreeTime--;
            updateTimerDisplay();
        } else {
            // Perde uma vida e reinicia o tempo
            lives--;
            updateLivesDisplay();

            if (lives > 0) {
                phaseThreeTime = 30; // Reinicia o contador
            } else {
                clearInterval(timerInterval);
                document.getElementById("game-over-sound").play();
                showGameOver();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("time-left");
    timerElement.textContent = phaseThreeTime;

    if (phaseThreeTime <= 10) {
        timerElement.style.color = "yellow";
    }
    if (phaseThreeTime <= 5) {
        timerElement.style.color = "red";
        timerElement.style.animation = "pulse 1s infinite";
    }
}

function checkPhaseThreeAnswer() {
    const answer = document.getElementById("answer-input").value.trim().toLowerCase();
    if (answer === "perfeita") {
        document.getElementById("correct-sound").play();
        document.getElementById("finish-game-button").style.display = "block";
        clearInterval(timerInterval); // Para o timer ao acertar
    } else {
        document.getElementById("wrong-sound").play();
    }
}

// Estilizar o input e o timer
function stylePhaseThreeElements() {
    const input = document.getElementById("answer-input");
    input.style.width = "80%";
    input.style.padding = "10px";
    input.style.fontSize = "20px";
    input.style.border = "2px solid #ff69b4"; // Rosa vibrante do jogo
    input.style.borderRadius = "10px";
    input.style.textAlign = "center";
    input.style.fontFamily = "'Press Start 2P', cursive"; // Mantendo a fonte do jogo

    const timerElement = document.getElementById("time-left");
    timerElement.style.fontSize = "24px";
    timerElement.style.fontWeight = "bold";
}

// Adicionando a animação de pulsação ao CSS
const style = document.createElement("style");
style.innerHTML = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}`;
document.head.appendChild(style);
