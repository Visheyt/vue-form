<script setup lang="ts">
const isDialogVisible = defineModel<boolean>({
  required: true,
})
</script>

<template>
  <div
    class="wrapper"
    v-if="isDialogVisible"
    @click="isDialogVisible = false"
  >
    <div
      class="content"
      @click.stop
    >
      <slot />
      <button @click="isDialogVisible = false">
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.content {
  max-width: 450px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
