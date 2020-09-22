<template>
  <div class="container">
    <div class="col col-lg-12 row">
        <div class="col-lg-12" style="margin-top: 50px; margin-bottom: 50px;">
            <h2>{{ msg }}</h2>
        </div>
        <div class="form-group col-lg-12">
            <label for="customerName">Name:</label>
            <input v-model="driverName" type="text" class="form-control" id="customerName">
        </div>
        <div class="form-group col-lg-12">
            <label for="customerUsername">Username:</label>
            <input v-model="driverUsername" type="text" class="form-control" id="customerUsername">
        </div>
        <div class="form-group col-lg-12">
            <label for="customerPassword">Password:</label>
            <input v-model="driverPassword" type="password" class="form-control" id="customerPassword">
        </div>
    </div>
    <div class="col-lg-12" style="margin-top: 50px;">
        <router-link v-bind:to="'/driverLogin'"><button type="button" class="btn btn-primary" >Back</button></router-link>
        <button type="button" class="btn btn-primary" @click="registerDriver">Submit</button>
    </div>
    <div class="col-lg-12" style="margin-top: 50px; margin-bottom: 50px;">
            <h5 style="color: red;">{{ responsemsg }}</h5>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from '../router/index.js'
export default {
    mounted() {
      if (localStorage.userRegistrationSuccess != ''){
           this.responsemsg = localStorage.userRegistrationSuccess
         }
    },
  name: 'index',
  data () {
    return {
      msg: 'Driver Registration',
      driverName: '',
      driverUsername: '',
      driverPassword: '',
      responsemsg: ''
    }
  },
    methods: {
        registerDriver: function(e) {
                if (this.driverName && this.driverUsername && this.driverPassword) {
                    axios.post(process.env.ROOT_API+'/drivers/create', {
                      taxi : {
                                name: this.driverName,
                                username: this.driverUsername,
                                password: this.driverPassword,
                                status: 'unavailable',
                                location: 'unknown'
                                
                            }
                    })
                    .then(function (response) {
                      localStorage.userRegistrationSuccess = 'Driver registration successful'
                      router.go()
                    })
                    .catch(function (error) {
                      console.log(error);
                      localStorage.userRegistrationSuccess = "User already exist"
                      router.go()
                    });
                }else {
                    this.responsemsg = 'Please enter all the informations!'
                }
               e.preventDefault();
            
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
