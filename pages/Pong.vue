<template>
  <v-container fluid>
    <div
      class="pong"
      :style="fieldStyle"
    >
      <div
        class="paddle"
        :style="player1Style"
      ></div>
      <div
        class="paddle"
        :style="player2Style"
      ></div>
      <div
        class="ball"
        :style="ballStyle"
      ></div>
      <div v-show="!gameStarted">
        <v-btn
          color="success"
          @click="startGame"
        >
          Start Game
        </v-btn>
        <div
          v-show="gameOver"
          class="on-game-text"
        >
          <div ref="confettiContainer"></div>
          <h3>Game Over!</h3>
          <p>{{ gameOver }}</p>
          <p>Hits: {{ hits }}</p>
        </div>
        <p class="on-game-text">
          Press Space to start game.
        </p>
      </div>
    </div>
    <div :style="{ width: fieldWidth + 'px' }">
      <ScoreDisplay
        :player-1-score="player1Score"
        :player-2-score="player2Score"
      />
    </div>

    <div>
      <v-btn
        color="primary"
        @click="showStats = !showStats"
      >{{ showStats ? 'Hide Stats' : 'Show Stats' }}</v-btn>
    </div>
    <div v-if="showStats">
      <p>Player 1: {{ player1Position }}</p>
      <p>Player 2: {{ player2Position }}</p>
      <p>Ball: {{ ballPositionX }}, {{ ballPositionY }}</p>
      <p>Ball Speed: {{ ballSpeedX }}, {{ ballSpeedY }}</p>
      <p>Ball Velocity: {{ Math.sqrt(Math.pow(ballSpeedX, 2) + Math.pow(ballSpeedY, 2)) }}</p>
      <p>Ball Max Velocity: {{ ballMaxVelocity }}</p>
    </div>
  </v-container>
</template>

<script
  setup
  lang="ts"
>
// Created with the assistance of Google Gemini
import { ref, onMounted, onUnmounted, watch } from 'vue';

const fieldWidth = 800;
const fieldHeight = 600;
const fieldStyle = {
  width: fieldWidth + 'px',
  height: fieldHeight + 'px',
};
const paddleWidth = 10;
const paddleHeight = 100;
const player1Position = ref(fieldHeight / 2 - 50);
const player1UpKey = ref('w');
const player1DownKey = ref('s');
const player1Style = computed(
  () => ({
    top: player1Position.value + 'px',
    left: wallPaddleGap + 'px',
    width: paddleWidth + 'px',
    height: paddleHeight + 'px',
  }),
);
const player2Position = ref(fieldHeight / 2 - 50);
const player2UpKey = ref('ArrowUp');
const player2DownKey = ref('ArrowDown');
const player2Style = computed(
  () => ({
    top: player2Position.value + 'px',
    left: fieldWidth - wallPaddleGap - paddleWidth + 'px',
    width: paddleWidth + 'px',
    height: paddleHeight + 'px',
  })
)
const startButtonKey = ref(' ');
const ballPositionX = ref(fieldWidth);
const ballPositionY = ref(fieldHeight);
const ballSpeedX = ref(0);
const ballSpeedY = ref(0);
let ballMaxVelocity = 4;
const ballMinXSpeed = 4;
const ballMinYSpeed = 1;
const ballWidth = 10;
const ballHeight = 10;
const ballStyle = computed(
  () => ({
    left: ballPositionX.value + 'px',
    top: ballPositionY.value + 'px',
    width: ballWidth + 'px',
    height: ballHeight + 'px',
  }),
);
const showStats = ref(false);
const wallPaddleGap = 5;
const paddleSpeed = 5;
let interval: NodeJS.Timeout;
const keysPressed = ref<Set<string>>(new Set());
const gameStarted = ref(false);
const gameOver = ref('');
const confettiContainer = ref<HTMLDivElement | null>(null);
const hits = ref(0);
const player1Score = ref(0);
const player2Score = ref(0);

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  clearInterval(interval);
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
});

watch(
  () => ballPositionY.value,
  newY => {
    if (newY <= 0 || newY >= fieldHeight - ballHeight) {
      ballSpeedY.value *= -1;
    }
    if (newY <= 0) {
      ballPositionY.value = 1;
    } else if (newY >= fieldHeight - ballHeight) {
      ballPositionY.value = fieldHeight - ballHeight - 1;
    }
  },
);

watch(
  () => ballPositionX.value,
  newX => {
    if (newX <= 0) {
      gameEnded(2);
      ballPositionX.value = 1;
    } else if (newX >= fieldWidth - ballWidth) {
      gameEnded(1);
      ballPositionX.value = fieldWidth - ballWidth - 1;
    }
  },
);

function startGame() {
  stopConfetti();
  gameStarted.value = true;
  ballPositionX.value = fieldWidth / 2;
  ballPositionY.value = fieldHeight / 2;
  increaseMaxVelocity();
  randomizeInitialBallSpeed();
  startInterval();
}

function increaseMaxVelocity() {
  ballMaxVelocity *= 1.1;

  if (ballMaxVelocity > 15)
    ballMaxVelocity = 15;
}

function gameEnded(winningPlayer: number) {
  gameOver.value = `Player ${winningPlayer} wins!`;
  if (winningPlayer === 1) {
    player1Score.value++;
  } else {
    player2Score.value++;
  }
  createConfetti();
  gameStarted.value = false;
  clearInterval(interval);
}


function startInterval() {
  interval = setInterval(() => {
    updateBallPosition();
    updatePaddlePosition();
    checkCollisions();
  }, 10);
}

function updateBallPosition() {
  if (!gameStarted.value) return;
  ballPositionX.value += ballSpeedX.value;
  ballPositionY.value += ballSpeedY.value;
}

function updatePaddlePosition() {
  if (!gameStarted.value) return;
  if (keysPressed.value.has(player1UpKey.value) && player1Position.value > 0) {
    player1Position.value -= paddleSpeed;
  } else if (keysPressed.value.has(player1DownKey.value) && player1Position.value < fieldHeight - paddleHeight) {
    player1Position.value += paddleSpeed;
  }
  if (keysPressed.value.has(player2UpKey.value) && player2Position.value > 0) {
    player2Position.value -= paddleSpeed;
  } else if (keysPressed.value.has(player2DownKey.value) && player2Position.value < fieldHeight - paddleHeight) {
    player2Position.value += paddleSpeed;
  }
}

function checkCollisions() {
  if (!gameStarted.value) return;
  // Check for paddle collisions
  const collision = calculateCollisionAndDeflection(1);
  if (collision) return;
  calculateCollisionAndDeflection(2);
}

function calculateCollisionAndDeflection(player: number) {
  const isPlayer1 = player === 1;
  const playerTopPosition = isPlayer1 ? player1Position.value : player2Position.value;
  const playerBottomPosition = playerTopPosition + paddleHeight;
  const playerUpKey = isPlayer1 ? player1UpKey.value : player2UpKey.value;
  const playerDownKey = isPlayer1 ? player1DownKey.value : player2DownKey.value;

  const ballTopPosition = ballPositionY.value;
  const ballBottomPosition = ballTopPosition + ballHeight;
  const ballIsNearPlayer = isPlayer1 ? (ballPositionX.value <= paddleWidth + wallPaddleGap + 1) : (ballPositionX.value >= fieldWidth - paddleWidth - wallPaddleGap - 1);
  const playerIsHittingBall = ballBottomPosition >= playerTopPosition && ballTopPosition <= playerBottomPosition;

  const ballCollision = ballIsNearPlayer && playerIsHittingBall;
  if (!ballCollision) return false;

  // Calculate the relative position of the ball within the paddle
  const relativeBallPosition = ballTopPosition - playerTopPosition;
  const halfPaddleHeight = paddleHeight / 2;

  // Adjust the ball's Y speed based on the paddle's movement
  if (keysPressed.value.has(playerUpKey)) {
    // If the ball is closer to the top of the paddle, increase its upward speed
    if (relativeBallPosition < halfPaddleHeight) {
      ballSpeedY.value = -Math.abs(ballSpeedY.value) * (1.5 - relativeBallPosition / halfPaddleHeight);
    } else {
      // If the ball is closer to the middle or bottom of the paddle, decrease its upward speed
      ballSpeedY.value = -Math.abs(ballSpeedY.value) * (0.5 - (relativeBallPosition - halfPaddleHeight) / halfPaddleHeight);
    }
  } else if (keysPressed.value.has(playerDownKey)) {
    // If the ball is closer to the bottom of the paddle, increase its downward speed
    if (relativeBallPosition > halfPaddleHeight) {
      ballSpeedY.value = Math.abs(ballSpeedY.value) * (1.5 - (relativeBallPosition - halfPaddleHeight) / halfPaddleHeight);
    } else {
      // If the ball is closer to the middle or top of the paddle, decrease its downward speed
      ballSpeedY.value = Math.abs(ballSpeedY.value) * (0.5 - relativeBallPosition / (halfPaddleHeight));
    }
  }
  if (Math.sqrt(Math.pow(ballSpeedX.value, 2) + Math.pow(ballSpeedY.value, 2)) > ballMaxVelocity)
    ballSpeedY.value *= Math.sqrt(Math.pow(ballMaxVelocity, 2) - Math.pow(ballSpeedX.value, 2));

  ballSpeedX.value *= -1;
  ballPositionX.value = isPlayer1 ? (paddleWidth + wallPaddleGap + 2) : (fieldWidth - paddleWidth - wallPaddleGap - 2);
  hits.value++;
  return true;
}

function handleKeyDown(event: KeyboardEvent) {
  if (![player1UpKey.value, player1DownKey.value, player2UpKey.value, player2DownKey.value].includes(event.key)) return;
  keysPressed.value.add(event.key);
}

function handleKeyUp(event: KeyboardEvent) {
  if (!gameStarted.value && event.key === startButtonKey.value) {
    startGame();
    return;
  }
  keysPressed.value.delete(event.key);
}

function randomizeInitialBallSpeed() {
  const xSpeed = (Math.random() * (ballMaxVelocity - ballMinXSpeed)) + ballMinXSpeed;
  const maxYSpeed = Math.sqrt(Math.pow(ballMaxVelocity, 2) - Math.pow(xSpeed, 2));
  const ySpeed = (Math.random() * (maxYSpeed - ballMinYSpeed)) + ballMinYSpeed;
  const xDirection = Math.random() < 0.5 ? -1 : 1;
  const yDirection = Math.random() < 0.5 ? -1 : 1;

  ballSpeedX.value = xSpeed * xDirection;
  ballSpeedY.value = ySpeed * yDirection;
}

let confettiInterval: NodeJS.Timeout;
function createConfetti() {
  if (!confettiContainer.value) return;
  confettiContainer.value.innerHTML = '';

  for (let i = 0; i < 120; i++)
    addConfetti();

  confettiInterval = setInterval(() => {
    for (let i = 0; i < 4; i++)
      addConfetti();

    removeConfetti();
  }, 200);
}
function stopConfetti() {
  clearInterval(confettiInterval);
  if (!confettiContainer.value) return;
  confettiContainer.value.innerHTML = '';
}

function addConfetti() {
  if (!confettiContainer.value) return;
  const colors = ['#f00', '#0f0', '#00f']; // Red, green, blue
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.left = `${Math.random() * 100}%`;
  confetti.style.top = `${Math.random() * 95}%`;
  const direction = Math.random() < 0.5 ? 'confetti-fall' : 'confetti-fall-reverse';
  confetti.style.animation = `${direction} 10s ease-in 0s infinite`;
  confettiContainer.value.appendChild(confetti);
}
function removeConfetti() {
  if (!confettiContainer.value) return;
  const confetti = confettiContainer.value.querySelectorAll('.confetti');
  for (let i = 0; i < 4; i++)
    confetti[Math.floor(Math.random() * confetti.length)].remove();
}
</script>

<style>
.pong {
  border: 1px solid black;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  text-align: center;
  overflow: hidden;
}

.paddle {
  background-color: black;
  position: absolute;
}

.ball {
  background-color: black;
  position: absolute;
  border-radius: 50%;
}

.on-game-text {
  color: black;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #f00;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(100vh) rotate(360deg);
  }
}

@keyframes confetti-fall-reverse {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(100vh) rotate(-360deg);
  }
}
</style>
