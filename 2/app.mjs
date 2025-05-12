const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x222222,
});
document.body.appendChild(app.view);

let score = 0;
let timer = 30;
let gameOver = false;

// Platform
const platform = new PIXI.Graphics();
platform.beginFill(0xffffff);
const platformWidth = 150;
const platformHeight = 20;
platform.drawRect(
  -platformWidth / 2,
  -platformHeight / 2,
  platformWidth,
  platformHeight
);
platform.endFill();
platform.x = app.renderer.width / 2;
platform.y = app.renderer.height - 50;
app.stage.addChild(platform);

// UI Text
const style = new PIXI.TextStyle({ fill: "#ffffff", fontSize: 24 });
const scoreText = new PIXI.Text("Score: 0", style);
scoreText.x = 20;
scoreText.y = 20;
app.stage.addChild(scoreText);
const timerText = new PIXI.Text("Time: 30", style);
timerText.x = 20;
timerText.y = 50;
app.stage.addChild(timerText);

// Circles
const circles = [];
const spawnInterval = 1000;
let lastSpawn = 0;

// Input state
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

let touchX = null;
app.view.addEventListener("touchmove", (e) => {
  touchX = e.touches[0].clientX;
});
app.view.addEventListener("touchend", () => {
  touchX = null;
});

let mouseX = null;
app.view.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
});
app.view.addEventListener("mouseout", () => {
  mouseX = null;
});

// Game loop
app.ticker.stop();
document.getElementById("newGameBtn").style.display = "block";
app.ticker.add((delta) => {
  if (gameOver) return;

  // Move platform by keyboard
  const moveSpeed = 8;
  if (keys["ArrowLeft"]) platform.x -= moveSpeed;
  if (keys["ArrowRight"]) platform.x += moveSpeed;
  // Smooth follow mouse or touch
  if (touchX !== null) platform.x += (touchX - platform.x) * 0.1;
  if (mouseX !== null) platform.x += (mouseX - platform.x) * 0.1;

  // Clamp platform within bounds
  platform.x = Math.max(
    platformWidth / 2,
    Math.min(app.renderer.width - platformWidth / 2, platform.x)
  );

  // Spawn circles
  if (app.ticker.lastTime - lastSpawn > spawnInterval) {
    spawnCircle();
    lastSpawn = app.ticker.lastTime;
  }

  // Update circles
  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    c.y += c.speed * delta;
    if (c.y >= platform.y - platformHeight / 2) {
      if (Math.abs(c.x - platform.x) < platformWidth / 2) score++;
      else score--;
      app.stage.removeChild(c);
      circles.splice(i, 1);
      scoreText.text = `Score: ${score}`;
    }
  }
});

// Timer
const gameTimer = setInterval(() => {
  timer--;
  timerText.text = `Time: ${timer}`;
  if (timer <= 0) endGame();
}, 1000);

function spawnCircle() {
  const circle = new PIXI.Graphics();
  circle.beginFill(0xff0000);
  const radius = 20;
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  circle.x = Math.random() * (app.renderer.width - 2 * radius) + radius;
  circle.y = -radius;
  circle.speed = 4 + Math.random() * 3;
  app.stage.addChild(circle);
  circles.push(circle);
}

function endGame() {
  gameOver = true;
  clearInterval(gameTimer);
  alert(`Game Over! Your score: ${score}`);
  document.getElementById("newGameBtn").style.display = "block";
}

document.getElementById("newGameBtn").addEventListener("click", () => {
  document.getElementById("newGameBtn").style.display = "none";
  app.ticker.start();
  score = 0;
  timer = 30;
  gameOver = false;
  scoreText.text = "Score: 0";
  timerText.text = "Time: 30";
  document.getElementById("newGameBtn").style.display = "none";
  circles.forEach((c) => app.stage.removeChild(c));
  circles.length = 0;
  lastSpawn = app.ticker.lastTime;
  setInterval(() => {
    if (!gameOver) {
      timer--;
      timerText.text = `Time: ${timer}`;
      if (timer <= 0) endGame();
    }
  }, 1000);
});
