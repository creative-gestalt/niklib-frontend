<template>
  <div>
    <v-container fluid>
      <v-card>
        <v-tabs v-model="tab" :color="tabColor" centered>
          <v-tab
            v-for="(author, i) in compAuthors"
            active-class="active"
            @change="
              selectedTab = i;
              selectedTabTitle = author;
            "
            :key="i"
          >
            {{ author }}
          </v-tab>
          <v-tabs-slider :color="tabColor"></v-tabs-slider>
        </v-tabs>

        <v-container>
          <div v-if="books.length === 0">
            <h2>No books found at the moment</h2>
          </div>
        </v-container>
        <v-container fluid>
          <v-row no-gutters>
            <v-col
              v-for="book in compBooks"
              :key="book._id"
              lg="3"
              md="4"
              sm="6"
              cols="12"
            >
              <v-card
                height="470"
                width="320"
                class="ma-5 d-flex flex-column teal--text"
                color="grey darken-4"
                :to="{ name: 'Book', params: { id: book._id } }"
                hover
              >
                <v-img height="250" :src="getImage(book.img_name)"></v-img>
                <v-card-title class="card-title">{{ book.title }}</v-card-title>
                <v-card-subtitle class="teal--text">
                  {{ book.description | truncate(125, '...') }}
                </v-card-subtitle>
                <v-divider></v-divider>
                <v-card-actions>
                  <small class="text-muted ml-2">By: {{ book.author }}</small>
                  <v-spacer></v-spacer>
                  <v-menu open-on-hover>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" dark icon>
                        <v-icon color="teal darken-2">mdi-menu</v-icon>
                      </v-btn>
                    </template>
                    <v-list width="100">
                      <v-list-item
                        :to="{ name: 'Edit', params: { id: book._id } }"
                      >
                        <span class="teal--text">Edit</span>
                      </v-list-item>
                      <v-list-item @click="deleteBook(book._id)"
                        ><span class="teal--text">Delete</span>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="timeout">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { Book } from '@/interfaces/book.interface';
import { server } from '@/utils/helper';

export default Vue.extend({
  name: 'AuthorTabs',
  data: () => ({
    tab: null,
    tabColor: 'teal',
    selectedTab: 0,
    selectedTabTitle: '',
    snackbar: false,
    snackbarColor: '',
    snackbarText: '',
    timeout: 3000,
  }),
  async created() {
    await this.$store.dispatch('getAllBooks');
    this.selectedTabTitle = this.compAuthors[0];
  },
  methods: {
    ...mapActions({ deleteABook: 'deleteBook' }),
    getImage(img_name: string): string {
      return `${server.baseURL}/niklib/images/${img_name}?token=${this.token}`;
    },
    deleteBook(id: string): void {
      this.deleteABook({ _id: id }).then(() => {
        this.snackbar = true;
        this.snackbarColor = 'teal darken-3';
        this.snackbarText = 'Successfully deleted';
      });
    },
  },
  computed: {
    ...mapGetters({ books: 'getBooks', token: 'getToken' }),
    compAuthors(): string[] {
      return [
        ...new Set(this.books.map((book: Book) => book.author)),
      ] as string[];
    },
    compBooks(): Book[] {
      let books = this.books;
      books = books.filter((book: Book) => {
        if (book.author === this.selectedTabTitle) return book;
      });

      return books;
    },
  },
  watch: {
    compAuthors(val): void {
      if (val.length) this.selectedTabTitle = this.compAuthors[0];
    },
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
