import { CLEAR_USER } from '../actions/auth'

export const defaultState = {
  user: null,
}

export default (state = defaultState, action) => {
  const newState = Object.assign({}, state)

  switch (action.type) {
    case CLEAR_USER:
      newState.user = null
      return newState

    default:
      return state
  }
};
