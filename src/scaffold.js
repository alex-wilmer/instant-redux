import { createAction, handleActions } from 'redux-actions'
import { flatMap, camelCase, mapKeys, omit } from 'lodash'

// TODO: unit tests

export let makeActions = ({
  domain,
  DOMAIN = domain.toUpperCase(),
  verbs,
  adverbs,
}) =>
  flatMap(
    verbs.map(v => [
      `${DOMAIN}_${v.toUpperCase()}`,
      ...adverbs.map(q => `${DOMAIN}_${v.toUpperCase()}_${q.toUpperCase()}`),
    ]),
  ).reduce((acc, x) => {
    acc[camelCase(x.split(`${DOMAIN}_`).pop())] = createAction(x)
    return acc
  }, {})

let defaultAsyncState = () => ({
  error: null,
  loading: false,
})

// TODO: normalize "data" and "error" keys for consistency

export let makeReducer = ({
  domain,
  // null is a valid starting state
  // noll coalesce operator would be great here
  initialState = domain.initialState === undefined
    ? defaultAsyncState()
    : domain.initialState,
  resolvers = domain.resolvers || {},
  actions,
}) =>
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
      [actions.assigndeep]: (state, { payload }) => ({
        ...state,
        [payload.key]: { ...(state[payload.key] || {}), ...payload.value },
      }),
      [actions.omit]: (state, { payload }) => omit(state, payload),
      [actions.concat]: (state, { payload }) => state.concat(payload),
      [actions.reset]: () => initialState,
      RESET: () => initialState,
      ...mapKeys(
        resolvers,
        (v, k) => `${domain.name.toUpperCase()}_${k.toUpperCase()}`,
      ),
    },
    initialState,
  )

export default lexicon =>
  lexicon.domains.reduce(
    (acc, d) => {
      let actions = makeActions({
        ...lexicon,
        domain: d.name,
        verbs: [...lexicon.verbs, ...Object.keys(d.resolvers || {})],
      })
      acc.actions[d.name] = actions
      acc.reducers[d.name] = makeReducer({ domain: d, actions })
      return acc
    },
    { actions: {}, reducers: {} },
  )
