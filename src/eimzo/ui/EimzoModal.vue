<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { EIMZOClient } from '../model/eimzo-client'
import type { Certificate } from '../model/types'
import Dialog from '@/shared/ui/Dialog.vue'

const eimzo = new EIMZOClient()
const version = ref<number | null>(null)
const certificates = ref<Certificate[]>([])
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    version.value = await eimzo.init()
    certificates.value = await eimzo.listAllUserKeys()
    console.log('Сертификаты:', certificates.value)
  } catch (err: any) {
    errorMsg.value = err.message || String(err)
  }
})

const signContent = async (cert: Certificate) => {
  try {
    const keyId = await eimzo.loadKey(cert)
    const signed = await eimzo.createPkcs7(
      keyId,
      'Hello world',
    )
    console.log('Подпись Base64:', signed)
  } catch (err: any) {
    console.error('Ошибка подписи:', err)
  }
}

const isDialogVisible = defineModel<boolean>({
  required: true,
})
</script>

<template>
  <Dialog v-model="isDialogVisible">
    <h2>Авторизация через E-IMZO</h2>
    <p>Выберите сертификат для входа:</p>

    <ul class="list">
      <li
        v-for="cert in certificates"
        :key="cert.id"
      >
        {{ cert.userType }}
        {{
          cert.userType === 'PHYSICAL' ||
          cert.userType === 'ENTREPRENEUR'
            ? cert.cn?.toUpperCase()
            : cert.org?.toUpperCase()
        }}
        (INN: {{ cert.inn }})
        <button @click="signContent(cert)">
          Подписать
        </button>
      </li>
    </ul></Dialog
  >
</template>

<style>
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 14px;
}
.list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
}
</style>
