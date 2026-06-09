<template>
  <div class="SignUp vh-100">
    <div class="container h-100 d-flex flex-column justify-content-center">
      <div class="row container-boxes justify-content-center">
        <div class="col-md-4 text-side shadow py-5 px-lg-5 px-md-3">
          <div
            class="content d-flex flex-column justify-content-center h-100 text-center py-5 px-md-1 px-lg-3"
          >
            <h1 class="welcomeMessage text-light">Welcome Back!</h1>
            <div class="text">
              <p class="text-light">
                To keep connected with us, please login with your personal info
              </p>
              <div class="loginButton">
                <router-link class="btn btn-outline-light rounded-pill" :to="{ name: 'login' }"
                  >Login</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 form-side shadow py-5 px-lg-5 px-md-3">
          <div class="header text-center">
            <h1 class="fw-bold text-dark">Create Account</h1>
            <p class="text-muted">To create your account please fill this fields</p>
          </div>
          <form @submit.prevent="handleSignup">
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="Username"
                v-model="username"
                :class="usernameMessage ? ' is-invalid' : ''"
              />
              <div id="code" class="errorCode invalid-feedback">{{ usernameMessage }}</div>
            </div>
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
            <div class="mb-3">
              <label for="file" class="form-label">Your avatar</label>
              <input type="file" class="form-control mb-3" id="file" ref="avatarFile" />
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
            <div class="position-relative mb-3">
              <input
                :type="isShowable2 ? 'text' : 'password'"
                class="form-control"
                id="confPass"
                placeholder="Confirm Password"
                v-model="confPass"
                :class="confPassMessage ? ' is-invalid' : ''"
              />
              <div id="code" class="errorCode invalid-feedback">{{ confPassMessage }}</div>
              <div
                class="btnToShowPass position-absolute end-0 top-0"
                :style="{ marginRight: confPassMessage ? '20px' : '0' }"
              >
                <button class="btn" @click.prevent="toggleShowable2">
                  <div v-if="isShowable2"><i class="bi bi-eye"></i></div>
                  <div v-else><i class="bi bi-eye-slash"></i></div>
                </button>
              </div>
            </div>
            <button class="btn btn-primary w-100">Sign up</button>
          </form>
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
const isShowable2 = ref(false);

//variables to store the informations come from user
const username = ref("");
const email = ref("");
const password = ref("");
const confPass = ref("");
const avatarFile = ref(null);

//Variables to display the error messages
const usernameMessage = ref("");
const emailMessage = ref("");
const passwordMessage = ref("");
const confPassMessage = ref("");

// function to toggle showable 1
const toggleShowable1 = () => {
  isShowable1.value = !isShowable1.value;
};

// function to toggle showable 2
const toggleShowable2 = () => {
  isShowable2.value = !isShowable2.value;
};

//Form data
const formData = new FormData();

// Function to handle with create new user and send information to backend
const handleSignup = async () => {
  formData.append("username", username.value);
  formData.append("email", email.value);
  formData.append("password", password.value);
  formData.append("confPass", confPass.value);
  formData.append("avatar", avatarFile.value.files[0]);

  const response = await fetch("http://localhost:5000/signup", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    router.push({ name: "verify", query: { userId: data.user._id } });
  } else {
    usernameMessage.value = data.errors.username;
    emailMessage.value = data.errors.email;
    passwordMessage.value = data.errors.password;
    confPassMessage.value = data.errors.confPass;
  }
};
</script>

<style lang="scss">
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
