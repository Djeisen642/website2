<template>
  <v-container fluid>
    <VDialog
      v-model="isMobile"
      persistent
    >
      <v-card>
        <v-card-title>
          <h3>Mobile Device Detected</h3>
        </v-card-title>
        <v-card-text>
          <p>This game cannot be played on a mobile device.
            Please use a device with a keyboard to play.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            to="/"
          >
            Go Home
          </v-btn>
        </v-card-actions>
      </v-card>
    </VDialog>
    <div
      class="pong"
      :style="fieldStyle"
    >
      <div
        class="paddle"
        :style="playerOneStyle"
      ></div>
      <div
        class="paddle"
        :style="playerTwoStyle"
      ></div>
      <div
        class="ball"
        :style="ballStyle"
      ></div>
      <div
        v-show="pauseTimer"
        class="on-game-text"
      >
        <h2>
          Game Paused
        </h2>
        <h3>{{ pauseTimer }}</h3>
      </div>
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
          <h2>Game Over!</h2>
          <p>{{ gameOver }}</p>
          <p>Hits: {{ hits }}</p>
        </div>
        <p class="on-game-text">
          Press Space to start game.
        </p>
      </div>
    </div>
    <div :style="{ width: fieldWidth + 'px', margin: 'auto' }">
      <ScoreDisplay
        :player-one-score="playerOneScore"
        :player-two-score="playerTwoScore"
      />
    </div>
    <div :style="{ width: fieldWidth + 'px', margin: 'auto' }">
      <div>
        <v-btn
          color="primary"
          @click="showStats = !showStats"
        >{{ showStats ? 'Hide Stats' : 'Show Stats' }}</v-btn>
        <v-btn
          color="secondary"
          @click="showInstructionsDialog = true"
        >Instructions</v-btn>
      </div>
      <div v-if="showStats">
        <p>Player 1: {{ playerOnePosition }}</p>
        <p>Player 2: {{ playerTwoPosition }}</p>
        <p>Ball: {{ ballPositionX }}, {{ ballPositionY }}</p>
        <p>Ball Speed: {{ ballSpeedX }}, {{ ballSpeedY }}</p>
        <p>Ball Velocity: {{ Math.sqrt(Math.pow(ballSpeedX, 2) + Math.pow(ballSpeedY, 2)) }}
        </p>
        <p>Ball Max Velocity: {{ ballMaxVelocity }}</p>
      </div>
    </div>
    <InstructionsDialog
      v-model="showInstructionsDialog"
      @close="showInstructionsDialog = false"
    />
  </v-container>
</template>

<script setup lang="ts">
// Created with the assistance of Google Gemini
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ScoreDisplay from '@/components/Pong/ScoreDisplay.vue';
import InstructionsDialog from '@/components/Pong/InstructionsDialog.vue';

const { isMobile } = useDevice();

const fieldWidth = 800;
const fieldHeight = 600;
const fieldStyle = {
  width: fieldWidth + 'px',
  height: fieldHeight + 'px',
};
const paddleWidth = 10;
const paddleHeight = 100;
enum Player {
  ONE = 1,
  TWO = 2,
}
const playerOnePosition = ref(fieldHeight / 2 - 50);
const playerOneUpKey = ref('w');
const playerOneDownKey = ref('s');
const playerOneScore = ref(0);
const playerOneStyle = computed(
  () => ({
    top: playerOnePosition.value + 'px',
    left: wallPaddleGap + 'px',
    width: paddleWidth + 'px',
    height: paddleHeight + 'px',
  }),
);
const playerTwoScore = ref(0);
const playerTwoPosition = ref(fieldHeight / 2 - 50);
const playerTwoUpKey = ref('ArrowUp');
const playerTwoDownKey = ref('ArrowDown');
const playerTwoStyle = computed(
  () => ({
    top: playerTwoPosition.value + 'px',
    left: fieldWidth - wallPaddleGap - paddleWidth + 'px',
    width: paddleWidth + 'px',
    height: paddleHeight + 'px',
  })
)
const startButtonKey = ' '; // this is a space
const pauseButtonKey = 'p';
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
let interval: NodeJS.Timeout | undefined;
const keysPressed = ref<Set<string>>(new Set());
const gameStarted = ref(false);
const gameOver = ref('');
const confettiContainer = ref<HTMLDivElement | null>(null);
const hits = ref(0);
const showInstructionsDialog = ref(false);
const pauseTimer = ref(0);

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  stopInterval();
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
});

watch(
  () => showInstructionsDialog.value,
  (show) => {
    if (show) {
      stopInterval();
      return;
    }
    if (!gameStarted.value) return;
    const secondsUntilRestart = 3;
    pauseTimer.value = secondsUntilRestart;
    const thisInterval = setInterval(() => {
      pauseTimer.value--;
      if (pauseTimer.value !== 0) return;
      startInterval();
      clearInterval(thisInterval);
    }, 1000);
  },
)

watch(
  () => ballPositionY.value,
  newY => {
    if (newY <= 0 || newY >= fieldHeight - ballHeight)
      ballSpeedY.value *= -1; // bounce it off the wall

    if (newY <= 0) {
      ballPositionY.value = 1; // adjust it so that it's not off the field
    } else if (newY >= fieldHeight - ballHeight) {
      ballPositionY.value = fieldHeight - ballHeight - 1; // adjust it so that it's not off the field
    }
  },
);

watch(
  () => ballPositionX.value,
  newX => {
    if (newX <= 0) {
      gameEnded(Player.TWO);
      ballPositionX.value = 1; // adjust it so that it's not off the field
    } else if (newX >= fieldWidth - ballWidth) {
      gameEnded(Player.ONE);
      ballPositionX.value = fieldWidth - ballWidth - 1; // adjust it so that it's not off the field
    }
  },
);

function startGame() {
  stopConfetti();
  gameStarted.value = true;
  hits.value = 0;
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
  if (winningPlayer === Player.ONE) {
    playerOneScore.value++;
  } else {
    playerTwoScore.value++;
  }
  createConfetti();
  gameStarted.value = false;
  stopInterval();
}


function startInterval() {
  if (interval || !gameStarted.value) return;
  interval = setInterval(() => {
    updateBallPosition();
    updatePaddlePosition();
    checkCollisions();
  }, 10);
}

function stopInterval() {
  clearInterval(interval);
  interval = undefined;
}

function updateBallPosition() {
  if (!gameStarted.value) return;
  ballPositionX.value += ballSpeedX.value;
  ballPositionY.value += ballSpeedY.value;
}

function updatePaddlePosition() {
  if (!gameStarted.value) return;
  if (keysPressed.value.has(playerOneUpKey.value) && playerOnePosition.value > 0) {
    playerOnePosition.value -= paddleSpeed;
  } else if (keysPressed.value.has(playerOneDownKey.value) && playerOnePosition.value < fieldHeight - paddleHeight) {
    playerOnePosition.value += paddleSpeed;
  }
  if (keysPressed.value.has(playerTwoUpKey.value) && playerTwoPosition.value > 0) {
    playerTwoPosition.value -= paddleSpeed;
  } else if (keysPressed.value.has(playerTwoDownKey.value) && playerTwoPosition.value < fieldHeight - paddleHeight) {
    playerTwoPosition.value += paddleSpeed;
  }
}

function checkCollisions() {
  if (!gameStarted.value) return;
  // Check for paddle collisions
  const collision = calculateCollisionAndDeflection(Player.ONE);
  if (collision) return;
  calculateCollisionAndDeflection(Player.TWO);
}

function calculateCollisionAndDeflection(player: number) {
  const isCheckingPlayerOne = player === Player.ONE;
  const playerTopPosition = isCheckingPlayerOne ? playerOnePosition.value : playerTwoPosition.value;
  const playerBottomPosition = playerTopPosition + paddleHeight;
  const playerUpKey = isCheckingPlayerOne ? playerOneUpKey.value : playerTwoUpKey.value;
  const playerDownKey = isCheckingPlayerOne ? playerOneDownKey.value : playerTwoDownKey.value;

  const ballTopPosition = ballPositionY.value;
  const ballBottomPosition = ballTopPosition + ballHeight;
  const ballIsNearPlayer = isCheckingPlayerOne ?
    (ballPositionX.value <= paddleWidth + wallPaddleGap + 1) :
    (ballPositionX.value >= fieldWidth - paddleWidth - wallPaddleGap - 1);
  const playerIsHittingBall = ballBottomPosition >= playerTopPosition && ballTopPosition <= playerBottomPosition;

  const ballCollision = ballIsNearPlayer && playerIsHittingBall;
  if (!ballCollision) return false;

  ballSpeedX.value *= -1;
  ballPositionX.value = isCheckingPlayerOne ? (paddleWidth + wallPaddleGap + 2) : (fieldWidth - paddleWidth - wallPaddleGap - 2);
  calculateYDeflection(keysPressed.value.has(playerUpKey), keysPressed.value.has(playerDownKey), ballTopPosition, playerTopPosition);
  hits.value++;
  return true;
}

function calculateYDeflection(upKeyPressed: boolean, downKeyPressed: boolean, ballTopPosition: number, playerTopPosition: number) {
  // Calculate the relative position of the ball within the paddle
  const relativeBallPosition = ballTopPosition - playerTopPosition;
  const halfPaddleHeight = paddleHeight / 2;

  // Adjust the ball's Y speed based on the paddle's movement
  if (upKeyPressed) {
    // If the ball is closer to the top of the paddle, increase its upward speed
    if (relativeBallPosition < halfPaddleHeight) {
      ballSpeedY.value = -Math.abs(ballSpeedY.value) * (1 + (relativeBallPosition / halfPaddleHeight));
    } else {
      // If the ball is closer to the middle or bottom of the paddle, decrease its upward speed
      ballSpeedY.value = -Math.abs(ballSpeedY.value) * (1 - ((relativeBallPosition - halfPaddleHeight) / halfPaddleHeight));
    }
  } else if (downKeyPressed) {
    // If the ball is closer to the bottom of the paddle, increase its downward speed
    if (relativeBallPosition > halfPaddleHeight) {
      ballSpeedY.value = Math.abs(ballSpeedY.value) * (1 + ((relativeBallPosition - halfPaddleHeight) / halfPaddleHeight));
    } else {
      // If the ball is closer to the middle or top of the paddle, decrease its downward speed
      ballSpeedY.value = Math.abs(ballSpeedY.value) * (1 - (relativeBallPosition / halfPaddleHeight));
    }
  }

  // Ensure the ball's speed doesn't exceed the maximum velocity
  const currentVelocity = Math.sqrt(Math.pow(ballSpeedX.value, 2) + Math.pow(ballSpeedY.value, 2));
  if (currentVelocity > ballMaxVelocity)
    ballSpeedY.value *= ballMaxVelocity / currentVelocity;
}

function handleKeyDown(event: KeyboardEvent) {
  if (![playerOneUpKey.value, playerOneDownKey.value, playerTwoUpKey.value, playerTwoDownKey.value].includes(event.key)) return;
  keysPressed.value.add(event.key);
}

function handleKeyUp(event: KeyboardEvent) {
  if (event.key === pauseButtonKey) {
    showInstructionsDialog.value = !showInstructionsDialog.value;
    return;
  }
  if (!gameStarted.value && event.key === startButtonKey) {
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
  const color = colors[Math.floor(Math.random() * colors.length)];
  if (color === undefined) throw new Error('Unexpected undefined color');
  confetti.style.backgroundColor = color;
  confetti.style.left = `${Math.random() * 100}%`;
  confetti.style.top = `${Math.random() * 95}%`;
  const direction = Math.random() < 0.5 ? 'confetti-fall' : 'confetti-fall-reverse';
  confetti.style.animation = `${direction} 10s ease-in 0s infinite`;
  confettiContainer.value.appendChild(confetti);
}
function removeConfetti() {
  if (!confettiContainer.value) return;
  const confetti = confettiContainer.value.querySelectorAll('.confetti');
  for (let i = 0; i < 4; i++) {
    const toRemove = confetti[Math.floor(Math.random() * confetti.length)];
    if (!toRemove) throw new Error('Unexpected undefined confetti element');
    toRemove.remove();
  }
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
  margin: auto;
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
</style>~/components/Pong/InstructionsDialog.vue
