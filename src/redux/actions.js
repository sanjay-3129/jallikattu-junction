import {DRAWER_STATE, USER} from './actionTypes';

export const setDrawerVisibility = visibility => ({
  type: DRAWER_STATE,
  payload: visibility,
});

export const setUser = user => ({
  type: USER,
  payload: user,
});
