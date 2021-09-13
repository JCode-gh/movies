<template>
<div>
  <Nav/>
  <ListOfFavorites/>
</div>
</template>

<script>
import Nav from "../components/Home/Nav";
import ListOfFavorites from "../components/Favorites/ListOfFavorites";
export default {
  name: "Favorites",
  components: {ListOfFavorites, Nav}
}
</script>

<style scoped>

</style>