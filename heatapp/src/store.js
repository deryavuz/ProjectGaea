import {createStore, applyMiddleware, compose} from'redux';
import {taskMiddleware} from'react-palm';
import reducers from'./reducers';
const initialState = { };
const middlewares = [ taskMiddleware ];
const enhancers = [applyMiddleware(...middlewares)];
// exportdefault createStore(
//   reducers,
//   initialState,
//   compose(...enhancers)
// );

const store = createStore(reducers, initialState, enhancers);




// //// Introduces React to the application. 


// import keplerGlReducer from "kepler.gl/reducers";
// import {createStore, applyMiddleware} from "redux";
// export default createStore(keplerGlReducer, {}, applyMiddleware(taskMiddleware));
// import {taskMiddleware} from "react-palm/tasks";
// import appReducer from "./reducers/index.js";
// import window from "global/window";
// import {createStore, combineReducers, applyMiddleware} from "redux";

// const reducer = combineReducers({
//     // kepler.gl reducer
//     keplerGl: keplerGlReducer,
//      // And any other existing reducers
//     app: appReducer
// });

// const store = createStore(reducer, {}, applyMiddleware(taskMiddleware));



