// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import the vue instance
import Vue from 'vue'
// import the App component
import App from './App'
// import the hello component
import Index from './components/Index'
// import the about component
import Customer from './components/Customer'
// import the driver component
import Driver from './components/Driver'
// import the vue router
import VueRouter from 'vue-router'
// import the customer login componenet
import CustomerLogin from './components/CustomerLogin'
// import the customer login componenet
import CustomerRegistration from './components/CustomerRegistration'
// import the driver login componenet
import DriverLogin from './components/DriverLogin'
// import the customer login componenet
import DriverRegistration from './components/DriverRegistration'
// import the customer currentRide componenet
import CurrentRide from './components/CurrentRide'
//import vue2 google map
import * as VueGoogleMaps from 'vue2-google-maps'



Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCkn0Qv3N0spHuxAOH2cyZHVpqHajLrWp0',
    libraries: 'places'
  }
})
// tell vue to use the router
Vue.use(VueRouter)

// define your routes
const routes = [
  // define the root url of the application.
  { path: '/', component: Index },
  // route for the customer page
  { path: '/customer', component: Customer },
  //route for the driver page
  { path: '/driver', component: Driver },
  //route for customer loginpage
  { path: '/customerLogin', component: CustomerLogin},
  //route for customer registration page
  { path: '/CustomerRegistration', component: CustomerRegistration},
  //route for driver loginpage
  { path: '/driverLogin', component: DriverLogin},
  //route for driver registration
  { path: '/driverRegistration', component: DriverRegistration},
   //route for driver registration
  { path: '/currentRide', component: CurrentRide}

]

// Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
})

// instatinat the vue instance
new Vue({
// define the selector for the root component
  el: '#app',
  // pass the template to the root component
  template: '<App/>',
  // declare components that the root component can access
  components: { App },
  // pass in the router to the Vue instance
  router
}).$mount('#app') // mount the router on the app
