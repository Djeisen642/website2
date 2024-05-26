<template>
  <div class="score-display">
    <p>Player 1: {{ player1Score }}</p>
    <p>Player 2: {{ player2Score }}</p>
  </div>
</template>

<script
  setup
  lang="ts"
>
defineProps<{
  player1Score: number;
  player2Score: number;
}>();
</script>

<style>
.score-display {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}
</style>