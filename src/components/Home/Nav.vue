<template>
  <div id="nav">
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item navbar-brand">
            <input
              type="button"
              class="nav-link"
              value="Movies"
              style="background: none; color: red; outline: none; border: none"
              @click="showPopularMovies"
            />
          </li>
          <li
            class="nav-item navbar-brand d-flex flex-column-reverse"
            v-if="$store.state.favoriteMovies.length > 0"
          >
            <input
              type="button"
              class="nav-link"
              :value="'Favorites' + '(' + $store.state.favoriteMovies.length + ')'"
              style="background: none; color: red; outline: none; border: none"
              @click="pushFavorites"
            />
          </li>
        </ul>
        <n-config-provider>
          <n-input
            v-model:value="userInput"
            @keypress="kpHandler"
            placeholder="Search"
          ></n-input>
          <n-button @click="searchClicked">Search</n-button>
        </n-config-provider>
      </div>
    </nav>
    <nav
      class="d-flex justify-content-center p-2 fixed-bottom"
      id="filter"
      v-if="genresList.genres"
    >
      <h5 id="genre">Genre</h5>
      <select id="genreSelect" @change="genreChange" class="form-select">
        <option v-for="genre in genresList.genres" :value="genre.id" :key="genre.id">
          {{ genre.name }}
        </option>
      </select>
    </nav>
  </div>
</template>

<script>
import router from "../../router";
import { NInput, NButton, NConfigProvider } from "naive-ui";
export default {
  name: "Nav",
  components: {
    NInput,
    NButton,
    NConfigProvider,
  },
  data() {
    return {
      userInput: null,
      genresList: [],
    };
  },
  methods: {
    async genreChange(event) {
      localStorage.setItem("genreIdSelected", document.querySelector("select").value);
      localStorage.setItem(
        "genreIndexSelected",
        document.getElementById("genreSelect").selectedIndex
      );

      this.$store.commit("CLEAR_SEARCHEDRESULT");
      const genreId = event.target.value;
      await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${genreId}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(async (movies) => {
          await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${genreId}&page=2`
          )
            .then((response) => {
              return response.json();
            })
            .then((secondMovies) => {
              let arr = [];
              for (let mov of movies.results) {
                arr.push(mov);
              }
              for (let movie of secondMovies.results) {
                arr.push(movie);
              }
              this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", arr);
            });
        });
    },
    pushFavorites() {
      this.$router.push("/favorites");
    },
    async showPopularMovies() {
      this.$router.push("/");
      localStorage.removeItem("genreIndexSelected");
      localStorage.removeItem("genreIdSelected");
      this.$store.commit("CLEAR_USERINPUT");
      // document.querySelector(".form-control").value = "";
      this.$store.commit("SET_HASRESULTS_TRUE");
      this.$store.commit("CLEAR_SEARCHEDRESULT");
      await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`
      )
        .then(function (response) {
          return response.json();
        })
        .then((movies) => {
          this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", movies.results);
        });

      document.getElementById("genreSelect").selectedIndex = 0;
    },
    kpHandler(e) {
      if (e.key === "Enter") this.searchClicked();
    },
    async searchClicked() {
      if (this.userInput !== this.$store.state.userinput) {
        localStorage.removeItem("genreIdSelected");
        localStorage.removeItem("genreIndexSelected");
        this.$store.state.userinput = this.userInput;
        this.$store.commit("CLEAR_SEARCHEDRESULT");
        await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${this.$store.state.apiKey}&language=en-US&query=${this.$store.state.userinput}&page=1&include_adult=false`
        )
          .then(function (response) {
            return response.json();
          })
          .then((movies) => {
            this.$store.commit("MAKE_UNIQUE_SEARCHEDRESULT", movies.results);
          });
      }
    },
  },
  async beforeMount() {
    await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.$store.state.apiKey}&language=en-US`
    )
      .then(function (response) {
        return response.json();
      })
      .then((genreListFull) => {
        this.genresList = genreListFull;
      });
  },
  updated() {
    this.$nextTick(function () {
      if (
        document.getElementById("genreSelect") !== null &&
        localStorage.getItem("genreIndexSelected") !== null
      ) {
        document.getElementById("genreSelect").selectedIndex = parseInt(
          localStorage.getItem("genreIndexSelected")
        );
      }
    });
  },
};
</script>

<style scoped>
.amountFav {
  background: lightgray;
  padding: 17px 9px 5px 5px;
  margin: auto;
  color: black;
  border-radius: 0.25rem;
}
select {
  outline: none;
  border: none;
}
option:hover {
  color: red !important;
}

#filter {
  border-top: 2px dotted white;
}
#genre {
  margin-top: auto;
  margin-bottom: auto !important;
  margin-right: 20px;
  color: lightgrey;
}
sup {
  padding: 10px;
}
#navbarSupportedContent {
  justify-content: space-between;
  margin-right: 3em;
}

.navbar-brand {
  margin-left: 3rem;
}

.form-control,
.form {
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
  .form-control,
  .bg-danger {
    width: 75%;
    margin: auto;
  }
}
</style>
