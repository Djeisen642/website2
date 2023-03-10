<!-- eslint-disable vue/no-v-html -->
<!-- using v-html for links within descriptions -->
<template>
  <v-container fluid>
    <h2>These are links that I have found interesting over the years</h2>
    <p class="d-md-none font-italic">Click on row for more details.</p>
    <v-list lines="three">
      <div v-for="link in links" :key="link.title">
        <v-list-item class="display-large-link-list-item">
          <template #prepend>
            <v-avatar color="primary">
              <v-img v-if="link.imageExists" cover :src="link.link + '/favicon.ico'" />
              <span v-else class="text-h5">{{ link.title.substring(0, 1).toUpperCase() }}</span>
            </v-avatar>
          </template>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
          <v-list-item-subtitle>
            <span v-html="link.description"></span>
          </v-list-item-subtitle>

          <template #append>
            <v-list-item-action>
              <v-btn :href="link.link" target="_blank"> Go see it!</v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-list-item class="d-md-none" @click="onLinkClick(link)">
          <v-list-item-title>{{ link.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ link.shortDescription }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider inset class="display-large-link-list-item" />
        <v-divider class="d-md-none" />
      </div>
    </v-list>
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
import { getDocs } from '@firebase/firestore';

import { useNuxtApp } from '#app';
import { ref, useHead } from '#imports';

import { LinkDetails } from '~/utils/types';
import { checkIfImageExists } from '~~/utils/helpers';

const { $collections, $logError } = useNuxtApp();

const dialog = ref(false);
const selectedLink = ref<LinkDetails>({
  title: '',
  description: '',
  shortDescription: '',
  link: '',
});

const onLinkClick = (link: LinkDetails) => {
  selectedLink.value = link;
  dialog.value = true;
};

const links = ref<LinkDetails[]>([]);

try {
  const querySnapshot = await getDocs($collections.links);
  querySnapshot.forEach(async doc => {
    const linkObject = doc.data();
    linkObject.imageExists = await checkIfImageExists(`${linkObject.link}/favicon.ico`);
    links.value.push(linkObject);
  });
} catch (error) {
  $logError(error instanceof Error ? error : new Error('Unexpected error'));
}

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
