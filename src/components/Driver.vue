<template>
  <div class="container row col-lg-12" style="margin-top: 50px;">
    <div class="col-lg-12 row" style="margin-bottom: 50px;">
      <div class="col-lg-6">
        <h3>{{ name }}</h3>
      </div>
     <div class="col-lg-6">
        <button type="button" class="btn btn-primary" @click="logout">Logout</button>
      </div>
  </div>
    <div class="col-lg-12 row">
      <div class="col-lg-6">
        
        <h5> your status is {{status}}</h5>
      </div>
    <div class="col-lg-6">
         
        <button type="button" class="btn btn-primary" @click="available();isHidden = !isHidden" v-if="isHidden">Set you status AVAILABLE</button>
        <button type="button" class="btn btn-primary" @click="notavailable();isHidden = true" v-if="!isHidden">Set your status UNAVAILABLE</button>
      </div>

    </div>
    
    
    
    
    <div v-if="!isHidden" id="bookings" class="col-lg-12" style="padding-top: 50px;text-align: center;">

      <table class="table" id="bookingRequest">
          <thead>
            <tr>
              <th scope="col">Pickup Address</th>
              <th scope="col">Dropoff Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ currentPickup }}</td>
              <td>{{ currentDropoff }}</td>
            </tr>
          </tbody>
    </table>
    <div class="col-lg-12" style="padding-top: 50px;">
      <button type="button" class="btn btn-primary" @click="acceptBooking()">Accept</button>
      <button type="button" class="btn btn-danger" @click="DeclineBooking()">Decline</button>
    </div>
     <div class="col-lg-12" style="padding-top: 50px;">
       <p style="color: red;">{{ messages }}</p>
    </div>
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
        if(localStorage.driverAvailable == 'yes'){
          this.isHidden = false
        }else {
          this.isHidden = true
        }
    var channel = socket.channel("driver:lobby", {});
        channel.join()
            .receive("ok", resp => { console.log("Joined successfully", resp) })
            .receive("error", resp => { console.log("Unable to join", resp) });

        channel.on("requests", payload => {
            
            this.bookingData.push(payload)
            this.currentPickup = this.bookingData[0].booking.pickup_address
            this.currentDropoff = this.bookingData[0].booking.dropoff_address
            console.log(this.bookingData)
        });

        channel.on("remove", payload => {
            for (var i = 0; i < this.bookingData.length; i++) { 
                  console.log(payload.booking_id)
                  console.log(this.bookingData[i].booking_id)
                  if(payload.booking_id == this.bookingData[i].booking_id){
                     this.$delete(this.bookingData,i)
                      console.log('test')
                      
                      if (this.bookingData !=''){
                      this.currentPickup = this.bookingData[0].booking.pickup_address
                      this.currentDropoff = this.bookingData[0].booking.dropoff_address
                      }else{
                        this.currentPickup = ''
                        this.currentDropoff = ''
                      }
                  }
                }

           
            console.log(payload)  
        });

          
      var channel2 = socket.channel("driver:"+localStorage.driverid, {});
              channel2.join()
                  .receive("ok", resp => { console.log("Joined successfully", resp) })
                  .receive("error", resp => { console.log("Unable to join", resp) });
        
      channel2.on("assign", payload => {
            localStorage.ridePickup = this.currentPickup
            localStorage.rideDropOff = this.currentDropoff
            localStorage.rideId = this.bookingData[0].booking_id
            this.$router.push(this.$route.query.redirect || '/currentRide')
            
        });
     
    },
  name: 'Driver',
  data () {
    return {
      msg: 'Loged in as driver',
      errormsg: '',
      name: 'Welcome '+localStorage.drivername,
      id: localStorage.id,
      isHidden: true,
      status: "unavailable",
      messages: '',
      currentPickup: '',
      currentDropoff: '',
      bookingData: []
    }
  },
   methods: {
      logout (){
      localStorage.drivername = '',
      localStorage.driverid = '',
      localStorage.driverusername =''
      this.notavailable()
      this.$router.push(this.$route.query.redirect || '/')
    },
    available(){
      localStorage.driverAvailable = 'yes'        
      axios.post(process.env.ROOT_API+'/drivers/update', {
                      taxi : {
                        id: this.id,
                        status: "available",
                                
                            }
                    })
      this.status = "available"  
    },
    notavailable(){
      localStorage.driverAvailable = 'no'
      axios.post(process.env.ROOT_API+'/drivers/update', {
                      taxi : {
                        id: this.id,
                        status: "unavailable",
                                
                            }
                    }) 
    
      this.status = "unavailable"

    },
   acceptBooking(){
       
    if(this.bookingData != ''){
      axios.post(process.env.ROOT_API+'/bookings/assign', {
                     
                        booking_id: this.bookingData[0].booking_id,
                        driver_id: localStorage.driverid
                       
                      
                    })
                    .then(function (response) {
                       
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
    }else{

      this.messages = 'There is no active booking at the moment!'
    }
   },
   DeclineBooking(){

     this.$delete(this.bookingData,0)
      
      if (this.bookingData !=''){
      this.currentPickup = this.bookingData[0].booking.pickup_address
      this.currentDropoff = this.bookingData[0].booking.dropoff_address
      }else{
        this.currentPickup = ''
        this.currentDropoff = ''
      }
   }
    
       
   }
}
</script>
