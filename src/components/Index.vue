<template>
  <div class="container">
    <div class="col col-lg-12 row" style="margin-top: 50px">
        <div class="col-lg-6">
            <router-link v-bind:to="'/customerLogin'"><button type="button" class="btn btn-secondary btn-lg" >Use app as Customer</button></router-link>
        </div>
         <div class="col-lg-6">
            <router-link v-bind:to="'/driverLogin'"><button type="button" class="btn btn-secondary btn-lg">Use app as Driver</button></router-link>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  mounted() {
      if (localStorage.errormsg != ''){
           localStorage.errormsg = ''
          }
      if (localStorage.userRegistrationSuccess != ''){
           localStorage.userRegistrationSuccess = ''
         }
    },
  name: 'index',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
