<script setup lang="ts">
import { useUniversalForm } from '@/shared'
import { loginSchema } from '../model/schema'

const { handleSubmit, fields, errors, meta } =
  useUniversalForm(loginSchema)

const submit = handleSubmit((values) => {
  console.log('Validated values:', values)
})
</script>

<template>
  <form
    class="form"
    @submit.prevent="submit"
  >
    <h2>Login Form</h2>
    <input
      v-model="fields.login.value"
      v-bind="fields.login.attrs"
      type="text"
      placeholder="Введите логин"
    />

    <input
      v-model="fields.password.value"
      v-bind="fields.password.attrs"
      type="password"
      placeholder="Введите пароль"
    />
    <div
      class="errors"
      v-if="errors.password || errors.login"
    >
      <p>{{ errors.password }}</p>
      <p>{{ errors.login }}</p>
    </div>
    <button
      type="submit"
      :disabled="!meta.valid"
    >
      Войти
    </button>
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
.errors {
  max-width: 220px;
  font-size: 14px;
  text-align: center;
}
</style>
