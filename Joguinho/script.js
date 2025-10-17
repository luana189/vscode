const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Objetos do jogo
const paddleWidth = 10, paddleHeight = 100;
const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2 };
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: 5,
    speedY: 5
};

// Desenhar elementos
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Atualizar posições
function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Rebater no topo e fundo
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }

    // Rebater nas raquetes
    if (
        ball.x - ball.radius < player.x + paddleWidth &&
        ball.y > player.y &&
        ball.y < player.y + paddleHeight
    ) {
        ball.speedX *= -1;
    }

    if (
        ball.x + ball.radius > ai.x &&
        ball.y > ai.y &&
        ball.y < ai.y + paddleHeight
    ) {
        ball.speedX *= -1;
    }

    // Movimento simples da IA
    if (ball.y < ai.y + paddleHeight / 2) ai.y -= 4;
    else ai.y += 4;

    // Resetar se sair da tela
    if (ball.x < 0 || ball.x > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX *= -1;
    }
}

// Desenhar tudo
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#1e1e1e");
    drawRect(player.x, player.y, paddleWidth, paddleHeight, "#00ffcc");
    drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "#ff0066");
    drawCircle(ball.x, ball.y, ball.radius, "#ffffff");
}

// Loop do jogo
function game() {
    update();
    render();
}

setInterval(game, 1000 / 60);

// Controle com o mouse
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    player.y = e.clientY - rect.top - paddleHeight / 2;
});

let playerScore = 0;
let aiScore = 0;

function updateScore() {
    document.getElementById("playerScore").textContent = `Jogador: ${playerScore}`;
    document.getElementById("aiScore").textContent = `IA: ${aiScore}`;
}

// Dentro do update(), onde a bola sai da tela:
if (ball.x < 0) {
    aiScore++;
    updateScore();
    resetBall();
}

if (ball.x > canvas.width) {
    playerScore++;
    updateScore();
    resetBall();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX *= -1;
}

const pongSound = document.getElementById("pongSound");
const scoreSound = document.getElementById("scoreSound");

// Toque ao bater na raquete
if (colidiuComRaquete) {
    pongSound.play();
}

// Toque ao marcar ponto
scoreSound.play();
