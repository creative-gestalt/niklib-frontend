<template>
  <v-app>
    <v-app-bar id="nav" color="teal darken-2" app dark>
      <v-toolbar-title class="black--text">Nick's Library</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="currentUser">
        <tooltip
          :click-action="openAdd"
          :position="{ bottom: true }"
          type="icon"
          icon-name="mdi-book-plus"
          tooltip-text="Add New Book"
          color="black"
        ></tooltip>
        <tooltip
          :click-action="home"
          :position="{ bottom: true }"
          type="icon"
          icon-name="mdi-folder-home"
          tooltip-text="Home"
          color="black"
        ></tooltip>
        <tooltip
          :click-action="logout"
          :position="{ bottom: true }"
          type="icon"
          icon-name="mdi-arrow-right-bold-box"
          tooltip-text="Logout"
          color="black"
        ></tooltip>
      </div>
      <AddBook
        @openSnackbar="openSnackbar"
        @closeDialog="closeDialog"
        :dialog="dialog"
      />
    </v-app-bar>
    <v-main>
      <router-view />
      <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        :color="snackbarColor"
        elevation="24"
        dark
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AddBook from '@/components/home/book/Add.vue';
import Tooltip from '@/components/shared/Tooltip.vue';
import { mapGetters } from 'vuex';
import { auth } from '@/firebase';
import axios from 'axios';

export default Vue.extend({
  name: 'App',
  components: { Tooltip, AddBook },
  created() {
    axios.defaults.headers.common['Authorization'] =
      this.$store.getters['getToken'];
  },
  data: () => ({
    dialog: false,
    snackbar: false,
    snackbarColor: '',
    snackbarText: '',
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
      auth
        .signOut()
        .then(() => {
          this.$store.dispatch('logout');
          this.$router.push('/login');
        })
        .catch((error) => console.log(error));
    },
    home(): void {
      if (this.$route.path !== '/home') this.$router.push('/home');
    },
  },
  computed: {
    ...mapGetters({ currentUser: 'getCurrentUser' }),
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
