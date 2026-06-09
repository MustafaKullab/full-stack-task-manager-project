import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home-page",
    },
    {
      name: "homePage",
      path: "/home-page",
      component: () => import("@/views/HomePage.vue"),
      meta: {
        title: "Home Page",
      },
    },
    {
      name: "signup",
      path: "/signup",
      component: () => import("@/views/SignUp.vue"),
      meta: {
        title: "Sign Up",
      },
    },
    {
      name: "verify",
      path: "/verify",
      component: () => import("@/views/VerifyCode.vue"),
      meta: {
        title: "Verify code",
      },
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/LogIn.vue"),
      meta: {
        title: "Log In",
      },
    },
    {
      name: "forgotPassword",
      path: "/forgot-password",
      component: () => import("@/views/ForgotPassword.vue"),
      meta: {
        title: "Forgot Password",
      },
    },
    {
      name: "resetPassword",
      path: "/reset-password",
      component: () => import("@/views/ResetPassword.vue"),
      meta: {
        title: "Reset Password",
      },
    },
  ],
});

export default router;
