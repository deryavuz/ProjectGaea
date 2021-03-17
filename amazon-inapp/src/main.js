import Vue from 'vue'
import VueToast from 'vue-toast-notification';
// import App from './App.vue'
import axios from 'axios'
//import VueAxios from 'vue-axios'

// Css imports
import 'vue-toast-notification/dist/theme-sugar.css';


Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h('#app'),


  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

Vue.use(VueToast);

// let instance = Vue.$toast.open({
//   message: 'Fire spread alert!',
//   type: 'warning',
//   position: 'bottom',
//   dismissible: 'true',

// });




