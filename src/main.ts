import { createApp } from "vue";
import App from "./App.vue";
import "./app/styles/styles.css";
import { router } from "@/app/configs/router";

const app = createApp(App);

app.use(router);

app.mount("#app");
