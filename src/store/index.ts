import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "@/router";
import { server } from "@/utils/helper";
import { Book, State } from "@/interfaces/store.interface";
import { auth, auth2 } from "@/firebase";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const initialState = () => ({
  books: [],
  email: "",
  currentUser: {},
  token: "",
  currentTab: 0,
  display: "desktop",
  sessionTime: 0,
});

export default new Vuex.Store({
  state: () => initialState(),
  mutations: {
    LOGIN(state, payload) {
      state.email = payload.email;
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
    UPDATE_SESSION_TIME(state: State, payload: number): void {
      state.sessionTime = payload;
    },
    UPDATE_DISPLAY_STYLE(state: State, payload: string): void {
      state.display = payload;
    },
    SET_BOOKS(state: State, payload: Record<string, Book[]>[]): void {
      state.books = payload;
    },
    SET_AUTHOR_BOOKS(
      state: State,
      payload: Record<string, Book[] | string>,
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
    async logout({ commit }): Promise<void> {
      const token = await auth.currentUser?.getIdToken(true);
      await axios.post(`${server.baseURL}/auth/logout`, { token }).then(() => {
        auth.signOut().then(() => commit("LOGOUT"));
      });
    },
    async login({ commit }, payload: Record<string, string>): Promise<boolean> {
      return await auth
        .signInWithEmailAndPassword(payload.email, payload.pass)
        .then(async () => {
          const token = await auth.currentUser?.getIdToken(true);
          axios.defaults.headers.common["Authorization"] = token;
          return await axios
            .post(`${server.baseURL}/auth/login`, { token })
            .then((result) => {
              if (result.data) {
                commit("SET_CURRENT_USER", auth.currentUser);
                commit("SET_TOKEN", token);
                commit("LOGIN", {
                  email: payload.email,
                });
                return true;
              } else {
                return false;
              }
            });
        });
    },
    async loginWithGoogle({
      commit,
    }): Promise<boolean | { success: boolean; message: string }> {
      const provider = new auth2.GoogleAuthProvider();
      return await auth.signInWithPopup(provider).then(async (result1) => {
        const email = result1.user?.email;
        return await axios
          .post(`${server.baseURL}/auth/userCheck`, { user: email })
          .then(async (result2) => {
            if (result2.data.accepted) {
              if (result1.user) {
                const token = await result1.user?.getIdToken(true);
                axios.defaults.headers.common["Authorization"] = token;
                return await axios
                  .post(`${server.baseURL}/auth/login`, { token: token })
                  .then((result2) => {
                    if (result2.data) {
                      commit("SET_CURRENT_USER", result1.user);
                      commit("SET_TOKEN", token);
                      commit("LOGIN", { email });
                      return {
                        success: true,
                        message: "Successfully added!",
                      };
                    } else return false;
                  });
              } else return false;
            } else return false;
          })
          .catch(() => {
            result1.user?.delete();
            return {
              success: false,
              message: "Sorry, you're not allowed here.",
            };
          });
      });
    },
    async loginWithGoogleRedirect(
      { commit },
      payload,
    ): Promise<boolean | { success: boolean; message: string }> {
      const email = payload.user?.email;
      return await axios
        .post(`${server.baseURL}/auth/userCheck`, { user: email })
        .then(async (result2) => {
          if (result2.data.accepted) {
            if (payload.user) {
              const token = await payload.user?.getIdToken(true);
              axios.defaults.headers.common["Authorization"] = token;
              return await axios
                .post(`${server.baseURL}/auth/login`, { token: token })
                .then((result2) => {
                  if (result2.data) {
                    commit("SET_CURRENT_USER", payload.user);
                    commit("SET_TOKEN", token);
                    commit("LOGIN", { email });
                    return {
                      success: true,
                      message: "Successfully added!",
                    };
                  } else return false;
                });
            } else return false;
          } else return false;
        })
        .catch(() => {
          payload.user?.delete();
          return {
            success: false,
            message: "Sorry, you're not allowed here.",
          };
        });
    },
    async createUser(
      { commit },
      payload: Record<string, string>,
    ): Promise<void | { success: boolean; message: string }> {
      return await axios
        .post(`${server.baseURL}/auth/userCheck`, { user: payload.email })
        .then(async (result) => {
          if (result.data.accepted) {
            return await auth
              .createUserWithEmailAndPassword(payload.email, payload.pass)
              .then(async (userCredential) => {
                const token = await auth.currentUser?.getIdToken(true);
                axios.defaults.headers.common["Authorization"] = token;
                commit("SET_CURRENT_USER", userCredential.user);
                commit("SET_TOKEN", token);
                commit("LOGIN", {
                  email: payload.email,
                });
                return { success: true, message: "Successfully added!" };
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
        .then((data) => commit("SET_BOOKS", data.data))
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
    async getBook({ commit }, payload: Book): Promise<void> {
      return await axios
        .get(`${server.baseURL}/niklib/book/${payload._id}`)
        .then((result) => result.data)
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
    async getFile({ commit }, payload: string): Promise<File | void> {
      return await axios
        .get(`${server.baseURL}/niklib/files/${payload}`)
        .then((data) => new File([data.data], payload))
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
    async addBookToServer(
      { commit, state },
      payload: Record<string, Record<string, unknown>>,
    ): Promise<void> {
      const filename = await axios
        .post(`${server.baseURL}/niklib/upload`, payload.file)
        .then(async (result) => result.data.filename)
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
      const img_name = await axios
        .post(`${server.baseURL}/niklib/upload`, payload.img)
        .then(async (result) => result.data.filename)
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });

      payload.data.filename = filename;
      payload.data.img_name = img_name;
      await axios
        .post(`${server.baseURL}/niklib/book`, payload.data)
        .then((data) => {
          commit("ADD_BOOK", data.data.book);
        })
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
    async editBook(
      { commit },
      payload: Record<string, unknown>,
    ): Promise<void> {
      return await axios.put(
        `${server.baseURL}/niklib/edit?bookID=${payload._id}`,
        payload.data,
      );
    },
    async addFile({ commit, state }, payload: File): Promise<void> {
      return await axios
        .post(`${server.baseURL}/niklib/upload`, payload)
        .then(async (result) => result.data.filename)
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
    async deleteBook({ commit, state }, payload: Book): Promise<void> {
      await axios
        .delete(`${server.baseURL}/niklib/delete?bookID=${payload._id}`)
        .then((data) => {
          let currentAuthor = "";
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
          commit("SET_AUTHOR_BOOKS", {
            author: currentAuthor,
            newList: newList,
          });
        })
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
    async deleteFile({ commit, state }, payload: string): Promise<void> {
      await axios
        .delete(`${server.baseURL}/niklib/delete/file?fileName=${payload}`)
        .catch(() => {
          alert("Session Expired. Please log in to continue.");
          auth.signOut().then(() => commit("LOGOUT"));
          router.replace("/login");
        });
    },
  },
  getters: {
    getBooks: (state: State): Record<string, Book[]>[] => state.books,
    getCurrentUser: (state: State): boolean =>
      Object.keys(state.currentUser).length !== 0,
    getToken: (state: State): string => state.token,
    getCurrentTab: (state: State): number => state.currentTab,
    getDisplayStyle: (state: State): string => state.display,
    getSessionTime: (state: State): number => state.sessionTime,
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
