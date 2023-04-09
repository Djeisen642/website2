import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useNuxtApp } from '#app';

const { $auth } = useNuxtApp();

export async function login() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup($auth, provider);
}

export async function logout() {
  await $auth.signOut();
}
