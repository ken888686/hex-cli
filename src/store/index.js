import { createStore } from 'vuex';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

export default createStore({
  state: {
    isLogin: cookies.get('isLogin'),
    token: cookies.get('token'),
  },
  mutations: {
    login(state) {
      state.isLogin = true;
      cookies.set('isLogin', true);
    },
    logout(state) {
      state.isLogin = false;
      cookies.set('isLogin', false);
      cookies.set('token', '');
    },
    updateToken(state, token) {
      state.token = token;
      cookies.set('token', token);
    },
  },
  actions: {
    login({ commit }, token) {
      commit('login');
      commit('updateToken', token);
    },
    logout({ commit }) {
      commit('logout');
      commit('updateToken', '');
    },
  },
  modules: {},
});
