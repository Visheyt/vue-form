<script lang="ts" setup>
import { Drawer, Select } from "@/shared/ui";
import { ref } from "vue";

const isOpen = defineModel<boolean>({ required: true });

const selectedId = ref<string | null>(null);

const idOptions = [
  { label: "Русский", value: "ru" },
  { label: "O`zbek", value: "uz_latin" },
  { label: "English", value: "en" },
];
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
        <Select v-model="selectedId" :options="idOptions" placeholder="Выберите язык" />
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
