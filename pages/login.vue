<template>
  <v-container fluid>
    <v-card width="500px" class="justify-center align-center">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-text-field label="Email" />
        <v-text-field label="Password" type="password" />
      </v-card-text>
      <v-card-actions><v-btn>Login</v-btn></v-card-actions>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
useHead({
  title: 'Login',
});
</script>
