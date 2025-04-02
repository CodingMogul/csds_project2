<template>
  <v-dialog persistent="false" v-model="show" max-width="290px">
    <v-card>
      <div style="background-color: #2074d4">
        <v-card-title class="justify-center white--text">
          <v-icon class="white--text">edit_square</v-icon>
          Edit Task
          <v-spacer></v-spacer>
        </v-card-title>
      </div>
      <v-flex xs12 sm6 offset-sm3>
        <form>
          <v-layout column>
            <v-flex>
              <v-text-field
                v-model="description"
                name="description"
                label="Description"
                id="description"
                type="text"
                :rules="descriptionrules"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model="deadline"
                name="deadline"
                label="Deadline"
                id="deadline"
                type="date"
                :rules="deadlinerules"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-radio-group
                inline
                v-model="priority"
                name="priority"
                label="Priority"
                id="priority"
                type="radio"
                :rules="priorityrules"
                required
              >
                <v-radio label="Low" value="low"></v-radio>
                <v-radio label="Med" value="med"></v-radio>
                <v-radio label="High" value="high"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-card-actions>
              <v-btn color="primary" type="submit" @click="editTask()">
                <v-icon>edit_square</v-icon>
                Edit</v-btn
              >
              <v-btn color="error" type="submit" @click="close()">
                <v-icon>block</v-icon>
                Cancel</v-btn
              >
            </v-card-actions>
          </v-layout>
        </form>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>
import Toast from "./Toast.vue";

export default {
  data() {
    return {
      descriptionrules: [(v) => !!v || "Description is required"],
      deadlinerules: [(v) => !!v || "Deadline is required"],
      priorityrules: [(v) => !!v || "Priority is required"],
    };
  },
  props: ["visible", "title", "description", "deadline", "priority"],
  components: {
    Toast,
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        this.props.visible = value.visible;
        this.getTitleDetails(this.localTitle);
      },
    },
  },
  watch: {
    visible: function () {
      this.resetVisible();
    },
  },
  methods: {
    resetVisible() {
      this.$emit("messagefromedit", this.visible);
    },
    getTitleDetails(tt) {
      var tasks = [];
      if (localStorage.tasks !== undefined)
        tasks = JSON.parse(localStorage.tasks);

      var result = {};
      console.log(tasks.length);
      for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i].title + "," + tt);
        if (tasks[i].title === tt) {
          result = tasks[i];
          break;
        }
      }

      this.props.title = result.title;
      this.props.description = result.description;
      this.props.deadline = result.deadline;
      this.props.priority = result.priority;
    },
    editTask() {
      this.$emit(
        "edittaskfinished",
        this.title,
        this.description,
        this.deadline,
        this.priority
      );

      if (
        this.description === "" ||
        this.deadline === "" ||
        this.priority === ""
      ) {
        return;
      }
      var tasks = [];
      if (localStorage.tasks != null) {
        tasks = JSON.parse(localStorage.tasks);
      }
      console.log(tasks);
      var index = 0;
      for (index = 0; index < tasks.length; index++) {
        if (tasks[index].title === this.title) {
          break;
        }
      }

      console.log("index-" + index);
      tasks[index].description = this.description;
      tasks[index].deadline = this.deadline;
      tasks[index].priority = this.priority;
      tasks[index].state = "modified";
      var t = JSON.stringify(tasks);
      localStorage.tasks = t;
    },
    showToast(msg) {
      const content = {
        component: Toast,
        props: {
          message: msg,
        },
        listeners: {
          click: () => {
            this.$toast.success(msg, { position: "top-left" });
          },
        },
      };
      this.$toast(content, { position: "bottom-right" });
    },
    close() {
      this.visible = false;
    },
    refreshTasks() {
      if (localStorage.tasks != null) {
        return JSON.parse(localStorage.tasks);
      }
      return [];
    },
  },
  mounted() {
    this.tasks = this.refreshTasks();
  },
};
</script>