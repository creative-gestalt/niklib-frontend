<template>
  <v-app>
    <v-app-bar id="nav" app color="teal darken-2" dark>
      <v-toolbar-title class="black--text">
        <v-img class="ml-3" src="@/assets/ga-logo-black.png" width="35"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="currentUser">
        <tooltip
          :click-action="openAdd"
          :position="{ bottom: true }"
          color="black"
          icon-name="mdi-plus-box-outline"
          tooltip-text="Add New Book"
          type="icon"
        ></tooltip>
        <tooltip
          :click-action="home"
          :position="{ bottom: true }"
          color="black"
          icon-name="mdi-book-multiple-outline"
          tooltip-text="Home"
          type="icon"
        ></tooltip>
        <tooltip
          :click-action="logout"
          :position="{ bottom: true }"
          color="black"
          icon-name="mdi-exit-to-app"
          tooltip-text="Logout"
          type="icon"
        ></tooltip>
      </div>
      <AddBook
        :dialog="dialog"
        @closeDialog="closeDialog"
        @openSnackbar="openSnackbar"
      />
    </v-app-bar>
    <v-main>
      <router-view />
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :timeout="timeout"
        dark
        elevation="24"
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AddBook from "@/components/home/book/Add.vue";
import Tooltip from "@/components/shared/Tooltip.vue";
import { mapGetters } from "vuex";
import { auth } from "@/firebase";
import axios from "axios";

export default Vue.extend({
  name: "App",
  components: { Tooltip, AddBook },
  created() {
    axios.defaults.headers.common["Authorization"] =
      this.$store.getters["getToken"];
    if (this.$vuetify.breakpoint.xs)
      this.$store.commit("UPDATE_DISPLAY_STYLE", "mobile");
  },
  data: () => ({
    dialog: false,
    snackbar: false,
    snackbarColor: "",
    snackbarText: "",
    timeout: 3000,
  }),
  methods: {
    openAdd(): void {
      this.dialog = true;
    },
    closeDialog(): void {
      this.dialog = false;
    },
    openSnackbar(props: Record<string, string | boolean>): void {
      this.snackbar = Boolean(props.show);
      this.snackbarColor = String(props.color);
      this.snackbarText = String(props.text);
    },
    logout(): void {
      this.$store.dispatch("logout").then(() => this.$router.push("/login"));
    },
    home(): void {
      if (this.$route.path !== "/home") this.$router.push("/home");
    },
  },
  computed: {
    ...mapGetters({ currentUser: "getCurrentUser" }),
  },
});
</script>

<style lang="scss">
$scrollbar-bg-color: #171717;
$scrollbar-thumb-color: #898989;

::-webkit-scrollbar {
  width: 10px;
  background-color: $scrollbar-bg-color;
}

::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background-color: $scrollbar-thumb-color;
}
</style>
