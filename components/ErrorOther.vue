<template>
  <div class="error-container">
    <div class="glitch">
      {{ error.statusCode }}
    </div>
    <div class="subtitle">
      {{ error.message || 'Unexpected Error' }}
    </div>
    <div class="description">
      Something went wrong in the digital realm. Our systems are experiencing a temporary glitch.
    </div>
    <div class="matrix-bg"></div>
    <v-btn
      color="primary"
      class="return-btn"
      @click="navigateHome"
    >
      Return to Safety
    </v-btn>
    <div>
      (Thanks to <a href="https://codeium.com/windsurf">windsurf</a> for building this page from
      scratch)
    </div>
    <template v-if="error.stack">
      <v-btn
        color="secondary"
        class="details-btn"
        @click="toggleErrorDetails"
      >
        {{ showErrorDetails ? 'Hide' : 'Show' }} Error Details
      </v-btn>
      <div
        v-if="showErrorDetails"
        class="error-details"
      >
        <pre>{{ error.stack }}</pre>
      </div>
    </template>

  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const showErrorDetails = ref(false);

defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
});

const router = useRouter();

function navigateHome() {
  router.push('/');
}

function toggleErrorDetails() {
  showErrorDetails.value = !showErrorDetails.value;
}

onMounted(() => {
  const container = document.querySelector('.error-container') as HTMLElement;

  container.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
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
  font-size: 1.2rem;
  text-align: center;
  max-width: 80%;
  color: rgba(255, 255, 255, 80%);
  z-index: 2;
  position: relative;
}

.return-btn,
.details-btn {
  margin-top: 2rem;
  z-index: 2;
}

.error-details {
  margin-top: 1rem;
  max-width: 80%;
  max-height: 300px;
  overflow-y: auto;
  color: rgba(0, 255, 150, 75%);
  background-color: rgba(0, 0, 0, 70%);
  padding: 1rem;
  border-radius: 8px;
  z-index: 2;
  text-align: left;
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