<template>
  <v-container>
    <v-overlay v-if="overlay">
      <v-progress-circular indeterminate size="46"></v-progress-circular>
    </v-overlay>
    <v-card class="mx-auto mt-16" color="teal darken-2" width="500">
      <v-card-title class="black--text"> Login</v-card-title>
      <v-container>
        <v-form value>
          <v-text-field
            v-model="email"
            dark
            placeholder="Email"
            type="email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            clearable
            dark
            placeholder="Password"
            type="password"
            @keyup.enter="loginWithFirebaseAuth"
          ></v-text-field>
        </v-form>
        <p style="color: red">{{ error }}</p>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="black--text" text @click="createUser">Sign Up</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="black--text" icon @click="loginWithGoogleAuth">
          <v-icon>mdi-google</v-icon>
        </v-btn>
        <v-btn class="black--text" text @click="loginWithFirebaseAuth">
          Sign In
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { auth, auth2 } from "@/firebase";
import { getAuth } from "firebase/auth";

export default Vue.extend({
  name: "LoginCard",
  data: () => ({
    email: "",
    password: "",
    error: "",
    overlay: false,
  }),
  async created(): Promise<void> {
    await auth.getRedirectResult().then((result) => {
      if (result.user) {
        this.overlay = true;
        this.$store
          .dispatch("loginWithGoogleRedirect", result)
          .then(async (result) => {
            if (result.success) {
              await this.$router.push("/home");
            } else {
              this.error = result.message;
            }
          })
          .catch((result) => (this.error = result.message));
      }
    });
  },
  methods: {
    async loginWithGoogleAuth(): Promise<void> {
      this.overlay = true;
      if (this.$vuetify.breakpoint.xs) {
        const provider = new auth2.GoogleAuthProvider();
        await auth.signInWithRedirect(provider);
      } else {
        this.$store
          .dispatch("loginWithGoogle")
          .then(async (result) => {
            if (result.success) {
              await this.$router.push("/home");
            } else {
              this.error = result.message;
            }
          })
          .catch((result) => (this.error = result.message));
      }
    },
    loginWithFirebaseAuth(): void {
      this.overlay = true;
      this.$store
        .dispatch("login", { email: this.email, pass: this.password })
        .then(async (result) => {
          if (result) {
            await this.$router.push("/home");
          }
        })
        .catch((e) => (this.error = "An error occurred. Please try again."));
    },
    createUser(): void {
      this.overlay = true;
      this.$store
        .dispatch("createUser", { email: this.email, pass: this.password })
        .then(async (result) => {
          if (result.success) {
            await this.$router.push("/home");
          } else {
            this.error = result.message;
          }
        })
        .catch((result) => (this.error = result.message));
    },
  },
  watch: {
    overlay(val): void {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 3000);
    },
  },
});
</script>

<style scoped></style>
