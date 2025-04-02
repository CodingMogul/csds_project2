<template>
  <v-dialog v-model="dialogVisible" persistent max-width="500">
    <v-card>
      <v-card-title class="text-center bg-primary">
        <v-icon icon="mdi-pencil" class="mr-2" color="white" />
        <span class="text-white">Edit Task</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form @submit.prevent="editTask" ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :model-value="description"
                  @update:model-value="$emit('update:description', $event)"
                  label="Description"
                  :rules="[rules.required]"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  :model-value="deadline"
                  @update:model-value="$emit('update:deadline', $event)"
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
                  :model-value="priority"
                  @update:model-value="$emit('update:priority', $event)"
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
        <v-btn color="primary" @click="editTask" prepend-icon="mdi-pencil">
          Edit
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
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([
  "update:visible",
  "update:description",
  "update:deadline",
  "update:priority",
  "messagefromedit",
  "edittaskfinished",
]);

const rules = {
  required: (v) => !!v || "This field is required",
};

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const editTask = () => {
  if (!props.description || !props.deadline || !props.priority) {
    return;
  }

  emit(
    "edittaskfinished",
    props.title,
    props.description,
    props.deadline,
    props.priority
  );

  const tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
  const index = tasks.findIndex((t) => t.title === props.title);

  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      description: props.description,
      deadline: props.deadline,
      priority: props.priority,
      state: "modified",
    };
    localStorage.tasks = JSON.stringify(tasks);
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  emit("messagefromedit", false);
};
</script>

<style scoped>
.v-card-title {
  font-size: 1.25rem;
  padding: 1rem;
}
</style>
