<template>
  <v-card>
    <v-card-title>Add New Link!</v-card-title>
    <v-card-text>
      <v-text-field v-model="newLink.title" label="Name" />
      <v-text-field v-model="newLink.shortDescription" label="Short Description" />
      <v-textarea v-model="newLink.description" label="Description" auto-grow counter rows="1" />
      <v-text-field v-model="newLink.link" label="URL" />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="elevated" :disabled="addingLink" @click="addLink">
        Add Link!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { useLinkStore } from '~/store/linkStore';
import { useStore } from '~/store/mainStore';
import type { LinkDetails } from '~/utils/types';

const mainStore = useStore();
const linkStore = useLinkStore();

function getNewLink(): LinkDetails {
  return {
    title: '',
    description: '',
    shortDescription: '',
    dateAdded: new Date(),
    link: '',
  };
}

const newLink = ref<LinkDetails>(getNewLink());
const addingLink = ref(false);

async function addLink() {
  try {
    addingLink.value = true;
    newLink.value.dateAdded = new Date();
    // TODO add validation
    await linkStore.addlink(newLink.value);
    newLink.value = getNewLink();
    addingLink.value = false;
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  }
}
</script>
