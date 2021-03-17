

const apikey = 'N4rk05Lsxs6pG7FfzqYl18newiD5aJZB6zReT8Pn';
//const url =  'https://api.ambeedata.com/latest/by-country-code?countryCode=IN'

	
var optionsair = {
  method: 'GET',
  url: 'https://api.ambeedata.com/latest/by-postal-code',
  params: {postalCode: '90250', countryCode: 'US'},
  headers: {'x-api-key': apikey, 'Content-type': 'application/json'}
};

var optionsfire = {
    method: 'GET',
    url: 'https://api.ambeedata.com/latest/fire',
    params: {lat: '34.0522', lng: '118.2437'}, // LA Lat and Long for testing
    headers: {'x-api-key': apikey, 'Content-type': 'application/json'}
  };

const vm = new Vue({
        el: '#app',
       // render: h => h('vueApp'),

        //Mock data
        data() { 
          return {
            airDataString: String,
            airQuality: [],
            fireDataString: String,
            fireHazard: []
            
          }; 
        
        },

        methods: {
            containsKey(obj, key ) {
                return Object.keys(obj).includes(key);
            }
        },

        computed: {
            parameters(){
                return Object.values(this.airQuality).map(({
                    stations
                    
                }) => ({
                    stations
                }))
            }
        },

        

        mounted() {


            axios.request(optionsair).then(response => {

                this.airDataString = JSON.stringify(response.data, null, "\t");
                this.airQuality = response.data;
                console.log(this.listDataString);
                return response; 
                // this.results = response.data;
                // console.log("something");
            }),

            axios.request(optionsfire).then(response => {

                this.fireDataString = JSON.stringify(response.data, null, "\t");
                this.fireHazard = response.data;
                console.log(this.listDataString);
                return response; 
                // this.results = response.data;
                // console.log("something");
            })

 
        }

            // airQuality:  {"BTC": {"USD":3759.91,"EUR":3166.21}, 
            //         "ETH": {"USD":281.7,"EUR":236.25}}
            //airQuality: {NO2 : '5.31%', CO : '0.32%', PM25: '4.5%'}
            // results: {"BTC": {"USD":3759.91,"EUR":3166.21}, 
            //         "ETH": {"USD":281.7,"EUR":236.25}}

            // airQuality: {
            //     "NO2": 5.31,
            //     "PM10": 52.01,
            //     "PM25": 32,
            //     "CO": 0.36,
            //     "SO2": 2.31,
            //     "OZONE": 2.26,
            //     "AQI": 93,
            //     "updatedAt": "2020-10-07 08:00:00",
            //     "aqiInfo": {
            //         pollutant:"PM2.5",
            //         concentration:32,
            //         category:"Moderate"
            //     }
            // }
      
        
    });


    
      