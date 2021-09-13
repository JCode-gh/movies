<template>

  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4 image">
        <img :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" :alt="movie.title" class="img-fluid rounded-start">
      </div>
      <div class="col-md-8 m-auto">
        <div class="card-body">
          <h5 class="card-title">{{ movie.title }}</h5>
          <p class="card-text">{{movie.overview}}</p>
          <p class="card-text"><small class="text-muted" style="margin-right: 2rem" v-for="genre in movie.genres">{{genre.name}}</small></p>
          <input type="button" value="Go back" style="padding: 10px; background: black; color: white; outline: none; border: none;"
          @click="$router.push('/');">
        </div>
      </div>
    </div>
  </div>




</template>

<script>
export default {
  name: "MovieInfo",
  data(){
    return {
      movie : [],
      imagesLoaded : false
    }
  },
  beforeMount() {
    const queryString = window.location.search;
    let id = queryString.split('?')[1];
    let apiKey = "ec8fb4c97f4c101a7e63dc22213b4106";

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
        .then(function (response) {
          return response.json();
        })
        .then(movie => {
          this.movie = movie;
          console.log(this.movie);
          Promise.all(Array.from(document.images).filter(img => !img.complete)
              .map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
            this.imagesLoaded = true;
          });
        })

  }
}
</script>

<style scoped>
img {
  width: 300px;
  box-shadow: 0px 0px 10px -2px black;
}

.imgtextcontainer {
  justify-content: space-evenly;

}

.card {
  border: 4px dotted;
}

.titletextcontainer {
  margin: auto;
}

.imgtextcontainer p {

}

.image {
  background: black;
  display: flex;
  justify-content: flex-end;
  background-image: url("https://thumbs.dreamstime.com/b/abstract-line-background-lines-vector-design-182560517.jpg");
}

ul {
  list-style: none;
}
</style>