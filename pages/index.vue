<template>
  <div>
    <mcw-button raised @click="toggleOpen">Show dialog</mcw-button>
    <mcw-dialog v-model="open" id="demo-dialog" @mdcdialog:closing="onClosed">
      <mcw-dialog-title>Lorem ipsum dolor</mcw-dialog-title>
      <mcw-dialog-content>
        <div>New text</div>
      </mcw-dialog-content>

      <mcw-dialog-footer>
        <mcw-dialog-button action="dismiss">Dismiss</mcw-dialog-button>
        <mcw-dialog-button action="accept" isDefault>Accept</mcw-dialog-button>
      </mcw-dialog-footer>
    </mcw-dialog>
    <mcw-snackbar-queue ref="snackbar" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { snackbar as vmaSnackbar } from 'vue-material-adapter';
interface Foo {
  open: boolean;
  snackbar?: typeof vmaSnackbar | undefined;
}

let open = ref<boolean>(false);
let snackbar = ref<typeof vmaSnackbar>(undefined);
const toggleOpen = () => (open.value = !open.value);
const onClosed = () => {
  snackbar.value?.handleSnack({
    message: 'Dialog closed',
    dismissAction: true,
    actionText: 'close',
  });
};
</script>
