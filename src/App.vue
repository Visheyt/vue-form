<script setup lang="ts">
import { ref } from 'vue'

import { LoginForm } from './forms'
import { EimzoModal } from './eimzo'

const isDialogVisible = ref(false)

const toggleDialog = () => {
  isDialogVisible.value = !isDialogVisible.value
}
</script>

<template>
  <LoginForm />
  <EimzoModal v-model="isDialogVisible" />
  <button @click="toggleDialog">Login via EIMZO</button>
</template>

<style scoped></style>
