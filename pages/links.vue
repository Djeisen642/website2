<!-- eslint-disable vue/no-v-html -->
<!-- using v-html for links within descriptions -->
<template>
  <v-container fluid>
    <h2>These are links that I have found interesting over the years</h2>
    <p class="d-md-none font-italic">Click on row for more details.</p>
    <v-sheet v-if="!linkStore.loaded" class="d-flex justify-center align-center" height="300">
      <v-progress-circular
        indeterminate
        size="100"
        width="10"
        color="primary"
        bg-color="secondary"
      />
    </v-sheet>
    <v-list lines="three" role="list">
      <div v-for="(link, index) in linkStore.links" :key="link.title" role="listitem">
        <v-list-item class="display-large-link-list-item">
          <template #prepend>
            <v-avatar color="primary">
              <v-img
                v-if="link.imageExists"
                cover
                :src="link.link + '/favicon.ico'"
                aria-hidden="true"
              />
              <span v-else class="text-h5">{{ link.title.substring(0, 1).toUpperCase() }}</span>
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ link.title }}
            <a v-if="authStore.user" href="#" @click="deleteLink(link)"> Delete me </a>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span v-html="link.description"></span>
          </v-list-item-subtitle>
          <template #append>
            <v-list-item-action>
              <v-btn :href="link.link" target="_blank" :aria-label="`Go to ${link.title}`">
                Go see it!
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-list-item class="d-md-none" role="listitem" @click="onLinkClick(link)">
          <template #prepend>
            <v-avatar color="primary">
              <v-img v-if="link.imageExists" cover :src="link.link + '/favicon.ico'" />
              <span v-else class="text-h5">{{ link.title.substring(0, 1).toUpperCase() }}</span>
            </v-avatar>
          </template>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ link.shortDescription }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider
          v-if="index !== linkStore.links.length - 1"
          inset
          class="display-large-link-list-item"
        />
        <v-divider v-if="index !== linkStore.links.length - 1" class="d-md-none" />
      </div>
    </v-list>
    <add-link-section v-if="authStore.user" />
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          {{ selectedLink.title }}
        </v-card-title>
        <v-card-text>
          <span v-html="selectedLink.description"></span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" variant="elevated" @click="dialog = false">Close Dialog</v-btn>
          <v-btn color="primary" :href="selectedLink.link" target="_blank" variant="elevated">
            Go see it!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, useHead } from '#imports';

import { useAuthStore } from '~/store/authStore';
import { useLinkStore } from '~/store/linkStore';
import { useStore } from '~/store/mainStore';
import type { LinkDetails } from '~/utils/types';

const mainStore = useStore();
const linkStore = useLinkStore();
const authStore = useAuthStore();

function getNewLink(): LinkDetails {
  return {
    title: '',
    description: '',
    shortDescription: '',
    dateAdded: new Date(),
    link: '',
  };
}

const dialog = ref(false);
const selectedLink = ref<LinkDetails>(getNewLink());

function onLinkClick(link: LinkDetails) {
  selectedLink.value = link;
  dialog.value = true;
}

async function deleteLink(link: LinkDetails) {
  try {
    await linkStore.deleteLink(link);
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  }
}

linkStore.init();

useHead({
  title: 'Interesting links!',
});
</script>
<style scoped lang="scss">
// wanted to use grid breakpoints... but it isn't easy
$md-max-width: 960px;

@media screen and (max-width: $md-max-width) {
  .display-large-link-list-item {
    display: none;
  }
}
</style>
