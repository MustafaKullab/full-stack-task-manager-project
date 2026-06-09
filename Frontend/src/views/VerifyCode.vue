<template>
  <div class="VerifyCode vh-100">
    <div class="container h-100 d-flex flex-column justify-content-center">
      <div class="row justify-content-center text-center">
        <div class="col-md-6">
          <div class="image">
            <img src="/public/verification.png" class="img-fluid" alt="" style="width: 150px" />
          </div>
          <div class="header">
            <div class="title">
              <h1 class="fw-bold">Verify your code</h1>
            </div>
            <div class="details text-muted">
              <p>We have sent a code to your email</p>
            </div>
          </div>
          <form style="width: 400px" class="mx-auto" @submit.prevent="handleWithCode">
            <div class="mb-3">
              <input
                type="text"
                class="form-control text-center mx-auto"
                id="code"
                placeholder="* * * * * *"
                v-model="code"
                :class="errorCodeMessage ? ' is-invalid' : ''"
              />
              <div id="code" class="errorCode invalid-feedback">{{ errorCodeMessage }}</div>
            </div>
            <div class="submitButton">
              <button class="btn btn-primary w-100">Verify</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

//Variable to store the code
const code = ref("");

//Variable to store userId
const userId = route.query.userId;

//Variable to store the error if exist
const errorCodeMessage = ref("");

//Function to handle with code and send it to backend
const handleWithCode = async () => {
  const response = await fetch("http://localhost:5000/verify", {
    method: "POST",
    body: JSON.stringify({ code: code.value, userId }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (data.success) {
    router.push({ name: "homePage" });
  } else {
    errorCodeMessage.value = data.message;
  }
};
</script>
