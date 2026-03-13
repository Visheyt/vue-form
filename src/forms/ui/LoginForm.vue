<script setup lang="ts"></script>

<template>
  <form
    class="form"
    @submit.prevent=""
  >
    <h2>Login Form</h2>
    <input
      type="text"
      placeholder="Введите логин"
    />
    <input
      type="password"
      placeholder="Введите пароль"
    />
    <button type="submit">Войти</button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 450px;
  border: 1px solid rgba(194, 194, 194, 0.82);
  padding: 20px;
  border-radius: 8px;
}
input {
  padding: 5px;
  border: none;
  border-bottom: 1px solid rgb(187, 186, 186);
}
input:focus-visible {
  outline: none;
}
</style>
