<template>
  <div class="container" style="margin-top: 50px;"> 
    <div class="col-lg-12" style="margin-top: 50px; margin-bottom: 50px;">
            <h2>{{ msg }}</h2>
    </div>
    <div class="col col-lg-12 row">
        <div class="form-group col-lg-6">
            <label for="username">Username:</label>
            <input v-model="driverusername" type="text" class="form-control" id="username">
        </div>
        <div class="form-group col-lg-6">
            <label for="password">Password:</label>
            <input v-model="driverpassword" type="password" class="form-control" id="password">
        </div>
    </div>
  
    <div class="col-lg-12" style="margin-top: 50px;">
      <!-- <button type="button" class="btn btn-primary" @click="customerLogin">Login</button> -->
      <button type="button" class="btn btn-primary" @click="driverLogin">Login</button>
      <router-link v-bind:to="'/driverRegistration'"><button type="button" class="btn btn-primary" >Register</button></router-link>
    </div>
     <div class="col-lg-12" style="margin-top: 50px; margin-bottom: 50px;">
            <h5 style="color: red;">{{ errormsg }}</h5>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from '../router/index.js'
export default {
 mounted() {
      if (localStorage.driverusername != null ){
          this.$router.push(this.$route.query.redirect || '/driver')
         }
      if (localStorage.errormsg != ''){
           this.errormsg = localStorage.errormsg
         }
      if (localStorage.userRegistrationSuccess != ''){
           localStorage.userRegistrationSuccess = ''
         }
    },
  name: 'index',
  data () {
    return {
      msg: 'Login as Driver',
      driverusername: '',
      driverpassword: '',
      errormsg: ''

    }
  },
   methods: {
       driverLogin () {
         if (this.driverusername && this.driverpassword) {
                    axios.post(process.env.ROOT_API+'/drivers/login', {
                      username: this.driverusername,
                      password: this.driverpassword
                    })
                    .then(function (response) {
                      localStorage.drivername = response.data.name
                      localStorage.driverid = response.data.id
                      localStorage.driverusername = response.data.username
                      localStorage.errormsg = ''
                      router.go()
                    })
                    .catch(function (error) {
                      console.log(error);
                      localStorage.errormsg = 'Invalid username or password!'
                      router.go()
                    });
                }else{

                  localStorage.errormsg = 'Enter all necessary informations'
                  router.go()
                }
           
       }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
