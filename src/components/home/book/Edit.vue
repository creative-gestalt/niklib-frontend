<template>
  <div>
    <v-container>
      <v-row class="ma-auto">
        <v-btn class="ma-auto" @click="navigate()"> View All Books </v-btn>
      </v-row>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>Edit Book</v-card-title>
        <v-container>
          <v-form ref="editForm" v-model="valid" lazy-validation>
            <v-text-field
              type="text"
              id="title"
              v-model="book.title"
              :rules="noEmptyRule"
              name="title"
              placeholder="Enter title"
              >Title
            </v-text-field>
            <v-text-field
              type="text"
              id="description"
              v-model="book.description"
              :rules="noEmptyRule"
              name="description"
              placeholder="Enter Description"
            >
              Description
            </v-text-field>
            <v-text-field
              type="text"
              id="author"
              v-model="book.author"
              :rules="noEmptyRule"
              name="author"
              placeholder="placeholder"
              >Author
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
        </v-container>
        <v-card-actions>
          <v-btn @click="validate">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { Book } from "@/interfaces/book.interface";

export default Vue.extend({
  name: "EditBook",
  data: () => ({
    id: "",
    book: {} as Book,
    valid: false,
    file: null as unknown as File,
    img: null as unknown as File,
    old_file: null as unknown as File,
    old_img: null as unknown as File,
    noEmptyRule: [(v: string) => !!v || "This field is required"],
  }),
  async created() {
    this.id = String(this.$route.params.id);
    this.book = await this.getBook({ _id: this.id });
    this.file = await this.getFile(this.book.filename);
    this.img = await this.getFile(this.book.img_name);
    this.old_file = this.file;
    this.old_img = this.img;
  },
  methods: {
    ...mapActions({
      getFile: "getFile",
      getBook: "getBook",
      addFile: "addFile",
      deleteFile: "deleteFile",
      editABook: "editBook",
    }),
    async editBook(): Promise<void> {
      const file = new FormData();
      const img = new FormData();
      const postData: Record<string, unknown> = {
        title: this.book.title,
        description: this.book.description,
        author: this.book.author,
        date_posted: this.book.date_posted,
      };
      if (this.file !== this.old_file && this.file.size > 0) {
        await this.deleteFile(this.book.filename);
        file.append("file", this.file);
        postData.filename = await this.addFile(file);
      }
      if (this.img !== this.old_img && this.img.size > 0) {
        await this.deleteFile(this.book.img_name);
        img.append("file", this.img);
        postData.img_name = await this.addFile(img);
      }
      await this.editABook({ _id: this.id, data: postData }).then(() =>
        this.$router.push("/home")
      );
    },
    validate(): void {
      this.valid = (
        this.$refs.editForm as Vue & {
          validate: () => boolean;
        }
      ).validate();
      if (this.valid) {
        this.editBook();
      }
    },
    navigate(): void {
      this.$router.go(-1);
    },
  },
});
</script>

<style lang="scss" scoped></style>
