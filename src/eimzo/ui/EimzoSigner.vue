<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { EIMZOClient } from '../model/eimzo-client'
import type { Certificate } from '../model/types'

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
</script>

<template>
  <div>
    <h3>E-IMZO версия: {{ version }}</h3>
    <div
      v-if="errorMsg"
      style="color: red"
    >
      {{ errorMsg }}
    </div>
    <ul>
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
    </ul>
  </div>
</template>
