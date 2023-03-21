import {combineReducers} from 'redux';
import {DRAWER_STATE, NEWUSER, USER} from './actionTypes';

const initialState = {
  drawerVisibility: false,
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DRAWER_STATE: {
      return {
        ...state,
        drawerVisibility: action.payload,
      };
    }
    case USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({reducer});
