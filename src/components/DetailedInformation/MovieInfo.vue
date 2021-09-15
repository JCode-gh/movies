<template>
  <div class="card mb-3">
    <div v-if="movie" class="row g-0">
      <div class="col-md-4 image">
        <img :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" :alt="movie.title" class="img-fluid rounded-start"/>
      </div>
      <div class="col-md-8 m-auto">
        <div class="card-body">
          <h5 class="card-title">{{ movie.title }}</h5>
          <p class="card-text">{{ movie.overview }}</p>
          <p class="card-text">
            <small class="text-muted"
                   :style="{marginRight: hasMultipleGenres(movie) ? '2rem' : '0'}"
                    v-for="genre in movie.genres">{{genre.name}}</small></p>
          <div class="d-flex flex-column" >
            <a @click="addToFavorites(movie, index)">
              <font-awesome-icon id="faicon"
                                  class="faicons"
                                 :style="{color: isActive ? 'red' : 'black'}"
                                 :icon="['far', 'heart']" />
            </a>
            <div>
              <div>
                <input v-if="movie.homepage !== '' && !movie.homepage.includes('netflix')"
                       type="button" id="website" value="Visit Website"
                       @click="openWebsite(movie)">

                <input v-if="movie.homepage !== '' && movie.homepage.includes('netflix')" type="button" value="Watch on Netflix"
                       @click="openWebsite(movie)">
              </div>
            </div>
            <input type="button" id="goBack" value="Go back"
                   @click="$router.push('/');">
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <LoadingSpinner/>
    </div>
  </div>
  <AltTitles :collectionTitles="collectionTitles"/>
</template>

<script>
import AltTitles from "./AltTitles";
import LoadingSpinner from "../LoadingAnimation/LoadingSpinner";
export default {
  name: "MovieInfo",
  components: {LoadingSpinner, AltTitles},
  data: function () {
    return {
      movie: null,
      collectionTitles : null
    }
  },
  computed: {
    isActive() {
      if(!this.movie) return false
      const storeData = this.$store.state.favoriteMovies || []
      return storeData.some(obj => obj.id === this.movie.id)
    }
  },
  methods : {
    hasMultipleGenres(movie){
      return movie.genres.length > 1;
    },
    openWebsite(movie){
      window.open(`${movie.homepage}`)
    },
    async addToFavorites(movie, index) {
      await this.$store.commit('SET_MOVIES', movie);
      // this.$nextTick(() => {
      //   document.querySelectorAll('.faicons')[index].style.color = 'red';
      //   document.querySelectorAll('.card')[index].style.border = '3px solid red';
      // })
    }
  },
  beforeMount() {
    const queryString = window.location.search;
    let id = queryString.split('?')[1];
    let apiKey = "ec8fb4c97f4c101a7e63dc22213b4106";

    //Fetching details about movie
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
        .then(function (response) {
          return response.json();
        })
        .then(movie => {
          this.movie = movie;
          console.log("movie",movie);

          // Fetching collections of movie

          fetch(`https://api.themoviedb.org/3/search/collection?api_key=${apiKey}&language=en-US&query=${movie.original_title}`)
              .then(function (response) {
                return response.json();
              })
              .then(collection => {
                this.collectionTitles = collection.titles;
                console.log(collection);
              })
        })


  }
}
</script>

<style scoped>

* {
  transition: color 0.3s;
}

img {
  width: 300px;
  box-shadow: 0 0 10px -2px black;
}
input:hover  {
  color: red !important;
}
input {
  padding: 10px;
  background: black;
  color: white;
  outline: none;
  border: none;
  width: 100%;
}
.card {
  border: 4px dotted;
}


.image {
  display: flex;
  justify-content: flex-end;
  background: black url("https://thumbs.dreamstime.com/b/abstract-line-background-lines-vector-design-182560517.jpg");
}

ul {
  list-style: none;
}
.faicons {
  font-size: 30px;
}
.faicons:hover,.faicons:focus, .faicons:visited {
  color: red !important;
}
</style>