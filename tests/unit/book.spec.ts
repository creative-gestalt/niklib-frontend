import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import Vuetify from 'vuetify';
import Vue from 'vue';
import Book from '@/components/home/book/Book.vue';
import { server } from '@/utils/helper';

Vue.use(Vuetify);
Vue.use(Vuex);
const localVue = createLocalVue();

const book = {
  title: 'Test Title',
  author: 'Test Author',
  date_posted: '12-12-21',
  description: 'description test',
  filename: 'test_file.pdf',
  img_name: 'test_img.png',
};

describe('Book.vue', () => {
  let store: Store<Record<string, unknown>>;
  let vuetify: Vuetify;
  let wrapper: any;
  beforeEach(() => {
    const $route = {
      params: {
        id: '123',
      },
    };
    const $router = {
      go: jest.fn(),
    };
    store = new Vuex.Store({
      state: {
        token: '3489gdsldf834ns',
      },
      actions: {
        getBook({ commit }) {
          return book;
        },
        getFile: () => jest.fn(),
      },
      getters: {
        getToken: (state) => state.token,
      },
    });
    vuetify = new Vuetify();
    wrapper = shallowMount(Book, {
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
  it('should start with creating data items', () => {
    expect(wrapper.vm.id).toEqual('123');
    expect(wrapper.vm.book).toEqual(book);
    expect(wrapper.vm.downloadURL).toEqual(
      `${server.baseURL}/niklib/files/download/${wrapper.vm.book.filename}?token=${wrapper.vm.getToken}`
    );
    expect(wrapper.vm.imgURL).toEqual(
      `${server.baseURL}/niklib/images/${wrapper.vm.book.img_name}?token=${wrapper.vm.getToken}`
    );
  });
  it('should navigate to previous page', () => {
    const router = jest.spyOn(wrapper.vm.$router, 'go');
    wrapper.vm.navigate();

    expect(router).toHaveBeenCalledWith(-1);
  });
});
