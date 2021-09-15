import { createStore } from 'vuex'

export default createStore({
  state: {
    userinput : "",
    searchedResult : [],
    favoriteMovies : [],
    hasResults : true
  },
  mutations: {
    INIT_FAVMOVIES(state, payload) {
      // could try doing this as well, to avoid it being set to `null` or `undefined`
      state.favoriteMovies = payload ?? []
    },
    SET_FAVMOVIES(state, payload) {
      state.favoriteMovies = state.favoriteMovies || [];

      console.log(state.favoriteMovies);
      if (!state.favoriteMovies.some((obj) => obj.id === payload.id)) {
        state.favoriteMovies.push(payload)
      }
      localStorage.setItem('favoriteMovies', JSON.stringify(state.favoriteMovies))
    },
    CLEAR_SEARCHEDRESULT(state){
      state.searchedResult = state.favoriteMovies || [];
    },
    CLEAR_SEARCH_FAVMOVIES_ARRAYS(state){
      state.searchedResult = [];
      state.favoriteMovies = [];
    },
    INSERT_MOVIES_SEARCHEDRESULT(state, payload){
      state.searchedResult = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
