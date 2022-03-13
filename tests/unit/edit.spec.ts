import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import Edit from "@/components/home/book/Edit.vue";

Vue.use(Vuetify);
Vue.use(Vuex);
const localVue = createLocalVue();

const book = {
  title: "Test Title",
  author: "Test Author",
  date_posted: "12-12-21",
  description: "description test",
  filename: "test_file.pdf",
  img_name: "test_img.png",
};
const pdf = new File([], "test_file.pdf");
const img = new File([], "test_img.png");

describe("Edit.vue", () => {
  let store: Store<Record<string, unknown>>;
  let vuetify: Vuetify;
  let wrapper: any;
  beforeEach(() => {
    const $route = {
      params: {
        id: "123",
      },
    };
    const $router = {
      go: jest.fn(),
      push: jest.fn(),
    };
    store = new Vuex.Store({
      actions: {
        getBook({ commit }) {
          return book;
        },
        getFile({ commit }, payload) {
          return payload === "test_file.pdf" ? pdf : img;
        },
        addFile: () => jest.fn(),
        deleteFile: () => jest.fn(),
        editBook: () => jest.fn(),
      },
    });
    vuetify = new Vuetify();
    wrapper = shallowMount(Edit, {
      localVue,
      vuetify,
      store,
      mocks: { $route, $router },
      stubs: ["router-link", "router-view"],
    });
  });
  it("should render correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
  it("should start with creating data items", async () => {
    expect(wrapper.vm.id).toEqual("123");
    expect(await wrapper.vm.book).toEqual(book);
    expect(await wrapper.vm.file).toEqual(pdf);
    expect(await wrapper.vm.img).toEqual(img);
    expect(wrapper.vm.old_file).toEqual(pdf);
    expect(wrapper.vm.old_img).toEqual(img);
  });
  it("should edit the book", async () => {
    const deleteMethod = await jest.spyOn(wrapper.vm, "deleteFile");
    const editMethod = await jest.spyOn(wrapper.vm, "editABook");
    const addMethod = await jest.spyOn(wrapper.vm, "addFile");
    const router = jest.spyOn(wrapper.vm.$router, "push");
    wrapper.vm.file = await new File(["beep"], "new_test_file.pdf");
    wrapper.vm.img = await new File(["boop"], "new_test_img.png");
    await wrapper.vm.editBook();

    expect(deleteMethod).toHaveBeenCalledTimes(2);
    expect(addMethod).toHaveBeenCalledTimes(2);
    expect(editMethod).toHaveBeenCalled();
    expect(router).toHaveBeenCalledWith("/home");
  });
  it("should validate", () => {
    const addBook = jest.spyOn(wrapper.vm, "editBook");
    wrapper.vm.$refs.editForm.validate = jest.fn(() => true);
    wrapper.vm.validate();

    expect(addBook).toHaveBeenCalled();
  });
  it("should navigate to previous page", () => {
    const router = jest.spyOn(wrapper.vm.$router, "go");
    wrapper.vm.navigate();

    expect(router).toHaveBeenCalledWith(-1);
  });
});
