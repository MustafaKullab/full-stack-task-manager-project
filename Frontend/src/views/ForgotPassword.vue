<template>
  <div class="ForgotPassword vh-100">
    <div class="container h-100 d-flex flex-column justify-content-center">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="title text-center">
            <h1 class="header">Forgot password?</h1>
            <p class="desc text-muted">
              Enter the email used for your account and we'll send you a code to reset your password
            </p>
          </div>
          <form @submit.prevent="handleWithEmailReset">
            <label class="form-label">Email : </label>
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping"
                ><i class="bi bi-envelope"></i
              ></span>
              <input
                type="text"
                class="form-control"
                placeholder="Email"
                aria-label="Email"
                aria-describedby="addon-wrapping"
                style="box-shadow: none"
                v-model="email"
              />
            </div>
            <button class="btn btn-primary mt-3 w-100" style="border-radius: 3px">Send Code</button>
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

const email = ref("");

const handleWithEmailReset = async () => {
  const response = await fetch("http://localhost:5000/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: email.value }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    router.push({ name: "resetPassword", query: { userId: data.user._id } });
  }
};
</script>
