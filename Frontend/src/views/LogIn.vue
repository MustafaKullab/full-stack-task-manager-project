<template>
  <div class="LogIn vh-100">
    <div class="container h-100 d-flex flex-column justify-content-center">
      <div class="row container-boxes justify-content-center">
        <div
          class="col-md-4 form-side shadow py-5 px-lg-5 px-md-3 d-flex flex-column justify-content-center"
        >
          <div class="header text-center">
            <h1 class="fw-bold text-dark">Sign In</h1>
            <p class="text-muted">Enter your details below to access your tasks.</p>
          </div>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <input
                type="email"
                class="form-control mb-3"
                id="email"
                placeholder="Email"
                v-model="email"
                :class="emailMessage ? ' is-invalid' : ''"
              />
              <div id="code" class="errorCode invalid-feedback">{{ emailMessage }}</div>
            </div>
            <div class="position-relative mb-3">
              <input
                :type="isShowable1 ? 'text' : 'password'"
                class="form-control"
                id="password"
                placeholder="Password"
                v-model="password"
                :class="passwordMessage ? ' is-invalid' : ''"
              />
              <div id="code" class="errorCode invalid-feedback">{{ passwordMessage }}</div>
              <div
                class="btnToShowPass position-absolute end-0 top-0"
                :style="{ marginRight: passwordMessage ? '20px' : '0' }"
              >
                <button class="btn" @click.prevent="toggleShowable1">
                  <div v-if="isShowable1"><i class="bi bi-eye"></i></div>
                  <div v-else><i class="bi bi-eye-slash"></i></div>
                </button>
              </div>
            </div>

            <div class="forgotPasswordBtn text-center my-3">
              <router-link class="text-muted text-decoration-none" :to="{ name: 'forgotPassword' }"
                >Forgot your password?</router-link
              >
            </div>

            <button class="btn btn-primary w-100">Log In</button>
          </form>
        </div>
        <div class="col-md-4 text-side shadow py-5 px-lg-5 px-md-3">
          <div
            class="content d-flex flex-column justify-content-center h-100 text-center py-5 px-md-1 px-lg-3"
          >
            <h1 class="welcomeMessage text-light">Hello Friend!</h1>
            <div class="text">
              <p class="text-light">Enter your personal details and start journey with us</p>
              <div class="loginButton">
                <router-link class="btn btn-outline-light rounded-pill" :to="{ name: 'signup' }"
                  >Sign Up</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

//variables to show or not password
const isShowable1 = ref(false);

//variables to store the informations come from user
const email = ref("");
const password = ref("");

//Variables to display the error messages
const emailMessage = ref("");
const passwordMessage = ref("");

// function to toggle showable 1
const toggleShowable1 = () => {
  isShowable1.value = !isShowable1.value;
};

// Function to handle with create new user and send information to backend
const handleLogin = async () => {
  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    body: JSON.stringify({ email: email.value, password: password.value }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    router.push({ name: "homePage" });
  } else {
    emailMessage.value = data.errors.email;
    passwordMessage.value = data.errors.password;
  }
};
</script>

<style lang="scss" scoped>
.container-boxes {
  height: 520px;
  .text-side {
    background: linear-gradient(to right, #fd492d, #fd463a, #fe434a);
  }
  .form-side {
    input {
      transition: 0.3s;
      box-shadow: none !important;
      &:focus {
        transform: scale(1.02);
      }
    }
  }
}
</style>
