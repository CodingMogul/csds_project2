<template>
  <v-app>
    <v-app-bar app color="primary" density="compact" dark>
      <v-spacer />
      <v-toolbar-title>
        <router-link to="/" class="cursor-pointer">
          <v-icon>mdi-menu</v-icon>
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="blue-accent-2" @click="landingRef?.openAddDialog">
        <v-icon>mdi-plus-circle</v-icon>
        Add
      </v-btn>
    </v-app-bar>

    <v-main>
      <div id="landing">
        <Landing ref="landingRef" />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import Toast from "./components/Toast.vue";
import Landing from "./components/Landing.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const appTitle = ref("FRAMEWORKS");
const landingRef = ref(null);

const showToast = (msg) => {
  const content = {
    component: Toast,
    props: { message: msg },
    listeners: {
      click: () => {
        toast.success(msg, { position: "top-left" });
      },
    },
  };
  toast(content, { position: "bottom-right" });
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}
</style>
