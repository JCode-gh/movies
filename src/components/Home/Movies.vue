<template>
  <div class="fullMovieContainer">
    <div v-if="$store.state.hasResults === false">
      <h1 id="noresults">No results</h1>
    </div>
    <div
      class="d-flex flex-wrap justify-content-center"
      v-if="$store.state.searchedResult.length > 0"
      ref="movieContainer"
    >
      <div
        class="card"
        style="width: 18rem; margin: 20px"
        v-for="(movie, index) in $store.state.searchedResult"
        :style="{ borderColor: isActive(movie) ? 'red' : 'darkgray' }"
        :ref="index === $store.state.searchedResult.length - 1 ? 'lastMovie' : ''"
      >
        <router-link :to="'/movieinfo' + `?${movie.id}`">
          <img
            class="image_placeholder card-img-top"
            :src="'https://image.tmdb.org/t/p/w1280/' + movie.poster_path"
            :alt="movie.title"
          />
        </router-link>
        <div class="card-body">
          <router-link :to="'/movieinfo' + `?${movie.id}`">
            <h5 class="card-title">{{ movie.title }}</h5>
          </router-link>
          <a @click="addToFavorites(movie, index)">
            <font-awesome-icon
              class="faicons"
              :icon="['far', 'heart']"
              :style="{ color: isActive(movie) ? 'red' : 'lightgray' }"
            />
          </a>
        </div>
      </div>
    </div>
    <div
      v-else-if="
        $store.state.hasResults === true && $store.state.searchedResult.length <= 0
      "
    >
      <LoadingSpinner />
    </div>
    <div ref="sentinel" class="sentinel"></div>
  </div>
</template>


<script>
import LoadingSpinner from "../LoadingAnimation/LoadingSpinner";
import {NButton} from "naive-ui";
export default {
  name: "TopMovies",
  components: {
    LoadingSpinner,
    NButton,
  },
  data() {
    return {
      currentPage: 1,
      isAdded: Boolean,
      movieContainer: null,
    };
  },
  methods: {
    handleScroll() {
      const movieContainer = this.$refs.movieContainer;
      console.log(movieContainer);
      if (this.movieContainer) {
        const containerHeight = movieContainer.clientHeight;
        const scrollTop = movieContainer.scrollTop;
        const scrollHeight = movieContainer.scrollHeight;
        
        // Adjust the threshold as needed
        const threshold = 100;

        // Check if we are near the bottom of the container
        if (scrollHeight - (scrollTop + containerHeight) < threshold) {
          // Load the next page when near the bottom
          this.loadNextPage();
        }
      }
    },
    async loadNextPage() {
      // Increment the page number
      this.currentPage++;

      // Update the API URL to include the current page
      const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=${this.currentPage}`;

      console.log("Loading next page", this.currentPage); // Debug log

      try {
        const response = await fetch(apiUrl);
        const movies = await response.json();

        // Check if there are results
        if (movies.results.length > 0) {
          // Append the new results to the existing results
          this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", movies.results);

          console.log("New movies loaded", movies.results); // Debug log
        } else {
          // No more results, handle accordingly
          console.log("No more results");
        }
      } catch (error) {
        console.error("Error loading next page:", error);
      }
    },
    isActive(movie) {
      if (!movie) return false;
      const storeData = this.$store.state.favoriteMovies || [];
      return storeData.some((obj) => obj.id === movie.id);
    },
    async addToFavorites(movie) {
      if (this.$store.state.favoriteMovies.find((mov) => mov.id === movie.id)) {
        await this.$store.commit("REMOVE_FAVMOVIE", movie);
      } else {
        await this.$store.commit("SET_FAVMOVIES", movie);
      }
    },
    handleIntersection(entries) {
      const sentinelEntry = entries[0];
      if (sentinelEntry.isIntersecting) {
        console.log("Sentinel is intersecting"); // Debug log
        this.loadNextPage();
      }
    },
  },
  beforeDestroy() {
    // Remove the scroll event listener when the component is destroyed
    const movieContainer = this.$refs.movieContainer;
    if (movieContainer) {
      movieContainer.removeEventListener("scroll", this.handleScroll);
    }
  },
  async mounted() {
    this.$store.commit("CLEAR_SEARCH_FAVMOVIES_ARRAYS");

     // Use $nextTick to ensure the DOM is rendered
     this.$nextTick(() => {
      // Access the DOM element after it's rendered
      this.movieContainer = this.$refs.movieContainer;

      // Create an Intersection Observer to detect when the last movie card is in view
     // Adjusted Intersection Observer setup
     const observer = new IntersectionObserver(this.handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    // Observe the sentinel element
    const sentinel = this.$refs.sentinel;
    if (sentinel) {
        observer.observe(sentinel);
        console.log("Observer initialized for sentinel"); // Debug log
      } else {
        console.error("Sentinel not found"); // Error log
      }

      // Add a scroll event listener to the movie container
      console.log(this.movieContainer);
      if (this.movieContainer) {
        this.movieContainer.addEventListener("scroll", this.handleScroll);
      }
    });

    if (localStorage.getItem("genreIdSelected")) {
      let genreId = localStorage.getItem("genreIdSelected");

      await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${genreId}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((movies) => {
          this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", movies.results);
        });
    } else {
      await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`
      )
        .then(function (response) {
          return response.json();
        })
        .then((movies) => {
          this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", movies.results);
        });
    }

    if (localStorage.getItem("favoriteMovies")) {
      this.$store.commit("GET_FAVMOVIES_FROM_LST");
    }
  },
};
</script>

<style scoped>
#noresults {
  color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
}
.image_placeholder {
  background: url("../../assets/placeholder.png") no-repeat !important;
}

.fullMovieContainer {
  margin-bottom: 4em;
}
.faicons {
  color: white;
  font-size: 20px;
}
.faicons:hover {
  color: red !important;
}
a {
  text-decoration: none;
  color: white;
}
.card {
  background-color: black;
  border: 3px solid white;
}
img {
  transition: transform 0.2s;
}
img:hover {
  transform: scale(0.98);
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

.sentinel {
    height: 1px;
  }
</style>
