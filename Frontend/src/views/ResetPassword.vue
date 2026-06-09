<template>
  <div class="ResetPassword vh-100">
    <div class="container h-100 d-flex flex-column justify-content-center">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="header text-center">
            <h1 class="title">Reset password</h1>
            <p class="text-muted small">
              Please enter your password reset code and set a new password
            </p>
          </div>
          <form @submit.prevent="hanldeResetPassword">
            <div class="mb-3">
              <label for="code" class="form-label text-uppercase small fw-bold">Code </label>
              <input
                type="text"
                class="form-control text-center"
                id="code"
                placeholder="* * * * * *"
                style="box-shadow: none"
                v-model="code"
                :class="codeErrorMessage ? ' is-invalid' : ''"
              />
              <div id="code" class="errorCode invalid-feedback">{{ codeErrorMessage }}</div>
            </div>
            <div class="position-relative mb-3">
              <label for="password" class="form-label text-uppercase small fw-bold"
                >New password
              </label>
              <input
                :type="isShowable1 ? 'text' : 'password'"
                class="form-control"
                id="password"
                placeholder="eg. A123456z"
                style="box-shadow: none"
                v-model="newPassword"
                :class="passwordErrorMessage ? ' is-invalid' : ''"
              />
              <div id="password" class="errorCode invalid-feedback">{{ passwordErrorMessage }}</div>
              <div
                class="btnToShowPass position-absolute end-0"
                style="top: 30px"
                :style="{ marginRight: passwordErrorMessage ? '20px' : '0' }"
              >
                <button class="btn" @click.prevent="toggleShowable1">
                  <div v-if="isShowable1"><i class="bi bi-eye"></i></div>
                  <div v-else><i class="bi bi-eye-slash"></i></div>
                </button>
              </div>
            </div>
            <div class="position-relative mb-3">
              <label for="confPassword" class="form-label text-uppercase small fw-bold"
                >Re-type new password
              </label>
              <input
                :type="isShowable2 ? 'text' : 'password'"
                class="form-control"
                id="confPassword"
                placeholder="eg. A123456z"
                style="box-shadow: none"
                v-model="retypePassword"
                :class="confPasswordErrorMessage ? ' is-invalid' : ''"
              />
              <div id="password" class="errorCode invalid-feedback">
                {{ confPasswordErrorMessage }}
              </div>
              <div
                class="btnToShowPass position-absolute end-0"
                style="top: 30px"
                :style="{ marginRight: confPasswordErrorMessage ? '20px' : '0' }"
              >
                <button class="btn" @click.prevent="toggleShowable2">
                  <div v-if="isShowable2"><i class="bi bi-eye"></i></div>
                  <div v-else><i class="bi bi-eye-slash"></i></div>
                </button>
              </div>
            </div>
            <div class="confirmButton text-end">
              <button class="btn btn-primary ms-auto">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

//variables to show or not password
const isShowable1 = ref(false);
const isShowable2 = ref(false);

// Variables to Store new passwords
const code = ref("");
const newPassword = ref("");
const retypePassword = ref("");
const userId = route.query.userId;

//Error messages
const codeErrorMessage = ref("");
const passwordErrorMessage = ref("");
const confPasswordErrorMessage = ref("");

// function to toggle showable 1
const toggleShowable1 = () => {
  isShowable1.value = !isShowable1.value;
};

// function to toggle showable 2
const toggleShowable2 = () => {
  isShowable2.value = !isShowable2.value;
};

const hanldeResetPassword = async () => {
  const response = await fetch("http://localhost:5000/reset-password", {
    method: "POST",
    body: JSON.stringify({
      userId,
      code: code.value,
      newPassword: newPassword.value,
      retypePassword: retypePassword.value,
    }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    router.push({ name: "login" });
  } else {
    codeErrorMessage.value = data.errors.code;
    passwordErrorMessage.value = data.errors.newPassword;
    confPasswordErrorMessage.value = data.errors.confPass;
  }
};
</script>
