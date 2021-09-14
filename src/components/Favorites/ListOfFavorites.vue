<template>
<div v-if="$store.state.favoriteMovies.length > 0">
  <div class="d-flex justify-content-center flex-wrap" style="margin-bottom: 5em">
    <div class="card" style="width: 18rem; margin: 20px"
         v-for="favorite in $store.state.favoriteMovies">
      <a @click="removeFavorite(favorite)">
        <font-awesome-icon class="faicons" :icon="['fas', 'minus-circle']" />
      </a>
      <router-link :to="'/movieinfo'+`?${favorite.id}`">
        <img :src="'https://image.tmdb.org/t/p/w1280/'+favorite.poster_path" class="card-img-top" :alt="favorite.title">
      </router-link>
      <div class="card-body">
        <router-link :to="'/movieinfo'+`?${favorite.id}`">
          <h5 class="card-title">{{ favorite.title }}</h5>
        </router-link>
        <!--<input type="button" @click="addToFavorites(movie)" value="Add To Favorites">-->
      </div>
    </div>
  </div>
  <input id="clearBtn" type="button"  @click="clearLst" value="Clear">
</div>
</template>

<script>
export default {
  name: "ListOfFavorites",
  beforeMount() {
    this.$store.state.favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
  },
  mounted() {
    if (this.$store.state.favoriteMovies.length === 0){
      this.$router.push("/");
    }
  },
  methods : {
    clearLst(){
      localStorage.setItem("favoriteMovies","");
      this.$store.state.favoriteMovies = [];
      this.$router.push('/');
    },
    removeFavorite(favorite){

      for(let i = 0; i < this.$store.state.favoriteMovies.length; i++){

        if ( this.$store.state.favoriteMovies[i].title === favorite.title) {

          this.$store.state.favoriteMovies.splice(i, 1);
        }

      }
      localStorage.setItem("favoriteMovies",JSON.stringify(this.$store.state.favoriteMovies));
      this.$forceUpdate;
      if (this.$store.state.favoriteMovies.length === 0){
        this.$router.push("/");
      }
    }
  }
}
</script>

<style scoped>
#clearBtn {
  position: fixed;
  bottom: 0px;
  right: 0px;
}
.faicons {
  color: red;
}
* {
  transition: background-color 0.3s;
}
input {
  font-size: 30px;
  padding: 10px;
  width: 100%;
  background-color: black;
  color: white;
  outline: none;
  border: 4px dotted black;
}
input:hover {
  background-color: white;
  border: 4px dotted black;
  color: black;
}

a {
  text-decoration: none;
  color: white;

}
.card {
  background-color: black;
  border: 3px solid black;
}

h5 {
  font-size: 17px;
}
a:hover {
  color: red;
}
.card-body {
  justify-content: center !important;
  margin: auto !important;
  flex: none;
}


</style>