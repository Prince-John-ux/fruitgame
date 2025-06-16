const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddle = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  width: 100,
  height: 10,
  speed: 7
};

let fruit = {
  x: Math.random() * (canvas.width - 30),
  y: 0,
  size: 30,
  speed: 3,
  img: new Image()
};

fruit.img.src = 'apple.png'; // default image

let score = 0;
let level = 1;
let paused = false;
let gameOver = false;
let animationId;

const bgColors = ['#111', '#1a1aff', '#1aff1a', '#ff1a1a', '#ffcc00', '#ff66cc', '#00ffff'];
let bgColorIndex = 0;

const fruitImages = ['apple.png']; // Add more PNG fruit images here

let keys = {};

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('startScreen').style.display = 'none';
  startGame();
});

document.getElementById('restartBtn').addEventListener('click', () => {
  location.reload();
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  paused = !paused;
  document.getElementById('pauseBtn').innerText = paused ? 'Resume' : 'Pause';
  if (!paused) gameLoop();
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Mouse control
document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.width / 2;
});

// Touch buttons
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
let moveLeft = false;
let moveRight = false;

leftBtn.addEventListener('touchstart', () => moveLeft = true);
leftBtn.addEventListener('touchend', () => moveLeft = false);
rightBtn.addEventListener('touchstart', () => moveRight = true);
rightBtn.addEventListener('touchend', () => moveRight = false);

function startGame() {
  document.getElementById('restartBtn').style.display = 'inline-block';

  // Show mobile buttons only on small screens
  if (window.innerWidth <= 768) {
    document.getElementById('mobileControls').style.display = 'flex';
  }

  gameLoop();
}

function drawPaddle() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawFruit() {
  ctx.drawImage(fruit.img, fruit.x, fruit.y, fruit.size, fruit.size);
}

function update() {
  if (paused || gameOver) return;

  // Keyboard arrow key control
  if (keys['ArrowLeft']) paddle.x -= paddle.speed;
  if (keys['ArrowRight']) paddle.x += paddle.speed;

  // Touch button control
  if (moveLeft) paddle.x -= paddle.speed;
  if (moveRight) paddle.x += paddle.speed;

  // Boundary check
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

  fruit.y += fruit.speed;

  // Collision detection
  if (
    fruit.y + fruit.size >= paddle.y &&
    fruit.x + fruit.size > paddle.x &&
    fruit.x < paddle.x + paddle.width
  ) {
    score++;
    fruit.y = -fruit.size;
    fruit.x = Math.random() * (canvas.width - fruit.size);
    changeFruit();
    changeBgColor();

    if (score % 10 === 0) {
      level++;
      fruit.speed += 1;
    }
  }

  // Missed fruit
  if (fruit.y > canvas.height) {
    gameOver = true;
  }
}

function draw() {
  ctx.fillStyle = bgColors[bgColorIndex];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawFruit();

  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.fillText('Score: ' + score, 10, 20);
  ctx.fillText('Level: ' + level, 10, 40);

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '30px sans-serif';
    ctx.fillText('Game Over', 110, 250);
  }
}

function gameLoop() {
  if (gameOver) return;
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function changeBgColor() {
  bgColorIndex = (bgColorIndex + 1) % bgColors.length;
}

function changeFruit() {
  const index = Math.floor(Math.random() * fruitImages.length);
  fruit.img.src = fruitImages[index];
}


