<template>
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
</template>

<script>
export default {
  name: "Nav",
  data(){
    return {
      userInput : "",
    }
  },
  methods : {
    pushFavorites(){
      this.$router.push('/favorites');
    },
    showPopularMovies(){
      this.$router.push('/');
      this.$store.state.hasResults = true;
      //this.userInput = "";
      this.$store.state.searchedResult = [];
      let apiKey = "ec8fb4c97f4c101a7e63dc22213b4106";

      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
          .then(function (response) {
            return response.json();
          })
          .then(movies => {
            this.$store.state.searchedResult = movies.results;
            console.log(this.$store.state.searchedResult);
          })
    },
    kpHandler(e){
      if (e.key === 'Enter')
        this.searchClicked();
    },
    searchClicked(){
      if (this.userInput !== this.$store.state.userinput){
        this.$store.state.userinput = this.userInput;
        let apiKey = "ec8fb4c97f4c101a7e63dc22213b4106";
        this.$store.state.searchedResult = [];
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${this.$store.state.userinput}&page=1&include_adult=false`)
            .then(function (response){
              return response.json();
            })
            .then(movies => {
              this.$store.state.searchedResult = movies.results.filter(movie => movie.poster_path !== null)
              console.log(movies);
              if (this.$store.state.searchedResult.length > 0){
                this.$store.state.hasResults = true;

              }
              else {
                this.$store.state.hasResults = false;
              }
              console.log(this.$store.state.hasResults)

              console.log(this.$store.state.searchedResult);
            })

      }
    }
  },
  mounted() {

  },
}
</script>

<style scoped>
.amountFav {
  background: lightgray;
  padding: 17px 9px 5px 5px;
  margin: auto;
  color: black;
  border-radius: .25rem;
}
sup {
padding: 10px;
}
#navbarSupportedContent {
justify-content: flex-end;
margin-right: 3em;
}

.navbar-brand {
margin-left: 3rem;
}

.form-control, .form{
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

@media only screen and (max-width: 992px){
.navbar-toggler {
display: none;
}

#navbarSupportedContent{
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