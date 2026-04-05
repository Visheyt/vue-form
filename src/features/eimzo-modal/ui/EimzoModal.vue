<script lang="ts" setup>
import { eimzoClient, type Certificate } from "@/app/configs/eimzo";
import { Dialog } from "@/shared/ui";
import { ref, onMounted } from "vue";

const version = ref<number | null>(null);
const certificates = ref<Certificate[]>([]);
const errorMsg = ref<string | null>(null);

onMounted(async () => {
  try {
    version.value = await eimzoClient.init();
    certificates.value = await eimzoClient.listAllUserKeys();

    console.log(certificates.value);
  } catch (err: any) {
    errorMsg.value = err.message || String(err);
  }
});

const signContent = async (cert: Certificate) => {
  try {
    const keyId = await eimzoClient.loadKey(cert);
    const signed = await eimzoClient.createPkcs7(keyId, "Hello world");
    console.log("Подпись Base64:", signed);
  } catch (err: any) {
    console.error("Ошибка подписи:", err);
  }
};

const isDialogVisible = defineModel<boolean>({
  required: true,
});

const signContentForToken = async () => {
  try {
    await eimzoClient.listCkcTokens();
    const signed = await eimzoClient.createPkcs7ForToken("Hello world");
    console.log("Подпись с токеном Base64:", signed);
  } catch (err: any) {
    console.error("Ошибка подписи с токеном:", err);
  }
};
</script>

<template>
  <Dialog v-model="isDialogVisible">
    <h2>Авторизация через E-IMZO</h2>
    <p>Выберите сертификат для входа:</p>

    <ul class="list">
      <li v-for="cert in certificates" :key="cert.id">
        <div class="item-content">
          {{ cert.userType }}
          {{
            cert.userType === "PHYSICAL" || cert.userType === "ENTREPRENEUR"
              ? cert.cn?.toUpperCase()
              : cert.org?.toUpperCase()
          }}
          <span v-if="cert.inn">INN: {{ cert.inn }}</span>
          <span v-else> PINFL: {{ cert.pinfl }}</span>
        </div>
        <button @click="signContent(cert)">Подписать</button>
      </li>
      <button @click="signContentForToken()" class="token-button">
        Подписать с помощью токена
      </button>
    </ul></Dialog
  >
</template>

<style>
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 12px;
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
.item-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.token-button {
  max-width: 150px;
  align-self: center;
  padding: 5px 10px;
  font-weight: 600;
}
</style>
