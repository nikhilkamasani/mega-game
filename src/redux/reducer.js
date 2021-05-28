import {SET_SIZE, SET_LENGTH, SET_SIZE_LENGTH} from "./actions";

// The initial state of the App
const initialState = {
  size: 0,
  length: 0,
};

export const selectors = {
  all(state) {
    return state;
  },
};

export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIZE: {
      if (state.size !== (action.size || 0)) {
        return Object.assign({}, state, {
          size: action.size || 0
        });
      }
      return state;
    }
    case SET_LENGTH: {
      if (state.length !== (action.length || 0)) {
        return Object.assign({}, state, {
          length: action.length || 0
        });
      }
      return state;
    }
    case SET_SIZE_LENGTH: {
      if ((state.length !== (action.length || 0)) || (state.size !== (action.size || 0))) {
        return Object.assign({}, state, {
          length: action.length || 0,
          size: action.size || 0
        });
      }
      return state;
    }
    default:
      return state;
  }
};
