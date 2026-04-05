<script lang="ts" setup>
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped></style>
