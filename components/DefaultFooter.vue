<template>
  <v-footer class="px-md-10 footer">
    <p>
      {{ new Date().getFullYear() }} - Jason Suttles
      <span v-if="authStore.user">(<a href="#" @click="auth.logout">logged in</a>)</span>
    </p>
    <v-spacer />
    <v-btn
      v-show="!authStore.user"
      ref="loginBtn"
      icon="$login"
      class="show-on-focus"
      aria-label="Hidden admin login button"
      @click="login"
    />
    <v-btn
      aria-label="GitHub link"
      icon="$github"
      target="_blank"
      class="ml-2"
      href="https://github.com/Djeisen642"
    />
    <v-btn
      aria-label="LinkedIn link"
      icon="$linkedin"
      class="ml-2"
      target="_blank"
      href="https://www.linkedin.com/in/jssuttles/"
    />
    <v-btn
      aria-label="Toggle theme light/dark mode"
      icon="$brightness"
      class="ml-2"
      @click="toggleTheme"
    />
  </v-footer>
</template>
<script setup lang="ts">
import { FirebaseError } from '@firebase/util';

import { useNuxtApp } from '#app';

import { useAuthStore } from '~/store/authStore';
import { Theme, useStore } from '~/store/mainStore.js';
import * as auth from '~/utils/auth';

const { $logError } = useNuxtApp();
const mainStore = useStore();
const authStore = useAuthStore();

const loginBtn = ref();

onMounted(() => {
  authStore.init();
});

async function login() {
  try {
    loginBtn.value.$el.blur();
    await auth.login();
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    if (
      handledError instanceof FirebaseError &&
      handledError.code === 'auth/admin-restricted-operation'
    ) {
      mainStore.setSnackbar('Access restricted!');
    } else {
      mainStore.setSnackbar(handledError.message);
    }
    $logError(handledError);
  }
}

function toggleTheme() {
  mainStore.setTheme(mainStore.theme === Theme.LIGHT, true);
}
</script>
<style scoped lang="scss">
.footer {
  max-height: 80px;
}

.show-on-focus {
  position: absolute;
  left: -10000px;

  &:focus {
    left: 0;
  }
}
</style>
