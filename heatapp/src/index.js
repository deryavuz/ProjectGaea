// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals'

import React from 'react';
import document from 'global/document';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
export const enhancers = [applyMiddleware(taskMiddleware)];
export default createStore(keplerGlReducer, {}, composeEnhancers(...enhancers));




const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

render(<Root />, document.body.appendChild(document.createElement('div')));

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// This adds redux devtools to help in debugging
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
