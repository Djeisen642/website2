import { defineStore } from 'pinia';

import { isDarkSystemPreference, setupWatchForSystemPreference } from '#imports';

import { disableWatchForSystemPreference } from '~/composables/themeSystemPreference';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

type State = {
  theme: Theme;
  snackbar: {
    snackbar: boolean;
    text: string;
  };
};

let startingTheme = Theme.DARK;
if (localStorage.getItem('theme')) {
  startingTheme = localStorage.getItem('theme') as Theme;
} else {
  startingTheme = isDarkSystemPreference() ? Theme.DARK : Theme.LIGHT;
}

export const useStore = defineStore('main', {
  state: (): State => ({
    theme: startingTheme,
    snackbar: {
      snackbar: false,
      text: '',
    },
  }),
  actions: {
    setTheme(toDark: boolean, persist?: boolean) {
      this.theme = toDark ? Theme.DARK : Theme.LIGHT;
      if (persist) {
        localStorage.setItem('theme', this.theme);
        disableWatchForSystemPreference();
      }
    },
    setSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.snackbar = true;
    },
  },
});

const mainStore = useStore();

if (!localStorage.getItem('theme')) {
  setupWatchForSystemPreference(mainStore.setTheme);
}
