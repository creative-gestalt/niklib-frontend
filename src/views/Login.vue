<template>
  <v-main>
    <LoginCard />
  </v-main>
</template>

<script lang="ts">
import Vue from "vue";
import LoginCard from "@/components/login/LoginCard.vue";

export default Vue.extend({
  name: "Login",
  components: {
    LoginCard,
  },
});
</script>

<style></style>
