<template>
  <div class="HomePage min-vh-100" style="background: #f1f5f9">
    <div class="container min-vh-100 d-flex flex-column justify-content-between">
      <div
        class="navbar justify-content-center justify-content-sm-between gap-3 w-100 my-2"
        style="
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-radius: 16px;
        "
      >
        <div class="header">
          <h3 class="title">Task Manager</h3>
        </div>
        <div class="links d-flex align-items-center gap-2">
          <router-link v-if="!currentUser" class="btn btn-primary" :to="{ name: 'login' }"
            >Login</router-link
          >
          <router-link v-if="!currentUser" class="btn btn-secondary" :to="{ name: 'signup' }"
            >Signup</router-link
          >
          <button class="btn btn-danger" @click.prevent="logoutUser">Logout</button>
        </div>
      </div>
      <div
        v-if="currentUser"
        class="userDetails p-3 text-center rounded my-3 d-flex align-items-center justify-content-between"
        style="background-color: #e2e8f0; color: #334155"
      >
        <div class="username fs-5">Username : {{ currentUser.username }}</div>
        <img
          :src="`http://localhost:5000/${currentUser.avatar}`"
          class="rounded-pill"
          style="width: 80px; height: 80px; object-fit: cover"
        />
      </div>
      <div class="body flex-grow-1 my-2">
        <div class="addTask">
          <div class="head display-5 text-center" style="color: #334155; font-weight: 300">
            Add New Task
          </div>
          <form class="mx-auto my-3" style="width: 50%" @submit.prevent="handleWithAddTask">
            <input
              type="text "
              placeholder="New Task..."
              class="form-control"
              id="task"
              style="
                box-shadow: none;
                background-color: #ffffff;
                border: 1px solid #cbd5e1;
                color: #111827;
              "
              v-model="content"
              :class="errorTask ? ' is-invalid' : ''"
            />
            <div id="task" class="errorTask invalid-feedback">{{ errorTask }}</div>
            <button
              class="btn btn-primary w-100 mt-3"
              style="background-color: #3b82f6; border: none"
            >
              Add Task
            </button>
          </form>
        </div>
        <div class="tasks mt-5">
          <div
            v-for="task of tasks"
            :key="task._id"
            class="task p-3 rounded-3 d-flex justify-content-between align-items-center mb-3"
            style="
              background: #ffffff;
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
              flex-wrap: wrap;
            "
          >
            <div class="taskContent">{{ task.content }}</div>
            <div class="actions d-flex align-items-center gap-2">
              <div class="updateTask">
                <button
                  class="btn btn-primary"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#${task._id}`"
                  aria-expanded="false"
                  :aria-controls="task._id"
                  style="background-color: #3b82f6"
                >
                  Update
                </button>
              </div>
              <div class="deleteTask">
                <button
                  class="btn btn-danger"
                  @click="deleteTask(task._id)"
                  style="background-color: #ef4444"
                >
                  Delete
                </button>
              </div>
            </div>
            <div class="collapse text-center w-100 mt-4" :id="task._id">
              <form class="py-4 rounded" style="background: #f8fafc; border: 1px solid #dbe4ee">
                <input
                  type="text"
                  class="form-control w-75 mx-auto"
                  placeholder="Update task..."
                  v-model="newContent[task._id]"
                  style="background: #ffffff; border: 1px solid #cbd5e1; color: #334155"
                  :id="task._id"
                />
                <button
                  class="btn btn-dark mt-3 w-50"
                  style="background: #3b82f6; border: none"
                  @click.prevent="updateTask(task._id)"
                >
                  Update Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!currentUser" class="flex-grow-1 mb-5">
        <div class="message text-center mb-5 text-danger pb-5">
          <h1 class="dispaly-2 mb-5">You must be logged in to use this page.</h1>
        </div>
      </div>
      <div
        class="footer p-3 text-center fs-5"
        style="color: #64748b; background-color: transparent"
      >
        &copy; {{ new Date().getFullYear() }} Mustafa kullab | Organize your tasks, simplify your
        day.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { fetchWithRefresh } from "../../public/fetchWithRefresh";
const router = useRouter();
const currentUser = ref(null);

//Variable to store the new task
const content = ref("");

// Variable to store the error come from task
const errorTask = ref("");

//Variable to store the tasks of user
const tasks = ref([]);

// Variable to update the current task
const newContent = ref({});

const getUser = async () => {
  const response = await fetchWithRefresh("http://localhost:5000/homePage", {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  currentUser.value = data.user;
};

const handleWithAddTask = async () => {
  const response = await fetchWithRefresh("http://localhost:5000/addTask", {
    method: "POST",
    body: JSON.stringify({ content: content.value }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    location.reload();
  } else {
    errorTask.value = data.errors.content;
  }
};

// Function to get all user tasks
const getTasks = async () => {
  const response = await fetchWithRefresh("http://localhost:5000/userTasks", {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  tasks.value = data.tasks;
};

// Function to update task
const updateTask = async (id) => {
  const response = await fetchWithRefresh(`http://localhost:5000/updateTask/${id}`, {
    method: "PUT",
    body: JSON.stringify({ newContent: newContent.value[id] }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    location.reload();
  }
};

// Function to delete task
const deleteTask = async (id) => {
  const response = await fetch(`http://localhost:5000/deleteTask/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    location.reload();
  }
};

// Function to logout user
const logoutUser = async () => {
  const response = await fetch("http://localhost:5000/logout", {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    router.push({ name: "login" });
  }
};

onMounted(() => {
  getUser();
  getTasks();
});
</script>

<style lang="scss" scoped>
.navbar {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

input:focus {
  border-color: #3b82f6 !important;
}
</style>
