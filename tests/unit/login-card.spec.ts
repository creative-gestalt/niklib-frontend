import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import LoginCard from "@/components/login/LoginCard.vue";

Vue.use(Vuetify);
Vue.use(Vuex);
const localVue = createLocalVue();

describe("LoginCard.vue", () => {
  let store: Store<Record<string, unknown>>;
  let vuetify: Vuetify;
  let wrapper: any;
  beforeEach(() => {
    const $route = {
      path: "",
    };
    const $router = {
      push: jest.fn(),
    };

    store = new Vuex.Store({
      actions: {
        login: () => jest.fn(() => Promise.resolve(true)),
        createUser: ({ commit }, payload) =>
          Promise.resolve({
            success: payload.email === "test@email.com",
          }),
      },
    });
    vuetify = new Vuetify();
    wrapper = shallowMount(LoginCard, {
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
  it("should login", async () => {
    const router = jest.spyOn(wrapper.vm.$router, "push");
    wrapper.vm.email = "test@email.com";
    wrapper.vm.pass = "tester";
    await wrapper.vm.loginWithFirebaseAuth();

    expect(await router).toHaveBeenCalledWith("/home");
    expect(wrapper.vm.overlay).toBeTruthy();
  });
  it("should create new user", async () => {
    const router = jest.spyOn(wrapper.vm.$router, "push");
    wrapper.vm.email = "test@email.com";
    wrapper.vm.pass = "tester";
    await wrapper.vm.createUser();

    expect(await router).toHaveBeenCalledWith("/home");
    expect(wrapper.vm.overlay).toBeTruthy();
  });
  it("should not create new user", async () => {
    const router = jest.spyOn(wrapper.vm.$router, "push");
    wrapper.vm.email = "fail@email.com";
    wrapper.vm.pass = "tester";
    await wrapper.vm.createUser();

    expect(await router).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.overlay).toBeTruthy();
  });
});
