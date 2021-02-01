import { combineReducers } from'redux';
import keplerGlReducer from'kepler.gl/reducers';
import appReducer from'./appReducer';
const reducers = combineReducers({
  keplerGl: mapReducer,
  app: appReducer,
});
export default reducers;



const mapReducer = keplerGlReducer
    .initialState({
         uiState: {
              readOnly: true,
              mapControls: {
                  visibleLayers: {
                      show: false
                  },
                  toggle3d: {
                       show: false
                  },
                  splitMap: {
                       show: true
                  },        
                  mapLegend: {
                       show: true,
                       active: false
                  }
             }
        }
});