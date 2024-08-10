<template>
  <v-container fluid>
    <!-- Code Editor Header -->
    <v-toolbar color="primary">
      <v-toolbar-title>Code Editor - Generated with the help of Codeium</v-toolbar-title>
    </v-toolbar>

    <!-- Code Editor -->
    <v-card class="mt-4">
      <v-card-text>
        <p class="text-body mb-4">
          Enter your javascript code in the text area below and press the Run button. It will
          prettify the code and output the result.
        </p>
        <v-textarea
          v-model="code"
          rows="10"
          outlined
          placeholder="Enter your javascript code"
          @keydown.tab.prevent="handleTabKeyPress"
        />
      </v-card-text>
    </v-card>

    <!-- Code Editor Actions -->
    <v-card-actions>
      <v-btn
        color="primary"
        variant="flat"
        @click="runCode"
      >Run</v-btn>
      <v-btn
        color="secondary"
        @click="clearCode"
      >Clear</v-btn>
      <v-btn
        color="secondary"
        @click="resetCode"
      >Reset</v-btn>
    </v-card-actions>

    <!-- Code Output -->
    <v-card
      v-if="output"
      class="mt-4"
    >
      <v-card-text>
        <pre>{{ output }}</pre>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script
  setup
  lang="ts"
>
import { format } from 'prettier/standalone';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';

const output = ref('');
const code = ref('function run() { // enter your javascript code here\n} \n\nrun();');
formatCode();

/**
 * Executes the code and captures the output.
 *
 * @return {Promise<void>} A promise that resolves when the code execution is complete.
 */
async function runCode() {
  // Execute the code and capture the output
  try {
    await formatCode();
    output.value = eval(code.value);
  } catch (error) {
    output.value = error?.toString() || '';
  }
}

/**
 * Formats the code using the specified options.
 *
 * @return {Promise<void>} A Promise that resolves once the code is formatted.
 */
async function formatCode() {
  code.value = await format(code.value, {
    arrowParens: 'avoid',
    printWidth: 100,
    singleQuote: true,
    semi: true,
    trailingComma: 'all',
    tabWidth: 2,
    parser: 'babel',
    plugins: [prettierPluginBabel, prettierPluginEstree],
  });
}

/**
 * Clears the code and output values.
 *
 * @param {string} code.value - The code value to be cleared.
 * @param {string} output.value - The output value to be cleared.
 */
function clearCode() {
  code.value = '';
  output.value = '';
}

/**
 * Resets the code and output fields.
 *
 * @return {void}
 */
function resetCode() {
  code.value = 'function run() { // enter your javascript code here\n} \n\nrun();';
  output.value = '';
  formatCode();
}

/**
 * Handles the key press event for the tab key.
 *
 * @param {KeyboardEvent} event - The keyboard event object.
 * @return {void} This function does not return anything.
 */
function handleTabKeyPress(event: KeyboardEvent) {
  event.preventDefault();
  const textarea = event.target as HTMLTextAreaElement;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const spaces = '  '; // Two spaces
  const newValue = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
  textarea.value = newValue;
  textarea.selectionStart = start + spaces.length;
  textarea.selectionEnd = start + spaces.length;
  code.value = textarea.value; // Update the v-model
}
</script>
