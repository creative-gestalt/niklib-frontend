import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import Add from "@/components/home/book/Add.vue";

Vue.use(Vuetify);
Vue.use(Vuex);
const localVue = createLocalVue();

describe("Add.vue", () => {
  let store: Store<Record<string, unknown>>;
  let vuetify: Vuetify;
  let wrapper: any;
  beforeEach(() => {
    store = new Vuex.Store({
      actions: {
        addBookToServer: () => jest.fn(),
      },
    });
    vuetify = new Vuetify();
    wrapper = shallowMount(Add, {
      localVue,
      vuetify,
      store,
      stubs: ["router-link", "router-view"],
    });
    wrapper.setData({
      title: "Test Title",
      author: "Test Author",
      date_posted: "12-12-21",
      description: "description test",
      filename: "test_file.pdf",
      img_name: "test_img.png",
      file: new File([], "test_file.pdf"),
      img: new File([], "test_file.png"),
    });
  });
  it("should render correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
  it("should start with loading as false", () => {
    expect(wrapper.vm.compLoading).toBeFalsy();
  });
  it("should add book", () => {
    const addBook = jest.spyOn(wrapper.vm, "addBook");
    const addBookToServer = jest.spyOn(wrapper.vm, "addBookToServer");
    wrapper.vm.addBook();
    expect(addBook).toHaveBeenCalled();
    expect(addBookToServer).toHaveBeenCalled();
  });
  it("should validate", () => {
    const addBook = jest.spyOn(wrapper.vm, "addBook");
    wrapper.vm.$refs.addForm.validate = jest.fn(() => true);
    wrapper.vm.validate();
    expect(addBook).toHaveBeenCalled();
  });
  it("should close dialog", () => {
    wrapper.vm.$refs.addForm.reset = jest.fn();
    const resetFields = jest.spyOn(wrapper.vm, "resetFields");
    const resetValidation = jest.spyOn(wrapper.vm, "resetValidation");
    wrapper.vm.closeDialog();
    expect(resetFields).toHaveBeenCalled();
    expect(resetValidation).toHaveBeenCalled();
    expect(wrapper.vm.title).toEqual("");
    expect(wrapper.vm.description).toEqual("");
    expect(wrapper.vm.author).toEqual("");
    expect(wrapper.vm.date_posted).toEqual("");
    expect(wrapper.vm.file).toEqual(null);
    expect(wrapper.vm.img).toEqual(null);
  });
});
