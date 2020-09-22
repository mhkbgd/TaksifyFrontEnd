<template>
  <div id="app" class="container">
    <router-link v-bind:to="'/'"><h1>{{ msg }}</h1></router-link>
    <router-view></router-view>
  </div>

 
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Taksify App'
    }
  }
}
</script>
<!-- styling for the component -->
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
