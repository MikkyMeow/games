import { formatTime } from "./scripts/formatTime.mjs";

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#2a2a2a",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;
let clickButton;
let autoClickRate = 0;
let autoClickLevel = 0;
let upgradeButton;
let upgradeText;
let clickSound;
let lastAutoClickTime = 0;

function preload() {
  this.load.image(
    "button",
    "https://labs.phaser.io/assets/sprites/button-blue.png"
  );
  this.load.audio("click", "./assets/click.mp3");
}

function create() {
  // Загрузка из localStorage
  score = parseInt(localStorage.getItem("score")) || 0;
  autoClickLevel = parseInt(localStorage.getItem("autoClickLevel")) || 0;
  autoClickRate = autoClickLevel;

  // clickSound = this.sound.add("click");

  // Счёт
  scoreText = this.add
    .text(200, 100, "", {
      fontSize: "32px",
      color: "#ffffff",
    })
    .setOrigin(0.5);
  updateScoreText();

  // Кнопка клика
  clickButton = this.add.image(200, 300, "button").setInteractive().setScale(2);

  clickButton.on("pointerdown", () => {
    score++;
    // clickSound.play();
    updateScoreText();
    saveProgress();

    // Простая анимация кнопки
    this.tweens.add({
      targets: clickButton,
      scale: 2.2,
      yoyo: true,
      duration: 100,
      ease: "Power1",
    });
  });

  // Кнопка апгрейда
  upgradeButton = this.add
    .image(200, 450, "button")
    .setInteractive()
    .setScale(1.5);

  upgradeText = this.add
    .text(200, 450, "", {
      fontSize: "20px",
      color: "#000000",
    })
    .setOrigin(0.5);

  updateUpgradeText();

  upgradeButton.on("pointerdown", () => {
    const cost = getUpgradeCost();
    if (score >= cost) {
      score -= cost;
      autoClickLevel++;
      autoClickRate = autoClickLevel;
      updateScoreText();
      updateUpgradeText();
      saveProgress();
    }
  });
}

function update(time, delta) {
  // Автокликер
  if (time - lastAutoClickTime >= 1000) {
    score += autoClickRate;
    lastAutoClickTime = time;
    updateScoreText();
    saveProgress();
  }
}

function updateScoreText() {
  scoreText.setText(formatTime(score));
}

function getUpgradeCost() {
  return 10 + autoClickLevel * 15;
}

function updateUpgradeText() {
  upgradeText.setText(`Апгрейд (+1/sec)\nЦена: ${getUpgradeCost()}`);
}

function saveProgress() {
  localStorage.setItem("score", score);
  localStorage.setItem("autoClickLevel", autoClickLevel);
}
