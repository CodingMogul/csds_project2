<template>
  <v-dialog v-model="dialogVisible" persistent max-width="500">
    <v-card>
      <v-card-title class="text-center bg-primary">
        <v-icon icon="mdi-plus-circle" class="mr-2" color="white" />
        <span class="text-white">Add Task</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form @submit.prevent="addTask" ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  label="Title"
                  :rules="[rules.required, titleExistsRule]"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="description"
                  label="Description"
                  :rules="[rules.required]"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="deadline"
                  label="Deadline"
                  type="date"
                  :rules="[rules.required]"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-radio-group
                  v-model="priority"
                  label="Priority"
                  :rules="[rules.required]"
                  required
                  inline
                >
                  <v-radio label="Low" value="low" color="success" />
                  <v-radio label="Med" value="med" color="warning" />
                  <v-radio label="High" value="high" color="error" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-4 px-6">
        <v-spacer />
        <v-btn
          color="primary"
          @click="addTask"
          :disabled="!isFormValid"
          prepend-icon="mdi-plus"
        >
          Add
        </v-btn>
        <v-btn
          color="error"
          @click="closeDialog"
          prepend-icon="mdi-close"
          variant="outlined"
          class="ml-2"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import Toast from "./Toast.vue";

const toast = useToast();
const form = ref(null);

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "messagefromadd", "taskadded"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const title = ref("");
const description = ref("");
const deadline = ref("");
const priority = ref("");

const rules = {
  required: (v) => !!v || "This field is required",
};

const isFormValid = computed(() => {
  return (
    title.value &&
    description.value &&
    deadline.value &&
    priority.value &&
    !titleExists.value
  );
});

const titleExists = computed(() => {
  if (!title.value) return false;
  const tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
  return tasks.some((task) => task.title === title.value);
});

const titleExistsRule = (value) => {
  if (!value) return "Title is required";
  if (titleExists.value) return "Title already exists";
  return true;
};

const addTask = async () => {
  if (!isFormValid.value) return;

  const tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];

  const task = {
    title: title.value,
    description: description.value,
    deadline: deadline.value,
    priority: priority.value,
    iscomplete: false,
    state: "added",
  };

  tasks.push(task);
  localStorage.tasks = JSON.stringify(tasks);

  toast.success("Task added successfully");
  emit("taskadded");
  closeDialog();
};

const closeDialog = () => {
  title.value = "";
  description.value = "";
  deadline.value = "";
  priority.value = "";
  dialogVisible.value = false;
  emit("messagefromadd", false);
};
</script>

<style scoped>
.v-card-title {
  font-size: 1.25rem;
  padding: 1rem;
}
</style>
