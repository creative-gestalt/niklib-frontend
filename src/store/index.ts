import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { server } from '@/utils/helper';
import { State, Book } from '@/interfaces/store.interface';
import { auth } from '@/firebase';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const initialState = () => ({
  books: [],
  email: '',
  password: '',
  currentUser: {},
  token: '',
  currentTab: 0,
});

export default new Vuex.Store({
  state: () => initialState(),
  mutations: {
    LOGIN(state, payload) {
      state.email = payload.email;
      state.password = payload.password;
    },
    LOGOUT(state: {
      [x: string]: string | string[] | Record<string, Book[]> | number;
    }) {
      const newState: {
        [x: string]: string | string[] | Record<string, Book[]> | number;
      } = initialState();
      Object.keys(newState).forEach((key) => {
        state[key] = newState[key];
      });
    },
    SET_BOOKS(state: State, payload: Record<string, Book[]>[]): void {
      state.books = payload;
    },
    SET_AUTHOR_BOOKS(
      state: State,
      payload: Record<string, Book[] | string>
    ): void {
      state.books.map((author, index) => {
        if (Object.keys(author)[0] === payload.author) {
          if (payload.newList.length) {
            author[payload.author] = payload.newList as Book[];
          } else {
            state.currentTab = 0;
            state.books.splice(index, 1);
          }
        }
      });
    },
    ADD_BOOK(state: State, payload: Book): void {
      let updated = false;
      state.books.filter((author, index) => {
        if (Object.keys(author)[0] === payload.author) {
          author[payload.author].push(payload);
          updated = true;
        }
      });
      if (!updated) state.books.push({ [payload.author]: [payload] });
    },
    SET_CURRENT_USER(state: State, payload: Record<string, unknown>): void {
      state.currentUser = payload;
    },
    SET_TOKEN(state: State, payload: string): void {
      state.token = payload;
    },
    UPDATE_CURRENT_TAB(state: State, payload: number): void {
      state.currentTab = payload;
    },
  },
  actions: {
    logout({ commit }): void {
      commit('LOGOUT');
    },
    async login({ commit }, payload: Record<string, string>): Promise<boolean> {
      return await auth
        .signInWithEmailAndPassword(payload.email, payload.pass)
        .then(async () => {
          const token = await auth.currentUser?.getIdToken(true);
          axios.defaults.headers.common['Authorization'] = token;
          return await axios
            .post(`${server.baseURL}/auth/login`, { token: token })
            .then((result) => {
              if (result.data) {
                commit('SET_CURRENT_USER', auth.currentUser);
                commit('SET_TOKEN', token);
                commit('LOGIN', {
                  email: payload.email,
                  password: payload.pass,
                });
                return true;
              } else {
                return false;
              }
            });
        });
    },
    async createUser(
      { commit },
      payload: Record<string, string>
    ): Promise<void | { success: boolean; message: string }> {
      return await axios
        .post(`${server.baseURL}/auth/userCheck`, { user: payload.email })
        .then(async (result) => {
          if (result.data.accepted) {
            return await auth
              .createUserWithEmailAndPassword(payload.email, payload.pass)
              .then(async (userCredential) => {
                const token = await auth.currentUser?.getIdToken(true);
                axios.defaults.headers.common['Authorization'] = token;
                commit('SET_CURRENT_USER', userCredential.user);
                commit('SET_TOKEN', token);
                commit('LOGIN', {
                  email: payload.email,
                  password: payload.pass,
                });
                return { success: true, message: 'Successfully added!' };
              })
              .catch((e) => ({ success: false, message: e }));
          }
        })
        .catch(() => ({
          success: false,
          message: "Sorry, you're not allowed here.",
        }));
    },
    async getAllBooks({ commit }): Promise<void> {
      await axios
        .get(`${server.baseURL}/niklib/books`)
        .then((data) => commit('SET_BOOKS', data.data));
    },
    async getBook({ commit }, payload: Book): Promise<void> {
      return await axios
        .get(`${server.baseURL}/niklib/book/${payload._id}`)
        .then((result) => result.data);
    },
    async getFile({ commit }, payload: string): Promise<Blob> {
      return await axios
        .get(`${server.baseURL}/niklib/files/${payload}`)
        .then((data) => new File([data.data], payload));
    },
    async addBookToServer(
      { commit, state },
      payload: Record<string, Record<string, unknown>>
    ): Promise<void> {
      const filename = await axios
        .post(`${server.baseURL}/niklib/upload`, payload.file)
        .then(async (result) => result.data.filename);
      const img_name = await axios
        .post(`${server.baseURL}/niklib/upload`, payload.img)
        .then(async (result) => result.data.filename);

      payload.data.filename = filename;
      payload.data.img_name = img_name;
      await axios
        .post(`${server.baseURL}/niklib/book`, payload.data)
        .then((data) => {
          commit('ADD_BOOK', data.data.book);
        });
    },
    async editBook(
      { commit },
      payload: Record<string, unknown>
    ): Promise<void> {
      return await axios.put(
        `${server.baseURL}/niklib/edit?bookID=${payload._id}`,
        payload.data
      );
    },
    async addFile({ commit, state }, payload: File): Promise<void> {
      return await axios
        .post(`${server.baseURL}/niklib/upload`, payload)
        .then(async (result) => result.data.filename);
    },
    async deleteBook({ commit, state }, payload: Book): Promise<void> {
      await axios
        .delete(`${server.baseURL}/niklib/delete?bookID=${payload._id}`)
        .then((data) => {
          let currentAuthor = '';
          const newList = [] as Book[];
          state.books.map((author: Record<string, Book[]>) => {
            currentAuthor = Object.keys(author)[0];
            if (currentAuthor === payload.author) {
              for (const books of Object.values(author)) {
                for (const book of books) {
                  if (book._id != payload._id) newList.push(book);
                }
              }
            }
          });
          commit('SET_AUTHOR_BOOKS', {
            author: currentAuthor,
            newList: newList,
          });
        });
    },
    async deleteFile({ commit, state }, payload: string): Promise<void> {
      await axios.delete(
        `${server.baseURL}/niklib/delete/file?fileName=${payload}`
      );
    },
  },
  getters: {
    getBooks: (state: State): Record<string, Book[]>[] => state.books,
    getCurrentUser: (state: State): boolean =>
      Object.keys(state.currentUser).length !== 0,
    getToken: (state: State): string => state.token,
    getCurrentTab: (state: State): number => state.currentTab,
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
