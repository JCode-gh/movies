<template>
<div class="navcontainer">
  <div id="nav">
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item navbar-brand">
            <input type="button" class="nav-link" value="Movies"
                   style="background: none;color: red;outline: none;border: none" @click="showPopularMovies">
          </li>
          <li class="nav-item navbar-brand d-flex flex-column-reverse"  v-if="$store.state.favoriteMovies.length > 0">
            <input type="button" class="nav-link" :value="'Favorites'+ '('+ $store.state.favoriteMovies.length  +')'"
                   style="background: none;color: red;outline: none;border: none" @click="pushFavorites">
          </li>
        </ul>
        <input class="form-control mr-sm-2" v-model="userInput" placeholder="Search" aria-label="Search" @keypress="kpHandler">
        <input type="button" style="color: white" class="btn bg-gradient bg-danger btn-outline-danger my-2 my-sm-0"  @click="searchClicked" value="Search">
      </div>
    </nav>
  </div>
  <ListOfFavorites/>
</div>
</template>

<script>
import Nav from "../components/Home/Nav";
import ListOfFavorites from "../components/Favorites/ListOfFavorites";
export default {
  name: "Favorites",
  components: {ListOfFavorites, Nav},
  data(){
    return {
      userInput : "",
    }
  },
  methods : {
    pushFavorites() {
      this.$router.push('/favorites');
    },
    async showPopularMovies() {
      this.$router.push('/');
      this.$store.commit("CLEAR_SEARCHEDRESULT");

      await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`)
          .then(function (response) {
            return response.json();
          })
          .then(movies => {
            this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", movies.results);
          })
    },
  }
}
</script>

<style scoped>

.navcontainer {
  padding-top: 6rem;
}
.form-control {
  display: none;
}
.bg-danger {
  display: none;
}
sup {
  padding: 10px;
}
#navbarSupportedContent {
  justify-content: flex-start;
  margin-right: 3em;
}

.navbar-brand {
  margin-left: 3rem;
}

.form-control{
  margin-right: 1rem;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav {
  background: black !important;
}
a {
  text-decoration: none;
}
li {
  padding-right: 40px;
}
#nav a.router-link-exact-active {
  color: red;
}

@media only screen and (max-width: 992px) {
  .navbar-toggler {
    display: none;
  }

  #navbarSupportedContent {
    margin-right: 0;
  }

  .navbar-nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .form-control, .bg-danger {
    width: 75%;
    margin: auto;
  }
}
</style>