<template>
  <div>
    <v-container fluid>
      <v-list>
        <v-list-group
          :value="false"
          color="teal lighten-1"
          v-for="(author, i) in books"
          :key="i"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="teal--text">
                {{ Object.keys(author)[0] }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <div v-for="(books, i) in Object.values(author)" :key="i">
            <v-list-item
              v-for="book in books"
              :key="book._id"
              :to="{ name: 'Book', params: { id: book._id } }"
              link
            >
              <v-list-item-avatar>
                <v-img
                  :alt="`${book.title} avatar`"
                  :src="getImage(book.img_name)"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="grey--text">
                  {{ book.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list>
    </v-container>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="timeout">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { server } from "@/utils/helper";

export default Vue.extend({
  name: "AuthorList",
  data: () => ({
    tab: 0,
    tabColor: "teal",
    snackbar: false,
    snackbarColor: "",
    snackbarText: "",
    timeout: 3000,
  }),
  async created() {
    await this.$store.dispatch("getAllBooks");
  },
  methods: {
    ...mapActions({ deleteABook: "deleteBook" }),
    getImage(img_name: string): string {
      return `${server.baseURL}/niklib/images/${img_name}?token=${this.token}`;
    },
    deleteBook(id: string, author: string): void {
      this.deleteABook({ _id: id, author: author }).then(() => {
        this.snackbar = true;
        this.snackbarColor = "teal darken-2";
        this.snackbarText = "Successfully deleted";
      });
    },
    updateTabState(index: number): void {
      this.$store.commit("UPDATE_CURRENT_TAB", index);
    },
  },
  computed: {
    ...mapGetters({
      books: "getBooks",
      token: "getToken",
      currentTab: "getCurrentTab",
    }),
  },
});
</script>

<style lang="scss" scoped>
$tab-text-color: teal;

.active {
  color: $tab-text-color;
}
.card-title {
  white-space: pre-wrap;
  word-break: keep-all;
}
</style>
