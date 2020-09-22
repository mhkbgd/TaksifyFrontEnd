<template>
  <div class="container" style="margin-top: 50px;">
    <div class="col-lg-12" style="margin-top: 50px; margin-bottom: 50px;">
            <h2>{{ msg }}</h2>
    </div>
    <div class="col col-lg-12 row">
        <div class="form-group col-lg-6">
            <label for="username">Username:</label>
            <input v-model="username" type="text" class="form-control" id="username">
        </div>
        <div class="form-group col-lg-6">
            <label for="password">Password:</label>
            <input v-model="password" type="password" class="form-control" id="password">
        </div>
    </div>
  
    <div class="col-lg-12" style="margin-top: 50px;">
      <!-- <button type="button" class="btn btn-primary" @click="customerLogin">Login</button> -->
      <button type="button" class="btn btn-primary" @click="customerLogin">Login</button>
      <router-link v-bind:to="'/customerRegistration'"><button type="button" class="btn btn-primary" >Register</button></router-link>
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
      console.log(localStorage.username)
      if (localStorage.username != null){
           this.$router.push(this.$route.query.redirect || '/customer')
         }
      if (localStorage.errormsg != ''){
           this.errormsg = localStorage.errormsg
         }
      if (localStorage.userRegistrationSuccess != ''){
           localStorage.userRegistrationSuccess = ''
         }
    },
  name: 'CustomerLogin',
  data () {
    return {
      msg: 'Log in as customer',
      username: '',
      password: '',
      errormsg: ''
      
    }
  },
   methods: {
       customerLogin () {
           if (this.username && this.password) {
                    axios.post(process.env.ROOT_API+'/users/login', {
                      username: this.username,
                      password: this.password
                    })
                    .then(function (response) {
                      localStorage.name = response.data.name
                      localStorage.id = response.data.id
                      localStorage.username = response.data.username
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
