import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import AuthorTabs from "@/components/home/AuthorTabs.vue";
import { Book } from "@/interfaces/book.interface";
import { server } from "@/utils/helper";

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.filter(
  "truncate",
  function (text: string | never[], stop: number, clamp: string) {
    return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
  }
);
const localVue = createLocalVue();

const books = [
  {
    title: "Test Title",
    author: "Test Author",
    date_posted: "12-12-21",
    description: "description test",
    filename: "test_file.pdf",
    img_name: "test_img.png",
  },
  {
    title: "Test Title",
    author: "Test Author",
    date_posted: "12-12-21",
    description: "description test",
    filename: "test_file.pdf",
    img_name: "test_img.png",
  },
];

describe("AuthorTabs.vue", () => {
  let store: Store<Record<string, unknown>>;
  let vuetify: Vuetify;
  let wrapper: any;
  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        books: [] as Book[],
      },
      mutations: {
        SET_BOOKS(state, payload) {
          state.books = payload;
        },
      },
      actions: {
        getAllBooks({ commit }) {
          commit("SET_BOOKS", books);
        },
        deleteBook: jest.fn().mockResolvedValueOnce(true),
      },
      getters: {
        getBooks: (state) => state.books,
        getToken: () => jest.fn(),
      },
    });
    vuetify = new Vuetify();
    wrapper = shallowMount(AuthorTabs, {
      localVue,
      vuetify,
      store,
      stubs: ["router-link", "router-view"],
    });
  });
  it("should render correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
  it("should start with selected tab as first author", () => {
    expect(wrapper.vm.selectedTabTitle).toEqual(wrapper.vm.compAuthors[0]);
  });
  it("should have unique authors", () => {
    expect(wrapper.vm.compAuthors.length).toEqual(1);
  });
  it("should have books", () => {
    expect(wrapper.vm.compBooks.length).toEqual(2);
  });
  it("should delete a book", () => {
    const method = jest.spyOn(wrapper.vm, "deleteBook");
    wrapper.vm.deleteBook("fakeID");

    expect(method).toHaveBeenCalled();
  });
  it("should have image url", () => {
    expect(wrapper.vm.getImage("img_name")).toEqual(
      `${server.baseURL}/niklib/images/img_name?token=${wrapper.vm.token}`
    );
  });
});
