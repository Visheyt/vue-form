<script lang="ts" setup>
import { EimzoModal } from "@/features/eimzo-modal";
import { LoginForm } from "@/features/login-form";
import { ref } from "vue";

const isDialogVisible = ref(false);

const toggleDialog = () => {
  isDialogVisible.value = !isDialogVisible.value;
};
</script>

<template>
  <LoginForm />
  <EimzoModal v-model="isDialogVisible" />
  <button @click="toggleDialog">Login via EIMZO</button>
</template>

<style scoped></style>
