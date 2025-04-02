<template>
  <v-dialog persistent="false" lazy-validation v-model="show" max-width="290px">
    <v-card>
      <div style="background-color: #2074d4">
        <v-card-title class="justify-center white--text">
          <v-icon class="white--text">add_circle</v-icon>
          Add Task
          <v-spacer></v-spacer>
        </v-card-title>
      </div>
      <v-flex xs12 sm6 offset-sm3>
        <form>
          <v-layout column>
            <v-flex>
              <v-text-field
                v-model="title"
                name="title"
                label="Title"
                id="title"
                type="text"
                :rules="[titlerules, TitleExistsRule]"
                required
              ></v-text-field>
            </v-flex>
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
                label="Priority"
                v-model="priority"
                name="priority"
                id="priority"
                :rules="priorityrules"
                required
              >
                <v-radio label="Low" value="low"></v-radio>
                <v-radio label="Med" value="med"></v-radio>
                <v-radio label="High" value="high"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-card-actions>
              <v-btn color="primary" type="submit" @click="addTask">
                <v-icon>add_circle</v-icon>
                Add</v-btn
              >
              <v-btn color="error" type="reset" @click="close()">
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
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        //     console.log('entering set value');
        this.props.visible = value.visible;
      },
    },
  },
  watch: {
    visible: function () {
      this.resetVisible();
    },
  },
  name: "Add",
  data() {
    return {
      title: "",
      description: "",
      deadline: "",
      priority: "",
      titlerules: [(v) => !!v || "Title is required"],
      descriptionrules: [(v) => !!v || "Description is required"],
      deadlinerules: [(v) => !!v || "Deadline is required"],
      priorityrules: [(v) => !!v || "Priority is required"],
    };
  },
  components: {
    Toast,
  },

  methods: {
    resetVisible() {
      //     alert("entering watch - " + this.visible);

      this.$emit("messagefromadd", this.visible);
    },
    created() {
      alert("entering add.vue");
    },
    checkTitleExists(title) {
      var tasks = [];
      if (localStorage.tasks !== undefined)
        tasks = JSON.parse(localStorage.tasks);

      return tasks.findIndex((e) => e.title === title);
    },
    addTask(event) {
      var tasks = [];
      if (
        this.title === "" ||
        this.description === "" ||
        this.deadline === "" ||
        this.priority === "" ||
        this.checkTitleExists(this.title) >= 0
      ) {
        //event.preventDefault();
        //event.returnValue = false;
        //event.stopImmediatePropagation();
        return;
      }

      if (localStorage.tasks != null) {
        tasks = JSON.parse(localStorage.tasks);
      }

      var task = {
        title: this.title,
        description: this.description,
        deadline: this.deadline,
        priority: this.priority,
        iscomplete: 0,
        state: "added",
      };

      tasks[tasks.length] = task;
      var t = JSON.stringify(tasks);
      localStorage.tasks = t;
    },
    TitleExistsRule() {
      if (this.title === "") {
        return "Title is required";
      } else if (this.checkTitleExists(this.title) >= 0) {
        return "Title already exists";
      }
    },
    close() {
      this.title = "";
      this.descripiton = "";
      this.deadline = "";
      this.priority = "";
      //  alert("entering close");
      this.visible = false;
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
  },
};
</script>
