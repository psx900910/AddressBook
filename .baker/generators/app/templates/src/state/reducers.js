/* eslint-disable object-shorthand, comma-dangle, eol-last, import/imports-first */

import { combineReducers } from 'redux-immutable';

// XX: Do not rename this variable if you want reducer generator
// to keep working properly (and you do want that, right?)
const applicationReducers = {
  removeThisReducerOnceYouAddALegitOne: () => ({}),
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
