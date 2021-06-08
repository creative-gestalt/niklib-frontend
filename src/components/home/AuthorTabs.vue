<template>
  <div>
    <v-container fluid>
      <v-card>
        <v-tabs :value="currentTab" @input="tab" :color="tabColor" centered>
          <v-tab
            v-for="(author, i) in books"
            active-class="active"
            @change="updateTabState(i)"
            :key="i"
          >
            {{ Object.keys(author)[0] }}
          </v-tab>
          <v-tabs-slider :color="tabColor"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items :value="currentTab" @input="tab">
          <v-tab-item v-for="(author, i) in books" :key="i">
            <div v-for="(books, i) in Object.values(author)" :key="i">
              <v-container fluid>
                <v-row no-gutters>
                  <v-col
                    v-for="book in books"
                    :key="book._id"
                    xl="2"
                    lg="3"
                    md="4"
                    sm="6"
                    cols="12"
                  >
                    <v-card
                      height="420"
                      width="280"
                      class="ma-5 d-flex flex-column teal--text"
                      color="grey darken-4"
                      :to="{ name: 'Book', params: { id: book._id } }"
                      hover
                    >
                      <v-img
                        height="200"
                        :src="getImage(book.img_name)"
                      ></v-img>
                      <v-card-title class="card-title">
                        {{ book.title }}
                      </v-card-title>
                      <v-card-subtitle class="teal--text">
                        {{ book.description | truncate(30, '...') }}
                      </v-card-subtitle>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <small class="text-muted ml-2"
                          >By: {{ book.author }}</small
                        >
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
                            <v-list-item
                              @click="deleteBook(book._id, book.author)"
                              ><span class="teal--text">Delete</span>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-tab-item>
        </v-tabs-items>

        <v-container>
          <div v-if="books.length === 0">
            <h2>No books found at the moment</h2>
          </div>
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
import { server } from '@/utils/helper';

export default Vue.extend({
  name: 'AuthorTabs',
  data: () => ({
    tab: 0,
    tabColor: 'teal',
    snackbar: false,
    snackbarColor: '',
    snackbarText: '',
    timeout: 3000,
  }),
  async created() {
    await this.$store.dispatch('getAllBooks');
  },
  methods: {
    ...mapActions({ deleteABook: 'deleteBook' }),
    getImage(img_name: string): string {
      return `${server.baseURL}/niklib/images/${img_name}?token=${this.token}`;
    },
    deleteBook(id: string, author: string): void {
      this.deleteABook({ _id: id, author: author }).then(() => {
        this.snackbar = true;
        this.snackbarColor = 'teal darken-2';
        this.snackbarText = 'Successfully deleted';
      });
    },
    updateTabState(index: number): void {
      this.$store.commit('UPDATE_CURRENT_TAB', index);
    },
  },
  computed: {
    ...mapGetters({
      books: 'getBooks',
      token: 'getToken',
      currentTab: 'getCurrentTab',
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
