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
  <div class="col-lg-12 row" style="margin-top: 50px;">
    <div class="col-lg-6" >
      
      <label>
        <gmap-autocomplete
          @place_changed="setPickup">
        </gmap-autocomplete>
        <button type="button" class="btn btn-primary" @click="addPickup">Set Pickup Location</button>
      </label>
      <br/>

    </div>
    <div class="col-lg-6" >
      
      <label>
        <gmap-autocomplete
          @place_changed="setDropoff">
        </gmap-autocomplete>
        <button type="button" class="btn btn-primary" @click="addDropoff">Set Dropoff Location</button>
      </label>
      <br/>

    </div>
    <br>
    <div class="col-lg-12" style="margin-top: 50px;">
      <button id="estimateFare" type="button" class="btn btn-primary" @click="getRoute">Estimated Fare</button>
      <button id="bookButton" type="button" class="btn btn-primary" @click="submitBookingRequest">Book Taksi</button>
    </div>
  </div>
  <div class="col-lg-12 row" style="margin-top: 30px;margin-buttom: 30px;">
    <div class="col-lg-6">
      <h4>Total Distance: {{ distance }} KM</h4>
    </div>
    <div class="col-lg-6">
      <h4>Estimated Fare: {{ estimatedFare }} Euros</h4>
    </div>

  </div>
  <div class="col-lg-12">
    {{ messages }}
  </div>
  <div class="col-lg-12" style="color: red;">
    {{ notServing }}
  </div>

        
        <br>


    <div class="col-lg-12" style="padding-bottom: 30px;padding-top: 30px;">
        <button type="button" class="btn btn-primary" v-if="!CompleteFareisHidden" v-on:click="isHidden = !isHidden"> Complete Ride,  Pay {{ actualFare }} Euros</button>
     
    </div>

     <div class="col-lg-12" style="padding-bottom: 30px;">
        <button type="button" class="btn btn-primary"  v-on:click="reload()" v-if="!rebook" > Re book</button>
     
    </div>
    


    <div v-if="!isHidden" id="print" class="col-lg-12 row">
          <div class="col-lg-3"></div>
          <div class="col-lg-6" >
              <table style="width:100%">

                <tr><td>Invoice issuer: Taksify Company Inc</td></tr>
                <tr><td>Company bank account: EE123456789</td></tr>
                <tr><td>Invoice receiver: {{ shortname }}</td></tr>
                <tr><td>Invoice number: {{date}}{{time}}{{shortname}}</td></tr>


                <tr><td>Total Distance: {{ distance }} KM</td></tr>
                <tr><td>Fare: {{ actualFare }} Euros</td></tr>
                <tr><td>Date: {{date}} {{time}}</td></tr>
          
            </table>
    </div>

    <div class="col-lg-12" style="padding-bottom: 30px;padding-top: 30px;">   
     <button type="button" class="btn btn-primary" @click="print();isHidden = !isHidden">print invoice to pay with bank transfer</button>
    </div>
          
    </div>
      

  
  </div>
</template>
<script>
import router from '../router/index.js'
import socket from "../socket.js"
import axios from "axios"
import jsPDF from "jspdf"
export default {
  name: 'customer',
  data () {
    return {
      // default to Tartu to keep it simple
      // change this to whatever makes sense
      center: { lat: 58.3749923, lng: 26.69744 },
      markers: [],
      places: [],
      currentPlace: null,
      pickup: '',
      dropoff: '',
      distance: 0,
      estimatedFare: 0,
      name: 'Welcome '+localStorage.name,
      errors:[],
      isHidden: true,
      shortname: localStorage.name,
      date: new Date().getDate()+"."+new Date().getMonth()+"."+new Date().getFullYear(),
      time: new Date().getHours()+":"+new Date().getMinutes(),
      messages: '',
      actualFare: '',
      CompleteFareisHidden: true,
      notServing: '',
      rebook: true
    }
  },

  mounted () {
    this.geolocate()
    if (localStorage.username == '' ){
           this.$router.push(this.$route.query.redirect || '/customerLogin')
         }
    var channel = socket.channel("customer:lobby", {});
        channel.join()
            .receive("ok", resp => { console.log("Joined successfully", resp) })
            .receive("error", resp => { console.log("Unable to join", resp) });
     
        channel.on("requests", payload => {
           console.log(payload)

        });

    var channel2 = socket.channel("customer:"+localStorage.id, {});
        channel2.join()
            .receive("ok", resp => { console.log("Joined successfully", resp) })
            .receive("error", resp => { console.log("Unable to join", resp) });
       
        channel2.on("ride", payload => {
           this.actualFare = payload.cost
           this.CompleteFareisHidden = false
        });

        channel2.on("assign", payload => {
           this.messages = 'We have found you a ride!!!'
           this.notServing = ''
        });
  },

  methods: {
    // receives a place object via the autocomplete component
    setPickup (place) {
      this.currentPlace = place
    },
    setDropoff (place) {
      this.currentPlace = place
    },
    addPickup () {
      if (this.currentPlace && this.pickup === '') {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers[0] = { position: marker }
        this.places[0] = this.currentPlace
        this.center = marker
        this.currentPlace = null
        this.pickup = this.places[0].address_components[0].long_name +', '+this.places[0].address_components[1].long_name+', '+this.places[0].address_components[2].long_name
        console.log(this.pickup)
      } else {
        this.markers[0] = ''
        this.places[0]=''
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers[0] = { position: marker }
        this.places[0] = this.currentPlace
        this.center = marker
        this.currentPlace = null
        this.pickup = this.places[0].address_components[0].long_name +', '+this.places[0].address_components[1].long_name+', '+this.places[0].address_components[2].long_name
      }
    },     
    addDropoff () {
      if (this.currentPlace && this.dropoff === '') {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers[1] = { position: marker }
        this.places[1] = this.currentPlace
        this.center = marker
        this.currentPlace = null
        this.dropoff = this.places[1].address_components[0].long_name +', '+this.places[1].address_components[1].long_name+', '+this.places[1].address_components[2].long_name
      } else {
        this.markers[1] = ''
        this.places[1]=''
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers[1] = { position: marker }
        this.center = marker
        this.places[1] = this.currentPlace
        this.currentPlace = null
        this.dropoff = this.places[1].address_components[0].long_name +', '+this.places[1].address_components[1].long_name+', '+this.places[1].address_components[2].long_name
      }
    },
    getRoute: function () {
      this.$refs.gmap.$gmapApiPromiseLazy().then(() => { 
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        this.directionsDisplay.setMap(this.$refs.gmap.$mapObject)
        var vm = this
        vm.directionsService.route({
          origin: this.markers[0].position,
          destination: this.markers[1].position,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            vm.directionsDisplay.setDirections(response)
          } else {
            console.log('Directions request failed due to ' + status)
          }
        })
        })
        var lat1 = this.markers[0].position.lat
        var lat2 = this.markers[1].position.lat
        var lon1 = this.markers[0].position.lng
        var lon2 = this.markers[1].position.lng
        var unit = 'K'
        if ((lat1 == lat2) && (lon1 == lon2)) {
          this.distance = 0;
        }
        else {
          var radlat1 = Math.PI * lat1/180;
          var radlat2 = Math.PI * lat2/180;
          var theta = lon1-lon2;
          var radtheta = Math.PI * theta/180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) {
            dist = 1;
          }
          dist = Math.acos(dist);
          dist = dist * 180/Math.PI;
          dist = dist * 60 * 1.1515;
          if (unit=='K') { dist = dist * 1.609344 }
          if (unit=='N') { dist = dist * 0.8684 }
          this.distance = dist.toFixed(2);
          this.estimatedFare = (2+(dist * 1.5)).toFixed(2);
        }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    },
    logout (){
      localStorage.name = '',
      localStorage.id = '',
      localStorage.username =''
      this.$router.push(this.$route.query.redirect || '/')
    },
    submitBookingRequest () {
                if (this.pickup && this.dropoff) {
                    axios.post(process.env.ROOT_API+"/bookings/create",
                    {booking: {pickup_address: this.pickup,dropoff_address: this.dropoff }, username: localStorage.username})
                    .then(response => {
                        this.messages = response.data.msg;
                        this.places = []
                        this.currentPlace = null
                        document.getElementById("bookButton").disabled = true;
                        document.getElementById("estimateFare").disabled = true;
                    }).catch(error => {
                        console.log(error);
                    });
                }

                this.errors = [];
            setTimeout(this.cannotServe, 60000)
            
        },
      print(){
        var vm= this
        var columns=[
            {text:"Invoice issuer: Taksify"},
            {}
        ];
        var doc = new jsPDF('p', 'pt');
        
        doc.fromHTML(document.getElementById('print'),40, {'width': 270});
        doc.save("invoice.pdf")
        router.go()

    },
    cannotServe(){
      if(this.messages!= 'We have found you a ride!!!'){
      this.notServing = 'Sorry can not serve you at the moment'
      this.messages = ''
      this.rebook = false
      }
    },
    reload(){
      router.go()
    }
    
  }
}
</script>

<!-- styling for the component -->
<style>
#about {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
