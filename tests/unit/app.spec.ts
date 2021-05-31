import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import Vuetify from 'vuetify';
import Vue from 'vue';
import App from '@/App.vue';

Vue.use(Vuetify);
Vue.use(Vuex);
const localVue = createLocalVue();

jest.mock('@/firebase', () => {
  return {
    auth: {
      signOut: jest.fn(() => Promise.resolve(true)),
    },
  };
});

describe('App.vue', () => {
  let store: Store<Record<string, unknown>>;
  let vuetify: Vuetify;
  let wrapper: any;
  beforeEach(() => {
    const $route = {
      path: '',
    };
    const $router = {
      push: jest.fn(),
    };
    store = new Vuex.Store({
      state: {
        email: 'test@email.com',
        password: 'tester',
        currentUser: { test: 'user' },
        token: 'j_fioaINdjksk8932nJD',
      },
      mutations: {
        LOGOUT(state) {
          state.email = '';
          state.password = '';
          state.currentUser = Object.assign({});
          state.token = '';
        },
      },
      actions: {
        logout({ commit }) {
          commit('LOGOUT');
        },
      },
      getters: {
        getCurrentUser: () => jest.fn(),
        getToken: () => jest.fn(),
      },
    });
    vuetify = new Vuetify();
    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      store,
      mocks: { $route, $router },
      stubs: ['router-link', 'router-view'],
    });
  });
  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should open the snackbar', () => {
    wrapper.vm.openSnackbar({ show: true, color: 'green', text: 'Opened!' });

    expect(wrapper.vm.snackbar).toBeTruthy();
    expect(wrapper.vm.snackbarColor).toEqual('green');
    expect(wrapper.vm.snackbarText).toEqual('Opened!');
  });
  it('should open dialog', () => {
    wrapper.vm.openAdd();

    expect(wrapper.vm.dialog).toBeTruthy();
  });
  it('should close dialog', () => {
    wrapper.vm.closeDialog();

    expect(wrapper.vm.dialog).toBeFalsy();
  });
  it('should navigate home', () => {
    const router = jest.spyOn(wrapper.vm.$router, 'push');
    wrapper.vm.home();

    expect(router).toHaveBeenCalledWith('/home');
  });
  it('should logout', async () => {
    const router = jest.spyOn(wrapper.vm.$router, 'push');
    await wrapper.vm.logout();

    expect(router).toHaveBeenCalledWith('/login');
  });
});
