import { createApp } from "vue";
import App from "./App.vue";
import "./app/styles/styles.css";
import { router } from "@/app/configs/router";
import { Icon } from "@iconify/vue";

const app = createApp(App);

app.use(router);

app.component("Icon", Icon);

app.mount("#app");
