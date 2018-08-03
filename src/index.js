import { createAction, handleActions } from 'redux-actions'
import { flatMap, camelCase } from 'lodash'

let verbs = ['FETCH', 'SET', 'ASSIGN', 'CLEAR', 'ACTIVATE', 'DEACTIVATE']

export let makeActions = domain =>
  flatMap(
    verbs.map(x => [
      `${domain}_${x}`,
      `${domain}_${x}_SUCCESS`,
      `${domain}_${x}_FAILURE`,
    ]),
  ).reduce((acc, x) => {
    acc[camelCase(x.split(`${domain}_`).pop())] = createAction(x)
    return acc
  }, {})

let defaultState = () => ({
  error: null,
  loading: false,
})

export let makeReducer = (initialState = defaultState(), actions) =>
  handleActions(
    {
      [actions.fetch]: state => ({ ...state, loading: true }),
      [actions.fetchSuccess]: (state, { payload }) => ({
        loading: false,
        error: false,
        ...payload,
      }),
      [actions.fetchFailure]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
      }),
      [actions.set]: (state, { payload }) => payload,
      [actions.assign]: (state, { payload }) => ({ ...state, ...payload }),
      [actions.activate]: state => ({
        ...state,
        on: state.on || false,
        loading: true,
      }),
    },
    initialState,
  )
