<script setup lang="ts">
const isOpen = defineModel<boolean>({ required: true });
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="drawer-overlay" @click.self="isOpen = false">
        <aside class="drawer-panel">
          <header class="drawer-header">
            <slot name="header"></slot>
            <button class="close-btn" @click="isOpen = false">
              <icon-mdi-close />
            </button>
          </header>

          <section class="drawer-body">
            <slot />
          </section>

          <footer v-if="$slots.footer" class="drawer-footer">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  backdrop-filter: blur(2px);
  padding: 20px;
}

.drawer-panel {
  background: #fff;
  height: 100%;
  min-width: 320px;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 24px;
  gap: 40px;
}
.drawer-header {
  display: flex;
  justify-content: space-between;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
