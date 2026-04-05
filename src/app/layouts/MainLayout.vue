<script lang="ts" setup>
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { Profile } from "@/widgets/profile";
import { ref } from "vue";

const isProfileVisible = ref(false);
</script>

<template>
  <Header @open-profile="isProfileVisible = true" />
  <Profile v-model="isProfileVisible" />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped></style>
