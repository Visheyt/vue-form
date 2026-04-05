<script setup lang="ts" generic="T">
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from "vue";

interface SelectOption<V> {
  label: string;
  value: V;
}

interface Props {
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Выберите значение",
  disabled: false,
});

const model = defineModel<T | null>({ required: true });

const isOpen = ref(false);
const selectRef = useTemplateRef<HTMLDivElement>("select");

const selectedLabel = computed(() => {
  return props.options.find((opt) => opt.value === model.value)?.label ?? "";
});

const toggle = () => {
  if (!props.disabled) isOpen.value = !isOpen.value;
};

const select = (option: SelectOption<T>) => {
  model.value = option.value;
  isOpen.value = false;
};

const onOutsideClick = (e: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener("click", onOutsideClick));
onUnmounted(() => window.removeEventListener("click", onOutsideClick));
</script>

<template>
  <div class="custom-select" ref="selectRef" :class="{ 'is-disabled': disabled }">
    <div class="select-trigger" :class="{ 'is-active': isOpen }" @click="toggle">
      <span v-if="selectedLabel" class="selected-text">{{ selectedLabel }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>

      <div class="icon" :class="{ 'is-flipped': isOpen }">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
    </div>

    <Transition name="slide-fade">
      <ul v-if="isOpen" class="select-dropdown">
        <li
          v-for="option in options"
          :key="option.label"
          class="select-item"
          :class="{ 'is-selected': option.value === model }"
          @click="select(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: inherit;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-trigger:hover {
  border-color: #9ca3af;
}
.select-trigger.is-active {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.placeholder {
  color: #9ca3af;
}
.icon {
  transition: transform 0.2s ease;
  display: flex;
}
.icon.is-flipped {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 4px;
  list-style: none;
  z-index: 50;
}

.select-item {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.select-item:hover {
  background: #f3f4f6;
}
.select-item.is-selected {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
