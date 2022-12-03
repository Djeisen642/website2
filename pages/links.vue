<!-- eslint-disable vue/no-v-html -->
<!-- using v-html for links within descriptions -->
<template>
  <v-container fluid>
    <h2>These are links that I have found interesting over the years</h2>
    <p class="d-md-none font-italic">Click on row for more details.</p>
    <v-list lines="three">
      <div v-for="link in links" :key="link.title">
        <v-list-item class="display-large-link-list-item">
          <v-list-item-title>{{ link.title }}</v-list-item-title>
          <v-list-item-subtitle>
            <span v-html="link.description"></span>
          </v-list-item-subtitle>

          <template #append>
            <v-list-item-action>
              <v-btn :href="link.link" target="_blank"> Go see it! </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-list-item class="d-md-none" @click="onLinkClick(link)">
          <v-list-item-title>{{ link.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ link.shortDescription }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider inset />
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
import { ref, useHead } from '#imports';

type LinkDetails = {
  title: string;
  description: string;
  shortDescription: string;
  link: string;
};

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

const links = ref<LinkDetails[]>([
  {
    title: 'Advent of Code',
    shortDescription: 'Daily code challenges created yearly in December',
    description:
      'Daily code challenges created yearly in the month of December. I\'ve attempted to solve them for many years since I was introduced to the challenges by <a href="https://github.com/vasekstebra">Vaclav Stebra</a>. Here are my solution attempts in <a href="https://github.com/Djeisen642/adventofcode2022">2022</a>, <a href="https://github.com/Djeisen642/adventofcode2021">2021</a>, and <a href="https://github.com/Djeisen642/AdventOfCode2018">2018</a>.',
    link: 'https://adventofcode.com/',
  },
  {
    title: 'Regex 101',
    shortDescription: 'How do you test regex? Probably with Regex 101.',
    description:
      'Regex is short for Regular Expression. It can be used to test that a string contains a certain set of characters in a particular order, maybe starting with or ending with that set of characters. Regex 101 allows you to test one regular expression against several strings and explains why it may or may not match.',
    link: 'https://regex101.com/',
  },
]);

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
