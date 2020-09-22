<template>
  <div class="container">
    <div class="col col-lg-12 row">
        <div class="col-lg-12" style="margin-top: 50px; margin-bottom: 50px;">
            <h2>{{ msg }}</h2>
        </div>
        <div class="form-group col-lg-12">
            <label for="customerName">Name:</label>
            <input v-model="customerName" type="text" class="form-control" id="customerName">
        </div>
        <div class="form-group col-lg-12">
            <label for="customerUsername">Username:</label>
            <input v-model="customerUsername" type="text" class="form-control" id="customerUsername">
        </div>
        <div class="form-group col-lg-12">
            <label for="customerPassword">Password:</label>
            <input v-model="customerPassword" type="password" class="form-control" id="customerPassword">
        </div>
    </div>
    <div class="col-lg-12" style="margin-top: 50px;">
        <router-link v-bind:to="'/customerLogin'"><button type="button" class="btn btn-primary" >Back</button></router-link>
        <button type="button" class="btn btn-primary" @click="registerCustomer">Submit</button>
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
      msg: 'Customer Registration',
      customerName: '',
      customerUsername: '',
      customerPassword: '',
      responsemsg: ''
    }
  },
    methods: {
        registerCustomer: function(e) {
            console.log(process.env.ROOT_API)
                if (this.customerName && this.customerUsername && this.customerPassword) {
                    axios.post(process.env.ROOT_API+'/users/create', {
                      user : {
                                name: this.customerName,
                                username: this.customerUsername,
                                password: this.customerPassword
                                    }
                    })
                    .then(function (response) {
                      localStorage.userRegistrationSuccess = 'Customer registration successful'
                      router.go()
                    })
                    .catch(function (error) {
                      console.log(error);
                      localStorage.userRegistrationSuccess = 'User already exist'
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
