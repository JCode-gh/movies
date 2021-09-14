<template>
  <div>
    <Nav/>
    <Movies/>
  </div>
</template>

<script>
// @ is an alias to /src

import Movies from "../components/Home/Movies";
import Nav from "../components/Home/Nav";
export default {
  name: 'Home',
  components: {
    Nav,
    Movies
  },
  mounted() {
    if (!localStorage.getItem("favoriteMovies")){
      localStorage.setItem('favoriteMovies',"");
    }


  },
}
</script>
