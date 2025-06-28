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
let timerInterval; // usado na fase 3
let timeLeft = 120; // Tempo de 2 minutos para a fase 3

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
            <h1>Parabéns amor! 🎉 Você completou a primeira fase!</h1>
            <img src="img/EstrelaPixel.gif" class="phase-gif">
            <p>Você ganhou uma vida bônus para a próxima fase! BOA SORTE😈</p>
            <button onclick="startHangman()">Prosseguir</button>
        </div>
    `;
}


// Segunda fase do jogo

const loseLifeSound = new Audio("LoseLife.mp3");

// Função para iniciar a segunda fase
function startHangman() {
    document.getElementById("game").innerHTML = ""; // Remove qualquer modal anterior
    document.getElementById("game").innerHTML = `
        <div id="hangman-container">
            <h1>Jogo da Forca</h1>
            <img src="img/TotoroPixel.gif" class="hangman-gif" style="width: 150px;">
            <div id="lives-container"></div>
            <p id="word-display"></p>
            <div id="letter-buttons"></div>
            <p id="incorrect-letters">Letras erradas: </p>
            <p id="hangman-feedback"></p>
            <button id="finish-game-button" onclick="showFinalCompletion()" style="display: none;">Finalizar Fase</button>
        </div>
    `;

    // Pequeno atraso para garantir que os elementos sejam carregados
    initializeHangman();
    document.querySelector(".phase-completion").style.display = "none";

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
        loseLifeSound.play(); 
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
            <p>Vamos para a fase final agora!💀</p>
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

// Função para exibir a introdução da terceira fase
function showPhaseThreeIntro() {
    document.getElementById("game").innerHTML = `
        <div class="phase-intro">
            <h1>Atenção! ⚠️</h1>
            <p>Na próxima fase, você terá 2 minutos para responder! BOA SORTE💀🔥</p>
            <button id="start-phase-three-btn">Estou pronto</button>
        </div>
    `;

    // Aguarda a renderização e adiciona o evento de clique corretamente
    setTimeout(() => {
        const button = document.getElementById("start-phase-three-btn");
        if (button) {
            button.addEventListener("click", startPhaseThree);
        }
    }, 50);
}


// Função para iniciar a terceira fase
function startPhaseThree() {
    lives = 1; // Mantém 1 vida só para visual (não usaremos ela)
    timeLeft = 120; // 2 minutos

    document.getElementById("game").innerHTML = `
        <div id="phase-three-container">
            <h1>Complete a Frase</h1>
            <p id="hidden-phrase" style="display: none;"><strong>Minha namorada é...</strong></p>
            <input type="text" id="answer-input" placeholder="Digite a resposta">
            <button onclick="checkPhaseThreeAnswer()">Responder</button>
            <p id="timer">Tempo restante: <span id="time-left">120</span> segundos</p>
            <div id="lives-container"></div>
            <button id="finish-game-button" onclick="showFinalMarriageProposal()" style="display: none;">Finalizar Jogo</button>

        </div>
    `;

    setTimeout(() => {
        document.getElementById("hidden-phrase").style.display = "block";
        updateLivesDisplay();
        stylePhaseThreeElements();
        startPhaseThreeTimer(); // Inicia o contador de 2 minutos
    }, 100);
}

// Atualiza visualmente o tempo restante
function startPhaseThreeTimer() {
    clearInterval(timerInterval); // NÃO use "let" aqui

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("game-over-sound").play();
            showGameOver();
        }
    }, 1000);
}

// Atualiza a exibição das vidas com corações
function updateTimerDisplay() {
    const timeLeftSpan = document.getElementById("time-left");
    if (timeLeftSpan) {
        timeLeftSpan.textContent = timeLeft;
        timeLeftSpan.style.color = timeLeft <= 10 ? "red" : timeLeft <= 30 ? "orange" : "pink";
    }
}


// Função para verificar a resposta
function checkPhaseThreeAnswer() {
    const answer = document.getElementById("answer-input").value.trim().toLowerCase();
    if (answer === "perfeita") {
        document.getElementById("winner-sound").play();
        clearInterval(timerInterval); // para o timer
        document.getElementById("finish-game-button").style.display = "block";
    } else {
        document.getElementById("erro-sound").play();
    }
}

// Estilo para o input e o timer
function stylePhaseThreeElements() {
    const input = document.getElementById("answer-input");
    input.style.width = "80%";
    input.style.padding = "10px";
    input.style.fontSize = "20px";
    input.style.border = "2px solid #ff69b4";
    input.style.borderRadius = "10px";
    input.style.textAlign = "center";

    const timerElement = document.getElementById("time-left");
    timerElement.style.fontSize = "24px";
    timerElement.style.fontWeight = "bold";
}

// Função para exibir a tela de conclusão final
function showFinalMarriageProposal() {
  document.getElementById("game").innerHTML = `
    <h1 class="h1Final">🎉 Você venceu meu coração! 🎉</h1>
    <img src="img/NossaImg2.png" alt="Nossa Imagem" class="ImgFinal4">
    <p class="pFinal">Parabéns, amor! Você passou por cada fase, decifrou cada pista e provou que me conhece pixel por pixel.</p>
    <p class="pFinal">Mas calma... esse não é o fim! É só mais um checkpoint da nossa história juntos. Que venham mil continues, vidas extras e aventuras lado a lado. Eu te amo mais do que qualquer jogo poderia mostrar! 💖</p>
    <p class="pFinal">E agora... só falta uma última fase:</p>
    <h2 class="H2Final">Vai me pedir em casamento depois dessa?</h2>

    <div class="final-buttons">
      <button onclick="showHappyEnding()">SIM, É CLARO!💍✨</button>
      <button id="no-button-final">Aiiinda Não😱</button>
    </div>
  `;

const noButtonFinal = document.getElementById("no-button-final");
  noButtonFinal.addEventListener("pointerenter", moveNoButtonFinal);
}

function moveNoButtonFinal() {
  const button = document.getElementById("no-button-final");
  const maxX = window.innerWidth - button.clientWidth;
  const maxY = window.innerHeight - button.clientHeight;

  const newX = Math.floor(Math.random() * maxX);
  const newY = Math.floor(Math.random() * maxY);

  button.style.position = "absolute";
  button.style.left = `${newX}px`;
  button.style.top = `${newY}px`;
}

function showHappyEnding() {
  document.getElementById("game").innerHTML = `
    <h1 class="H1Final">💍✨ Missão Concluída! ✨💍</h1>
    <p class="pFinal">Pronto! Agora não tem volta... 😂</p>
    <p class="pFinal">Eu te amo infinitamente, meu amor. Que venham as próximas fases: casa, bichinhos, viagens, café da manhã juntos... e tudo mais que a gente sonhar.</p>
    <p class="pFinal">Você é meu final feliz, hoje e sempre. ❤️</p>
    <img src="img/NossaImg1.png" alt="Nossa Imagem" class="ImgFinal">
  `;
}
