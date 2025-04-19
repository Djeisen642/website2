<template>
  <div class="error-container">
    <div
      class="glitch"
      data-text="404"
    >404</div>
    <div
      class="subtitle"
      data-text="Page Not Found"
    >Page Not Found</div>
    <div class="description">
      Looks like this page took a wrong turn in the digital realm
    </div>
    <div class="matrix-bg"></div>
    <v-btn
      class="home-button"
      :to="'/'"
      color="primary"
      variant="outlined"
    >
      Return to Safety
    </v-btn>
    <div>
      (Thanks to <a href="https://codeium.com/windsurf">windsurf</a> for building this page from
      scratch)
    </div>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  const container = document.querySelector('.error-container');
  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;

    container.style.setProperty('--mouse-x', x.toString());
    container.style.setProperty('--mouse-y', y.toString());
  });
});
</script>

<style scoped>
.error-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  color: white;
  position: relative;
  overflow: hidden;

  --mouse-x: 0.5;
  --mouse-y: 0.5;
}

.matrix-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%),
      rgba(0, 255, 150, 10%) 0%,
      transparent 50%),
    repeating-linear-gradient(transparent 0%,
      rgba(0, 255, 150, 5%) 50%,
      transparent 100%);
  background-size: 100% 100%, 100% 3px;
  pointer-events: none;
  z-index: 1;
}

.glitch {
  font-size: 8rem;
  font-weight: bold;
  position: relative;
  text-shadow: 0.05em 0 0 rgba(255, 0, 0, 75%),
    -0.025em -0.05em 0 rgba(0, 255, 0, 75%),
    0.025em 0.05em 0 rgba(0, 0, 255, 75%);
  animation: glitch 500ms infinite;
  z-index: 2;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}

.glitch::before {
  animation: glitch 650ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-0.025em, -0.0125em);
  opacity: 0.8;
}

.glitch::after {
  animation: glitch 375ms infinite;
  clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
  transform: translate(0.0125em, 0.025em);
}

.subtitle {
  font-size: 2rem;
  margin-top: 1rem;
  position: relative;
  text-shadow: 0.05em 0 0 rgba(255, 0, 0, 75%),
    -0.025em -0.05em 0 rgba(0, 255, 0, 75%),
    0.025em 0.05em 0 rgba(0, 0, 255, 75%);
  animation: glitch 1s infinite;
  z-index: 2;
}

.description {
  margin: 2rem 0;
  font-size: 1.2rem;
  text-align: center;
  max-width: 80%;
  color: rgba(255, 255, 255, 80%);
  z-index: 2;
  position: relative;
}

.home-button {
  margin-top: 2rem;
  z-index: 2;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 2px;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 75%),
      -0.05em -0.025em 0 rgba(0, 255, 0, 75%),
      -0.025em 0.05em 0 rgba(0, 0, 255, 75%);
  }

  14% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 75%),
      -0.05em -0.025em 0 rgba(0, 255, 0, 75%),
      -0.025em 0.05em 0 rgba(0, 0, 255, 75%);
  }

  15% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 75%),
      0.025em 0.025em 0 rgba(0, 255, 0, 75%),
      -0.05em -0.05em 0 rgba(0, 0, 255, 75%);
  }

  49% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 75%),
      0.025em 0.025em 0 rgba(0, 255, 0, 75%),
      -0.05em -0.05em 0 rgba(0, 0, 255, 75%);
  }

  50% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 75%),
      0.05em 0 0 rgba(0, 255, 0, 75%),
      0 -0.05em 0 rgba(0, 0, 255, 75%);
  }

  99% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 75%),
      0.05em 0 0 rgba(0, 255, 0, 75%),
      0 -0.05em 0 rgba(0, 0, 255, 75%);
  }

  100% {
    text-shadow: -0.025em 0 0 rgba(255, 0, 0, 75%),
      -0.025em -0.025em 0 rgba(0, 255, 0, 75%),
      -0.025em -0.05em 0 rgba(0, 0, 255, 75%);
  }
}

@media (width <=768px) {
  .glitch {
    font-size: 4rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }
}

@media (width <=480px) {
  .glitch {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }
}
</style>