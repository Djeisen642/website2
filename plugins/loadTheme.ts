import { setupWatchForSystemPreference } from '#imports';

import { useStore } from '@/store/mainStore';

export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const mainStore = useStore();

    if (!localStorage.getItem('theme')) {
      setupWatchForSystemPreference(mainStore.setTheme);
    }
  },
});
