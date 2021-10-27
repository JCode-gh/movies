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
          <star-rating class="mb-3 starrating" style="text-align: center; justify-content: center !important;"
                       :rating="movie.vote_average/2"
                       :increment="0.2"
                       :read-only="true"
                       :show-rating="false"
                       :star-size="20"
          />
          <div class="d-flex flex-column" >
            <div>
              <div>
                <input v-if="collectionTitles.length > 0" type="button" id="collection" value="View Collection"
                       @click="showModal()">
                <input v-if="movie.homepage !== '' && !movie.homepage.includes('netflix')"
                       type="button" id="website" value="Visit Website"
                       @click="openWebsite(movie)">

                <input v-if="movie.homepage !== '' && movie.homepage.includes('netflix')"
                       type="button" value="Watch on Netflix"
                       @click="openWebsite(movie)">
              </div>
            </div>
            <input type="button" id="goBack" value="Go back"
                   @click="$router.push('/');">

            <!--<input type="button" id="fz" value="TEST ROUTER"
                   @click="$router.push('/newestmovies');">-->
          </div>
        </div>
      </div>
      <div>
        <iframe width="560" height="315" :src="`https://www.youtube.com/embed/${trailer}`" title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
    <div v-else>
      <LoadingSpinner/>
    </div>
  </div>
  <div id="displayCollectionTitles" v-if="collectionTitles.length > 0">
    <AltTitles :collectionTitles="collectionTitles"/>
  </div>
</template>

<script>
import AltTitles from "./AltTitles";
import LoadingSpinner from "../LoadingAnimation/LoadingSpinner";
import StarRating from 'vue-star-rating'
export default {
  name: "MovieInfo",
  components: {LoadingSpinner, AltTitles, StarRating},
  data: function () {
    return {
      movie: null,
      collectionTitles : [],
      trailer : null
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
    showModal(){
      alert('Feature not added yet.')
    },
    hasMultipleGenres(movie){
      return movie.genres.length > 1;
    },
    openWebsite(movie){
      window.open(`${movie.homepage}`)
    },
    fetchTrailer(id){
      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${this.$store.state.apiKey}&language=en-US`)
          .then(function (response) {
            return response.json();
          })
          .then(trailer => {
            this.trailer = trailer.results[0].key;
            console.log(this.trailer);
          })
    }
  },
  beforeMount() {
    const queryString = window.location.search;
    let id = queryString.split('?')[1];

    //Fetching details about movie
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.$store.state.apiKey}&language=en-US`)
        .then(function (response) {
          return response.json();
        })
        .then(movie => {
          this.movie = movie;

          // Fetching collections of movie
          fetch(`https://api.themoviedb.org/3/search/collection?api_key=${this.$store.state.apiKey}&language=en-US&query=${movie.original_title}`)
              .then(function (response) {
                return response.json();
              })
              .then(collection => {
                console.log(collection);
                if (collection.results.length > 0)
                  this.collectionTitles = collection.results;
              })
        })
    this.fetchTrailer(id);
  }
}
</script>

<style scoped>

#displayCollectionTitles{
  display: none;
}
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
  border-top: 2px solid white;
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

@media only screen and (min-width: 768px){
  .card {
    position: fixed;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    width: 100%;
    transform: translate(-50%, -50%);
  }
}

@media only screen and (max-width: 768px) {
  .image {
    justify-content: center;
  }
}
</style>