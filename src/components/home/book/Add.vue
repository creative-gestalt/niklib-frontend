<template>
  <v-dialog :value="dialog" width="600" @click:outside="closeDialog">
    <v-card>
      <v-card-title>Add Book</v-card-title>
      <v-container>
        <v-form ref="addForm" v-model="valid" lazy-validation>
          <v-text-field
            type="text"
            id="title"
            v-model="title"
            :rules="noEmptyRule"
            hint="Title"
            placeholder="Book title"
            required
          >
            Title
          </v-text-field>
          <v-text-field
            type="text"
            id="description"
            v-model="description"
            :rules="noEmptyRule"
            hint="Description"
            placeholder="Enter a description"
            required
          >
            Description
          </v-text-field>
          <v-text-field
            type="text"
            id="author"
            v-model="author"
            :rules="noEmptyRule"
            hint="Author"
            placeholder="Enter the author"
            required
          >
            Author
          </v-text-field>
          <v-file-input
            v-model="img"
            :rules="noEmptyRule"
            label="Book Cover Image"
            required
          ></v-file-input>
          <v-file-input
            v-model="file"
            :rules="noEmptyRule"
            label="Book File"
            required
          ></v-file-input>
        </v-form>
        <v-card-actions>
          <v-btn type="submit" :loading="compLoading" @click="validate">
            Add Book
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import * as path from 'path';

export default Vue.extend({
  name: 'AddBook',
  props: {
    dialog: Boolean,
  },
  data: () => ({
    valid: false,
    title: '',
    description: '',
    author: '',
    date_posted: '',
    loading: false,
    file: null as unknown as File,
    img: null as unknown as File,
    noEmptyRule: [(v: string) => !!v || 'This field is required'],
  }),
  methods: {
    ...mapActions({ addBookToServer: 'addBookToServer' }),
    async addBook() {
      const fileExt = path.extname(this.file.name);
      const imgExt = path.extname(this.img.name);
      if (!fileExt.match(/\.(pdf|epub)$/) || !imgExt.match(/\.(png|jpg)$/)) {
        this.$emit('openSnackbar', {
          text: 'Files must be valid type',
          color: 'red darken-4',
          show: true,
        });
        return;
      }
      this.loading = true;
      this.date_posted = new Date().toLocaleDateString();
      const file = new FormData();
      const img = new FormData();
      const postData: Record<string, unknown> = {
        title: this.title,
        description: this.description,
        author: this.author,
        date_posted: this.date_posted,
      };
      file.append('file', this.file);
      img.append('file', this.img);
      await this.addBookToServer({ file: file, img: img, data: postData })
        .then(() => {
          setTimeout(() => (this.loading = false), 1000);
          setTimeout(() => {
            this.closeDialog();
            this.$emit('openSnackbar', {
              text: 'Book Added Successfully',
              color: 'teal darken-3',
              show: true,
            });
          }, 1000);
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    closeDialog(): void {
      this.$emit('closeDialog');
      this.resetFields();
      this.resetValidation();
    },
    validate(): void {
      this.valid = (
        this.$refs.addForm as Vue & {
          validate: () => boolean;
        }
      ).validate();
      if (this.valid) {
        this.addBook();
      }
    },
    resetValidation(): void {
      (this.$refs.addForm as Vue & { reset: () => boolean }).reset();
    },
    resetFields(): void {
      this.title = '';
      this.description = '';
      this.author = '';
      this.date_posted = '';
      this.file = null as unknown as File;
      this.img = null as unknown as File;
    },
  },
  computed: {
    compLoading(): boolean {
      return this.loading;
    },
  },
});
</script>

<style lang="scss" scoped></style>
