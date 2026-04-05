<script lang="ts" setup>
import { Drawer } from "@/shared/ui";

const isOpen = defineModel<boolean>({ required: true });
</script>

<template>
  <Drawer v-model="isOpen">
    <template #header>
      <h2>OOO ALEKSEY</h2>
    </template>
    <template #default>
      <div class="content">
        <span>INN: 300687861</span>
        <span>Address: Bektemir District Urta Chirchiq 42</span>
        <span>Tel: +998909967612</span>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
