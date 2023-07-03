<template>
  <v-card>
    <v-card-title>Add New Link!</v-card-title>
    <v-card-text>
      <v-form ref="linkForm">
        <v-text-field
          v-model="newLink.title"
          label="Name"
          aria-label="Link name"
          :rules="[required]"
        />
        <v-text-field
          v-model="newLink.shortDescription"
          label="Short Description"
          :rules="[required, validHtml]"
          aria-label="link short description"
        />
        <div>
          <!--eslint-disable-next-line vue/no-v-html-->
          <p v-html="addTargetBlank(newLink.shortDescription)"></p>
        </div>
        <v-textarea
          v-model="newLink.description"
          label="Description"
          aria-label="link description"
          auto-grow
          counter
          rows="1"
          :rules="[required, validHtml]"
        />
        <div>
          <!--eslint-disable-next-line vue/no-v-html-->
          <p v-html="addTargetBlank(newLink.description)"></p>
        </div>
        <v-text-field
          v-model="newLink.link"
          aria-label="link url"
          label="URL"
          :rules="[required, (input:string) => isValidUrl(input) || 'Not valid url']"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="elevated" :disabled="addingLink" @click="addLink">
        Add Link!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { VForm } from 'vuetify/lib/components/index.mjs';

import { useLinkStore } from '~/store/linkStore';
import { useStore } from '~/store/mainStore';
import type { LinkDetails } from '~/utils/types';

function getNewLink(): LinkDetails {
  return {
    title: '',
    description: '',
    shortDescription: '',
    dateAdded: new Date(),
    link: '',
  };
}

const mainStore = useStore();
const linkStore = useLinkStore();
const linkForm = ref<VForm>();
const newLink = ref<LinkDetails>(getNewLink());
const addingLink = ref(false);

const required = (input: string) => !!input || 'Required';
const validHtml = (input: string) => checkHTML(input) || 'Invalid HTML';

function checkHTML(html: string) {
  const doc = document.createElement('div');
  doc.innerHTML = html;
  const links = doc.querySelectorAll('a');
  for (const link of links) {
    if (!link.href || link.href.includes(location.host) || !isValidUrl(link.href)) return false;
  }
  return doc.innerHTML === html;
}
const urlPattern = new RegExp(URL_REGEX, 'i'); // validate fragment locator

function isValidUrl(urlString: string) {
  return !!urlPattern.test(urlString);
}
function addTargetBlank(html: string) {
  const doc = document.createElement('div');
  doc.innerHTML = html;
  const links = doc.querySelectorAll('a');
  for (const link of links) {
    link.target = 'blank';
  }
  return doc.innerHTML;
}

async function addLink() {
  try {
    const results = await linkForm.value?.validate();
    if (!results?.valid) return;
    addingLink.value = true;

    newLink.value.description = addTargetBlank(newLink.value.description);
    newLink.value.shortDescription = addTargetBlank(newLink.value.shortDescription);
    newLink.value.dateAdded = new Date();

    await linkStore.addlink(newLink.value);
    newLink.value = getNewLink();
    addingLink.value = false;
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  }
}
</script>
