import { type User, onAuthStateChanged } from 'firebase/auth';
import { defineStore } from 'pinia';

import { useNuxtApp } from '#app';

const nuxtApp = useNuxtApp();

export type AuthState = {
  user?: User;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: undefined,
  }),
  actions: {
    init() {
      onAuthStateChanged(nuxtApp.$auth, user => {
        this.user = user || undefined;
      });
    },
  },
});
