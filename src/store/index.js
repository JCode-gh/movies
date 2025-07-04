import { createStore } from 'vuex'

export default createStore({
  state: {
    userinput : "",
    searchedResult : [],
    newestMovies : [],
    favoriteMovies : [],
    watchedMovies: [],
    hasResults : true,
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    apiKey : "ec8fb4c97f4c101a7e63dc22213b4106"
  },
  mutations: {
    INIT_FAVMOVIES(state, payload) {
      state.favoriteMovies = payload ?? []
    },
    INIT_WATCHED_MOVIES(state) {
      const watchedMovies = localStorage.getItem('watchedMovies')
      state.watchedMovies = watchedMovies ? JSON.parse(watchedMovies) : []
    },
    SET_FAVMOVIES(state, payload) {
      state.favoriteMovies = state.favoriteMovies || [];

      if (!state.favoriteMovies.some((obj) => obj.id === payload.id)) {
        state.favoriteMovies.push(payload)
      }
      localStorage.setItem('favoriteMovies', JSON.stringify(state.favoriteMovies))
    },
    TOGGLE_WATCHED_MOVIE(state, movie) {
      const index = state.watchedMovies.findIndex(m => m.id === movie.id)
      if (index === -1) {
        state.watchedMovies.push({
          id: movie.id,
          title: movie.title,
          watchedDate: new Date().toISOString()
        })
      } else {
        state.watchedMovies.splice(index, 1)
      }
      localStorage.setItem('watchedMovies', JSON.stringify(state.watchedMovies))
    },
    REMOVE_FAVMOVIE(state, payload){
      if (state.favoriteMovies.find(movie => movie.id === payload.id)){
        state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== payload.id);
        localStorage.setItem('favoriteMovies', JSON.stringify(state.favoriteMovies));
      }
    },
    CLEAR_SEARCHEDRESULT(state){
      state.searchedResult = [];
    },
    CLEAR_SEARCH_FAVMOVIES_ARRAYS(state){
      state.searchedResult = [];
      state.favoriteMovies = [];
    },
    CLEAR_USERINPUT(state){
      state.userinput = "";
    },
    INSERT_MOVIES_SEARCHEDRESULT(state, payload) {
      // Filter out movies without a poster path
      const filteredMovies = payload.filter(movie => movie.poster_path !== null);
  
      // Append the new movies to the existing array
      state.searchedResult = [...state.searchedResult, ...filteredMovies];
    },
    INSERT_MOVIES_NEWESTMOVIES(state,payload) {
      state.newestMovies = payload.filter(movie => movie.poster_path !== null);
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
    },
    SET_LOADING(state, payload) {
      state.isLoading = payload;
    },
    SET_PAGINATION(state, { currentPage, totalPages }) {
      state.currentPage = currentPage;
      state.totalPages = totalPages;
    }
  },
  getters: {
    isMovieWatched: (state) => (movieId) => {
      return state.watchedMovies.some(movie => movie.id === movieId)
    },
    getWatchedDate: (state) => (movieId) => {
      const movie = state.watchedMovies.find(m => m.id === movieId)
      return movie ? new Date(movie.watchedDate).toLocaleDateString() : null
    }
  },
  actions: {
  },
  modules: {
  }
})
