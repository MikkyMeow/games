const app = new PIXI.Application({
  width: 400,
  height: 400,
  backgroundColor: 0xffffff,
});

await app.init();
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
document.getElementById("app").appendChild(app.canvas);

const info = document.getElementById("info");
const startBtn = document.getElementById("start-btn");

let score = 0;
let totalHits = 0;
let totalCircles = 0;
let timeLeft = 30;
let spawnInterval;
let timerInterval;
const circles = [];

function updateInfo() {
  info.textContent = `Очки: ${score} | Осталось: ${timeLeft}`;
}

function startGame() {
  // Сброс
  score = 0;
  timeLeft = 30;
  updateInfo();
  startBtn.disabled = true;
  clearAllCircles();

  spawnInterval = setInterval(spawnCircle, 800);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateInfo();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function spawnCircle() {
  const value = Math.floor(Math.random() * 9) + 1;
  if (value % 2 === 0) totalCircles++;
  const x = Math.random() * (app.view.width - 50) + 25;
  const y = Math.random() * (app.view.height - 50) + 25;

  const container = new PIXI.Container();
  container.x = x;
  container.y = y;

  const graphics = new PIXI.Graphics();
  graphics.beginFill(0x3498db);
  graphics.drawCircle(0, 0, 25);
  graphics.endFill();
  container.addChild(graphics);

  const style = new PIXI.TextStyle({
    fill: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    align: "center",
  });

  const text = new PIXI.Text(value.toString(), style);
  text.anchor.set(0.5);
  container.addChild(text);

  container.interactive = true;
  container.buttonMode = true;

  container.on("pointerdown", () => {
    if (value % 2 === 0) {
      totalHits++;
      score++;
    } else {
      score--;
    }
    updateInfo();
    app.stage.removeChild(container);
    const index = circles.indexOf(container);
    if (index !== -1) circles.splice(index, 1);

    e.stopPropagation();
  });

  // Удаление через 1 сек
  setTimeout(() => {
    if (app.stage.children.includes(container)) {
      app.stage.removeChild(container);
      const index = circles.indexOf(container);
      if (index !== -1) circles.splice(index, 1);
    }
  }, 1000);

  circles.push(container);
  app.stage.addChild(container);
}

function clearAllCircles() {
  for (const c of circles) {
    app.stage.removeChild(c);
  }
  circles.length = 0;
}

app.stage.on("pointerdown", (e) => {
  const { x, y } = e.global;
  let hit = false;

  for (const c of circles) {
    const dx = x - c.x;
    const dy = y - c.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= 25) {
      // 25 — радиус круга
      hit = true;
      break;
    }
  }

  if (!hit) {
    score--;
    updateInfo();
  }
});

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearAllCircles();
  startBtn.disabled = false;
  alert(
    `
Игра окончена! 
Ваш счёт: ${score}. 
Вы попали в ${totalHits} из ${totalCircles}!
Процент попаданий: ${((totalHits / totalCircles) * 100).toFixed(2)}%
Точность: ${((score / totalCircles) * 100).toFixed(2)}%`
  );
}

startBtn.addEventListener("click", startGame);
