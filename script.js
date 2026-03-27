const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const gameScreen = document.getElementById("game-screen");

const box = 20;
let snake = [];
let direction = "RIGHT";
let nextDirection = "RIGHT"; // Queue direction
let food = {};
let score = 0;
let game = null;
let isRunning = false;

// Start button
document.getElementById("start").onclick = () => {
  menu.style.display = "none";
  gameScreen.style.display = "block";
  startGame();
};

// Restart button
document.getElementById("restart").onclick = restartGame;

// Controls
document.addEventListener("keydown", changeDirection);
document.getElementById("up").onclick = () => { queueDirection("UP"); };
document.getElementById("down").onclick = () => { queueDirection("DOWN"); };
document.getElementById("left").onclick = () => { queueDirection("LEFT"); };
document.getElementById("right").onclick = () => { queueDirection("RIGHT"); };

function startGame() {
  snake = [{ x: 8 * box, y: 8 * box }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  score = 0;
  food = generateFood();
  document.getElementById("score").innerText = score;
  game = setInterval(draw, 120);
  isRunning = true;
}

// Restart function
function restartGame() {
  clearInterval(game);
  startGame();
}

// Queue direction safely
function queueDirection(newDir) {
  if (
    (newDir === "UP" && direction !== "DOWN") ||
    (newDir === "DOWN" && direction !== "UP") ||
    (newDir === "LEFT" && direction !== "RIGHT") ||
    (newDir === "RIGHT" && direction !== "LEFT")
  ) {
    nextDirection = newDir;
  }
}

function changeDirection(event) {
  if (event.key === "ArrowUp") queueDirection("UP");
  if (event.key === "ArrowDown") queueDirection("DOWN");
  if (event.key === "ArrowLeft") queueDirection("LEFT");
  if (event.key === "ArrowRight") queueDirection("RIGHT");
}

// Generate food not inside snake
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  return newFood;
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply queued direction
  direction = nextDirection;

  // Calculate new head position
  let head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // Check wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame("Game Over! Your score: " + score);
    return;
  }

  // Check self-collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    endGame("Game Over! Your score: " + score);
    return;
  }

  // Move snake
  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    document.getElementById("score").innerText = score;
    food = generateFood();
  } else {
    snake.pop();
  }

  // Draw snake
  snake.forEach((seg, index) => {
    let grad = ctx.createLinearGradient(seg.x, seg.y, seg.x + box, seg.y + box);
    grad.addColorStop(0, `hsl(${(index * 30 + score * 10) % 360}, 80%, 60%)`);
    grad.addColorStop(1, `hsl(${(index * 30 + score * 10 + 30) % 360}, 70%, 50%)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(seg.x, seg.y, box, box, 6);
    ctx.fill();
  });

  // Draw food
  ctx.fillStyle = "#ff3f3f";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#fff5";
  ctx.beginPath();
  ctx.arc(food.x + box / 3, food.y + box / 3, box / 6, 0, 2 * Math.PI);
  ctx.fill();
}

function endGame(msg) {
  clearInterval(game);
  isRunning = false;
  alert(msg);
}

