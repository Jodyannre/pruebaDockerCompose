import { loginTypes } from '../../types/loginTypes'

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case loginTypes.login:
      return {
        ...state,
        logged: true,
        user: action.payload,
      }
    case loginTypes.logout:
      return {
        logged: false,
      }
    default:
      return state
  }
}
