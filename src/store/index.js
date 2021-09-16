import { createStore } from 'vuex'

export default createStore({
  state: {
    userinput : "",
    searchedResult : [],
    favoriteMovies : [],
    hasResults : true,
    apiKey : "ec8fb4c97f4c101a7e63dc22213b4106"
  },
  mutations: {
    INIT_FAVMOVIES(state, payload) {
      state.favoriteMovies = payload ?? []
    },
    SET_FAVMOVIES(state, payload) {
      state.favoriteMovies = state.favoriteMovies || [];

      if (!state.favoriteMovies.some((obj) => obj.id === payload.id)) {
        state.favoriteMovies.push(payload)
      }
      localStorage.setItem('favoriteMovies', JSON.stringify(state.favoriteMovies))
    },
    REMOVE_FAVMOVIE(state, payload){
      if (state.favoriteMovies.find(movie => movie.id === payload.id)){
        state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== payload.id);
      }
    },
    CLEAR_SEARCHEDRESULT(state){
      state.searchedResult = [];
    },
    CLEAR_SEARCH_FAVMOVIES_ARRAYS(state){
      state.searchedResult = [];
      state.favoriteMovies = [];
    },
    INSERT_MOVIES_SEARCHEDRESULT(state, payload){
      state.searchedResult = payload.filter(movie => movie.poster_path !== null);



    },
    GET_FAVMOVIES_FROM_LST(state){
      state.favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    },
    SET_HASRESULTS_TRUE(state){
      state.hasResults = true;
    },
    MAKE_UNIQUE_SEARCHEDRESULT(state, payload){
      state.searchedResult = payload.filter(movie => movie.poster_path !== null);
      state.hasResults = state.searchedResult.length > 0;
    }
  },
  actions: {
  },
  modules: {
  }
})
