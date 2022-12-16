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
            placeholder="Email"
            type="email"
            hint="Email"
            outlined
            dense
            dark
          ></v-text-field>
          <v-text-field
            v-model="apiKey"
            placeholder="Api Key"
            type="password"
            hint="Api Key"
            @keyup.enter="loginWithFirebaseAuth"
            clearable
            outlined
            dense
            dark
          ></v-text-field>
        </v-form>
        <p style="color: red">{{ error }}</p>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="black--text" text @click="showDialogForSignUp">
          Sign Up
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="false"
          class="black--text"
          icon
          @click="loginWithGoogleAuth"
        >
          <v-icon>mdi-google</v-icon>
        </v-btn>
        <v-btn
          type="submit"
          class="black--text"
          text
          @click="loginWithFirebaseAuth"
        >
          Sign In
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" max-width="450">
      <v-card>
        <v-card-title class="justify-center">New User</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          You'll need an api key to use this service. If you do not know the
          owner of this website, you cannot have access.
        </v-card-text>
      </v-card>
    </v-dialog>
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
    apiKey: "",
    error: "",
    overlay: false,
    dialog: false,
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
        .dispatch("login", { email: this.email, pass: this.apiKey })
        .then(async (result) => {
          if (result) {
            await this.$router.push("/home");
          }
        })
        .catch((e) => (this.error = "An error occurred. Please try again."));
    },
    showDialogForSignUp(): void {
      this.dialog = true;
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
