<script lang="ts" setup>
import { Logo } from "@/shared/ui";
</script>

<template>
  <header class="header">
    <Logo />
    <nav>Tuda Suada asdas</nav>
    <button class="button">
      <span>OOO "Aleksey"</span>
      <icon-mdi-keyboard-arrow-down />
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  width: 100%;
}
.button {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
