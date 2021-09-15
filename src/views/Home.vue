<template>
  <div class="navcontainer">
    <Nav/>
    <Movies/>
  </div>
</template>

<style scoped>

.navcontainer {
  padding-top: 4.5rem;
}

@media only screen and (max-width: 975px){
  .navcontainer {
    padding-top: 9rem !important;
  }
}
@media only screen and (max-width: 565px) {
  .navcontainer {
    padding-top: 10rem !important;
  }
}
</style>
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
  beforeMount() {
    if (!localStorage.getItem("favoriteMovies")){
      localStorage.setItem('favoriteMovies',"");
    }
  },
}
</script>
