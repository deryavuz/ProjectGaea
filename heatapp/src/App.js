// import logo from './logo.svg';
// import './App.css';


import React from'react';
import KeplerGl from 'kepler.gl';
import {addDataToMap} from 'kepler.gl/actions';
import heat_data from './heat_data.json'
//const json = require('json-loader!./file.json');
const json = require('json-loader!./heat_data.json');

//delete json.PercentPerimeterToBeContained;



// Constant variables, environment variables
const token = process.env.MapboxAccessToken;
const height = 1000;
const width = 1000;

// import KeplerGl from'kepler.gl';
// const heatMap = (props) => (
//     <KeplerGlid="parking_map"mapboxApiAccessToken={mapboxAccessToken}width={props.width }
//           height={props.height }         
//     />
// );



const heatMap = props => (
  <KeplerGl
      id="foo"
      mapboxApiAccessToken={token}
      width={width}
      height={height}/>
);

export default heatMap;


this.props.dispatch(
  addDataToMap({
    // datasets
    datasets: {
      info: {
        label: 'Heat Data Recent',
        id: 'heat_data_api'
      },
      data: json
    },
    // option
    option: {
      centerMap: true,
      readOnly: false
    },
    // config
    config: {
      mapStyle: {styleType: 'light'}
    }
  })
);



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Hello gaea
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
