
import { isFSA } from 'flux-standard-action';

// 打印日志
export const logger = store => next => action => {
    let result = next(action);
    return result
}

// redux-thunk
export const thunkMiddleware = ({dispatch, getState, extraArgument}) => {
    return next => action => {
        if(typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }
        return next(action);
    }
}

const isPromise = val => {
    return val && typeof val.then === 'function';
}

//redux-promise
export const promiseMiddleware = ({dispatch}) => {
  return next => action => {
    if(!isFSA(action)) {
      return isPromise(action) 
             ? action.then(dispatch) 
             : next(action);
    }
    return isPromise(action.payload)
           ?action.payload.then(
             result => dispatch({...action,payload: result}),
             error => {
               dispatch({...action,payload: error,error: true})
               return Promise.reject(error)
             }
           )
           :next(action)
  }
} 




