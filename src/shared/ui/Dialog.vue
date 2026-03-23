<script setup lang="ts">
const isDialogVisible = defineModel<boolean>({
  required: true,
})
</script>

<template>
  <Transition name="pop">
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
        <button
          class="close-btn"
          @click="isDialogVisible = false"
        >
          Закрыть
        </button>
      </div>
    </div>
  </Transition>
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
  z-index: 1000;
  padding: 10px;
}

.content {
  max-width: 450px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.2s ease;
}

.pop-enter-active .content,
.pop-leave-active .content {
  transition: transform 0.2s
    cubic-bezier(0.34, 1.3, 0.64, 1);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

.pop-enter-from .content,
.pop-leave-to .content {
  transform: scale(0.1);
}
</style>
