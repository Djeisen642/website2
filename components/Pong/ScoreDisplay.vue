<template>
  <div class="score-display">
    <p>Player 1: {{ playerOneScore }}</p>
    <p>Player 2: {{ playerTwoScore }}</p>
  </div>
</template>

<script
  setup
  lang="ts"
>
defineProps<{
  playerOneScore: number;
  playerTwoScore: number;
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