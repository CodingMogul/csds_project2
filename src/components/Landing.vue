<template>
  <v-container fluid>
    <EditDialog
      v-model:visible="editDialog.visible"
      v-model:title="editDialog.title"
      v-model:description="editDialog.description"
      v-model:priority="editDialog.priority"
      v-model:deadline="editDialog.deadline"
      @messagefromedit="handleEditMessage"
      @edittaskfinished="editCallback"
      @taskadded="handleTaskAdded"
    />

    <AddDialog
      v-model:visible="addDialog.visible"
      @messagefromadd="handleAddMessage"
      @taskadded="handleTaskAdded"
    />

    <v-card class="elevation-2">
      <v-data-table
        :headers="headers"
        :items="tasks"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>{{ formatDate(item.deadline) }}</td>
            <td>
              <v-chip
                :color="getPriorityColor(item.priority)"
                text-color="white"
                size="small"
              >
                {{ item.priority }}
              </v-chip>
            </td>
            <td>
              <v-checkbox
                v-model="item.iscomplete"
                @update:model-value="completeTask(item, $event)"
                color="success"
                hide-details
              />
            </td>
            <td>
              <v-btn
                v-show="!item.iscomplete"
                color="primary"
                size="small"
                class="mr-2"
                @click="editTask(item.title)"
                prepend-icon="mdi-pencil"
              >
                Edit
              </v-btn>
              <v-btn
                color="error"
                size="small"
                @click="deleteTask(item.title)"
                prepend-icon="mdi-delete"
              >
                Delete
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import EditDialog from "./Edit.vue";
import AddDialog from "./Add.vue";
import Toast from "./Toast.vue";

const toast = useToast();
const modified = ref([]);
const tasks = ref([]);
const addDialog = ref({
  visible: false,
});
const editDialog = ref({
  title: "",
  description: "",
  deadline: "",
  priority: "",
  visible: false,
});

const headers = [
  { title: "Title", key: "title", align: "start" },
  { title: "Description", key: "description", align: "start" },
  { title: "Deadline", key: "deadline", align: "start" },
  { title: "Priority", key: "priority", align: "start" },
  { title: "Complete", key: "iscomplete", align: "center" },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const getPriorityColor = (priority) => {
  const colors = {
    low: "success",
    med: "warning",
    high: "error",
  };
  return colors[priority] || "grey";
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US").split(",")[0];
};

const refreshTasks = () => {
  return localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
};

const handleTaskAdded = () => {
  tasks.value = refreshTasks();
  showToast("Task added successfully");
};

const completeTask = (item, value) => {
  const index = tasks.value.indexOf(item);
  tasks.value[index].iscomplete = value;
  localStorage.tasks = JSON.stringify(tasks.value);
  showToast(value ? "Task completed!" : "Task uncompleted");
};

const editTask = (title) => {
  modified.value = [];
  editDialog.value.title = title;
  getTitleDetails(title);
  editDialog.value.visible = true;
};

const handleEditMessage = (dlgVisible) => {
  editDialog.value.visible = dlgVisible;
};

const editCallback = (title, description, deadline, priority) => {
  const index = tasks.value.findIndex((t) => t.title === title);
  if (index !== -1) {
    tasks.value[index] = {
      ...tasks.value[index],
      description,
      deadline,
      priority,
      state: "modified",
    };
    localStorage.tasks = JSON.stringify(tasks.value);
    editDialog.value.visible = false;
    showToast("Task updated successfully");
  }
};

const getTitleDetails = (title) => {
  const storedTasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
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
  const storedTasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
  const index = storedTasks.findIndex((t) => t.title === title);

  if (index !== -1) {
    storedTasks.splice(index, 1);
    localStorage.tasks = JSON.stringify(storedTasks);
    tasks.value = refreshTasks();
    showToast(`Task ${title} deleted successfully`);
  }
};

const showToast = (msg) => {
  toast.success(msg);
};

const openAddDialog = () => {
  addDialog.value.visible = true;
};

const handleAddMessage = (dlgVisible) => {
  addDialog.value.visible = dlgVisible;
};

watch(modified, (newValue) => {
  if (!newValue.length) return;

  const resultAdded = newValue.filter((val) => val === "added");
  const resultEdited = newValue.filter((val) => val === "modified");

  if (resultAdded.length) {
    tasks.value = refreshTasks();
    showToast("Task added successfully");
  } else if (resultEdited.length) showToast("Task updated successfully");

  tasks.value.forEach((task) => {
    task.state = "";
  });
  localStorage.tasks = JSON.stringify(tasks.value);
});

onMounted(() => {
  tasks.value = refreshTasks();
  modified.value = tasks.value.map((element) => element.state) || [];
});

defineExpose({
  openAddDialog,
});
</script>

<style scoped>
.v-data-table {
  width: 100%;
}

.v-data-table :deep(th) {
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-data-table :deep(td) {
  padding: 8px 16px !important;
}
</style>
