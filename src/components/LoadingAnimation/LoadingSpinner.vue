<template>
  <div class="classic-1"></div>
</template>

<script>
export default {
  name: "LoadingSpinner"
}
</script>

<style scoped>

.classic-1 {
  font-weight: bold;
  font-family: monospace;
  display: grid;
  color: white;
  font-size: 50px;
  margin: auto;
}
.classic-1:before,
.classic-1:after {
  content:"Loading...";
  grid-area: 1/1;
  -webkit-mask:linear-gradient(90deg,#000 50%,#0000 0) 0 50%/2ch 100%;
  animation:c1 1s infinite cubic-bezier(0.5,220,0.5,-220);

}
.classic-1:after {
  -webkit-mask-position:1ch 50%;
  --s:-1;
}
@keyframes c1 {100%{transform: translateY(calc(var(--s,1)*0.1%));}}
</style>