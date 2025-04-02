<template>
  <v-app>
    <AddDialog
      :visible="addDialogVisible"
      @close="closeAddDialog"
      @messagefromadd="handleAddMessage"
    />
    <v-toolbar app color="primary" dense dark>
      <v-spacer />
      <v-toolbar-title>
        <router-link to="/" tag="span" class="cursor-pointer">
          <v-icon>menu</v-icon>
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="blue accent-2" type="submit" tonal @click="openAddDialog">
        <v-icon>add_circle</v-icon>
        Add
      </v-btn>
    </v-toolbar>

    <v-content>
      <div id="landing">
        <Landing />
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { ref, computed } from "vue";
import AddDialog from "./components/Add.vue";
import Toast from "./components/Toast.vue";
import Landing from "./components/Landing.vue";

export default {
  name: "App",
  components: {
    AddDialog,
    Landing,
    Toast,
  },
  setup() {
    const addDialogVisible = ref(false);
    const counter = ref(0);
    const appTitle = ref("FRAMEWORKS");

    const openAddDialog = () => {
      addDialogVisible.value = true;
    };

    const closeAddDialog = () => {
      addDialogVisible.value = false;
    };

    const handleAddMessage = (dlgVisible) => {
      addDialogVisible.value = dlgVisible;
      refreshTasks();
    };

    const refreshTasks = () => {
      return localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
    };

    const showToast = () => {
      const content = {
        component: Toast,
        props: { counter: counter.value },
        listeners: {
          click: () => {
            counter.value++;
            this.$toast.success(`Toast with counter ${counter.value}`, {
              position: "top-left",
            });
          },
        },
      };
      this.$toast(content, { position: "bottom-right" });
    };

    return {
      addDialogVisible,
      counter,
      appTitle,
      openAddDialog,
      closeAddDialog,
      handleAddMessage,
      refreshTasks,
      showToast,
    };
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
