<template>
  <div id="grid">
    <EditDialog
      :title="editDialog.title"
      :description="editDialog.description"
      :priority="editDialog.priority"
      :deadline="editDialog.deadline"
      :visible="editDialog.visible"
      @close="closeEditDialog"
      @messagefromedit="handleEditMessage"
      @edittaskfinished="editCallback"
    />
    <v-layout row wrap>
      <v-flex>
        <v-data-table
          id="taskTable"
          :headers="headers"
          :items="tasks"
          item-key="title"
        >
          <template #items="props">
            <tr
              :active="props.selected"
              @click="props.selected = !props.selected"
            >
              <td class="text-center">
                {{ props.item.title }}
              </td>
              <td class="text-center">
                {{ props.item.description }}
              </td>
              <td class="text-center">
                {{ formatDate(props.item.deadline) }}
              </td>
              <td class="text-center">
                {{ props.item.priority }}
              </td>
              <td class="text-center">
                <v-checkbox
                  primary
                  :value="props.item.iscomplete"
                  @change="completeTask(props.item, $event)"
                />
              </td>
              <td class="text-center">
                <v-btn
                  v-model="props.item.iscomplete"
                  color="primary"
                  type="submit"
                  v-show="!props.item.iscomplete"
                  @click="editTask(props.item.title)"
                >
                  <v-icon>edit_square</v-icon>
                  Update
                </v-btn>
                <br />
                <v-btn
                  color="error"
                  type="submit"
                  @click="deleteTask(props.item.title)"
                >
                  <v-icon>cancel</v-icon>
                  Delete
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import EditDialog from "./Edit.vue";
import Toast from "./Toast.vue";

export default {
  components: {
    EditDialog,
    Toast,
  },
  setup() {
    const modified = ref([]);
    const tasks = ref([]);
    const editDialog = ref({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      visible: false,
    });

    const headers = [
      { text: "Title", value: "title", sortable: false, align: "center" },
      {
        text: "Description",
        value: "description",
        sortable: false,
        align: "center",
      },
      { text: "Deadline", value: "deadline", sortable: false, align: "center" },
      { text: "Priority", value: "priority", sortable: false, align: "center" },
      {
        text: "Is Complete",
        value: "iscomplete",
        sortable: false,
        align: "left",
      },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ];

    const formatDate = (date) => {
      return new Date(date).toLocaleString("en-US").split(",")[0];
    };

    const refreshTasks = () => {
      return localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
    };

    const completeTask = (item, value) => {
      const index = tasks.value.indexOf(item);
      tasks.value[index].iscomplete = value;
      Object.assign(tasks.value[index], item);
    };

    const editTask = (title) => {
      modified.value = [];
      editDialog.value.title = title;
      getTitleDetails(title);
      editDialog.value.visible = true;
    };

    const closeEditDialog = () => {
      editDialog.value.visible = false;
    };

    const handleEditMessage = (dlgVisible) => {
      editDialog.value.visible = dlgVisible;
    };

    const getTitleDetails = (title) => {
      const storedTasks = localStorage.tasks
        ? JSON.parse(localStorage.tasks)
        : [];
      const task = storedTasks.find((t) => t.title === title);

      if (task) {
        editDialog.value = {
          ...editDialog.value,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          priority: task.priority,
        };
      }
    };

    const deleteTask = (title) => {
      const storedTasks = localStorage.tasks
        ? JSON.parse(localStorage.tasks)
        : [];
      const index = storedTasks.findIndex((t) => t.title === title);

      if (index !== -1) {
        storedTasks.splice(index, 1);
        localStorage.tasks = JSON.stringify(storedTasks);
        tasks.value = refreshTasks();
        showToast(`Task ${title} deleted successfully`);
      }
    };

    const showToast = (msg) => {
      const content = {
        component: Toast,
        props: { message: msg },
        listeners: {
          click: () => {
            this.$toast.success(msg, { position: "top-left" });
          },
        },
      };
      this.$toast(content, { position: "bottom-right" });
    };

    watch(modified, (newValue) => {
      if (!newValue.length) return;

      const resultAdded = newValue.filter((val) => val === "added");
      const resultEdited = newValue.filter((val) => val === "modified");

      if (resultAdded.length) showToast("Task added successfully");
      else if (resultEdited.length) showToast("Task updated successfully");

      tasks.value.forEach((task) => {
        task.state = "";
      });
      localStorage.tasks = JSON.stringify(tasks.value);
    });

    onMounted(() => {
      tasks.value = refreshTasks();
      modified.value = tasks.value.map((element) => element.state) || [];
    });

    return {
      modified,
      tasks,
      editDialog,
      headers,
      formatDate,
      completeTask,
      editTask,
      closeEditDialog,
      handleEditMessage,
      deleteTask,
      showToast,
    };
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
