<template>
  <div class="container row col-lg-12" style="margin-top: 50px;">
    <div class="col-lg-12 row" style="margin-bottom: 50px;">
      <div class="col-lg-6">
        <h3>{{ name }}</h3>
      </div>
    
  </div>
        <gmap-map ref="gmap"
      :center="center"
      :zoom="12"
      style="width:100%;  height: 400px;"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
    
    <div class="col-lg-12">
        <table class="table" id="bookingRequest">
          <thead>
            <tr>
              <th scope="col">Pickup Address</th>
              <th scope="col">Dropoff Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ ridePickup }}</td>
              <td>{{ rideDropOff }}</td>
            </tr>
          </tbody>
        </table>
      </div>

       <div class="col-lg-12" style="padding-top: 30px;">
            <label for="actualFare">Actual Fare(Euros):</label>
            <input v-model="actualFare" type="text" class="form-control" id="actualFare" style="paddin-bottom: 30px;">
        </div>
        <div class="col-lg-12" style="padding-top: 20px;">
            <button type="button" class="btn btn-danger" @click="finishBooking()">Finish Booking</button>
        </div>
         <div class="col-lg-12" style="padding-top: 20px;">
            <p style="color: red">{{ warning }}</p>
        </div>

</div>
</template>

<script>
import axios from "axios";
import router from '../router/index.js'
import socket from "../socket.js";
var bookingData = []
export default {
  mounted() {
        if (localStorage.driverusername == ''){
           this.$router.push(this.$route.query.redirect || '/driverLogin')
         }
        if (localStorage.rideId == ''){
           this.$router.push(this.$route.query.redirect || '/driver')
         }else{

                this.$refs.gmap.$gmapApiPromiseLazy().then(() => { 
                this.directionsService = new google.maps.DirectionsService()
                this.directionsDisplay = new google.maps.DirectionsRenderer()
                this.directionsDisplay.setMap(this.$refs.gmap.$mapObject)
                var vm = this
                vm.directionsService.route({
                origin: localStorage.ridePickup,
                destination: localStorage.rideDropOff,
                travelMode: 'DRIVING'
                }, function (response, status) {
                if (status === 'OK') {
                    vm.directionsDisplay.setDirections(response)
                } else {
                    console.log('Directions request failed due to ' + status)
                }
                })
                })
        }

       
},
  name: 'Driver',
  data () {
    return {
      msg: 'Loged in as driver',
      errormsg: '',
      name: 'Welcome '+localStorage.drivername,
      messages: '',
      rideId: localStorage.rideId,
      ridePickup: localStorage.ridePickup,
      rideDropOff: localStorage.rideDropOff,
      center: { lat: 58.3749923, lng: 26.69744 },
      markers: [],
      actualFare: '0.00',
      warning: ''
    }
  },
   methods: {
      logout (){
      localStorage.drivername = '',
      localStorage.driverid = '',
      localStorage.driverusername ='',
      localStorage.rideId = '',
      localStorage.ridePickup = '',
      localStorage.rideDropOff = ''
      notavailable()
      this.$router.push(this.$route.query.redirect || '/')
    },
    finishBooking(){
        if(this.actualFare != '0.00'){
            axios.post(process.env.ROOT_API+'/bookings/finish', {
                     
                        bookingID: localStorage.rideId,
                        cost: this.actualFare
                       
                      
                    })
                    .then(function (response) {
                        localStorage.rideId = '',
                        localStorage.ridePickup = '',
                        localStorage.rideDropOff = ''
                        router.go()
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
        }else{
            this.warning = 'Please enter an amount for the ride'
        }
       
    }
  
   }
}
</script>