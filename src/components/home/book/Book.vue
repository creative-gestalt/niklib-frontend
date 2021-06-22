<template>
  <div>
    <v-container>
      <v-row class="ma-auto">
        <v-btn
          class="ma-auto black--text"
          color="teal darken-2"
          @click="navigate()"
          dark
        >
          View All Books
        </v-btn>
      </v-row>
    </v-container>
    <v-container>
      <v-card :href="downloadURL">
        <v-img height="850" :src="imgURL"></v-img>
        <v-card-title class="teal--text">{{ book.title }}</v-card-title>
        <v-card-subtitle class="teal--text">
          {{ book.description }}
        </v-card-subtitle>
        <v-card-subtitle class="teal--text">
          Written by {{ book.author }}
        </v-card-subtitle>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { server } from '@/utils/helper';
import { mapActions, mapGetters } from 'vuex';
import { Book } from '@/interfaces/book.interface';

export default Vue.extend({
  name: 'Book',
  data: () => ({
    id: '',
    book: {} as Book,
    downloadURL: '',
    imgURL: '',
  }),
  async created() {
    this.id = String(this.$route.params.id);
    this.book = await this.getABook({ _id: this.id });
    this.downloadURL = `${server.baseURL}/niklib/files/download/${this.book.filename}?token=${this.getToken}`;
    this.imgURL = `${server.baseURL}/niklib/images/${this.book.img_name}?token=${this.getToken}`;
  },
  methods: {
    ...mapActions({ getABook: 'getBook', downloadABook: 'getFile' }),
    navigate() {
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapGetters(['getToken']),
  },
});
</script>

<style lang="scss" scoped></style>
