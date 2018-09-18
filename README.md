# terms-to-redux

# install

```
# yarn
yarn add terms-to-redux

# npm
npm i terms-to-redux
```

# Why

Redux boilerplate is only an issue if you manually type out every single action
that can occur in your application. The vast majority of actions are primitive
updates, collection updates, async events or workflow triggers.

The main advantage of redux is the semantically explicit action log that makes it
easy to understand what happened during the lifetime of the app. Since basic events
and updates can be reasonably assumed ahead of time, a simple namespace can preserve
a semantically accurate action log.

`terms-to-redux` can scaffold everything a redux application would ever need simply
by providing an array of `domains` aka namespaces

## Basic Usage

```js
import { createStore } from 'redux'
import scaffold from 'terms-to-redux'

let { actions, reducer } = scaffold(['city'])
let store = createStore(reducer)

store.getState()
/*
  {
    city: null,
  }
*/

store.dispatch(actions.city.set({ name: 'Toronto' }))
store.dispatch(actions.city.assign({ country: 'Canada' }))
store.getState()
/*
  {
    city: {
      name: 'Toronto',
      country: 'Canada',
    },
  }
*/
```

The action log would look like:

```js
  { type: CITY_SET, payload: { name: 'Toronto' }}
  { type: CITY_ASSIGN, payload: { country: 'Canada' }}
```

## Advanced Usage

```js
import scaffold, { commonVerbs, commonQualifiers } from 'terms-to-redux'
import { createStore } from 'redux'

let lexicon = {
  domains: [
    {
      // reducer / store key (ie. getState().users)
      name: 'users',

      // optional initial data (for async data)
      // typically [] | {}, but anything is valid. defaults to null
      data: [],

      // optional custom action / reducer logic
      // usage: store.dispatch(actions.users.setStatus('pending'))
      actions: {
        // state is an immer draft
        setUserStatus: (state, payload) => (
          state.users.find(user => user.id === payload.id).status = payload.status
        )
      }
    },
    {
      name: 'currentUserId'
      state: null, // optional
    }
  ],
  verbs: [
    ...commonVerbs, // optional but recommended
  ],
  qualifiers: [
    ...commonQualifiers, // optional but recommended
  ],
}

let { actions, reducers } = scaffold(lexicon)
let store = createStore(combineReducers(reducers))

store.getState()
/*
{
  users: {
    loading: false,
    error: null,
    data: []
  },
  currentUserId: null
}
*/

store.dispatch(actions.users.fetch())
store.getState().users.loading // true

store.dispatch(actions.users.fetchSuccess([{ id: 3 }]))
store.getState().users
/*
{
  loading: false,
  error: null,
  data: [{ id: 3 }]
}
*/

// invoke custom action
store.dispatch(actions.users.setUserStatus({ id: 3, status: 'verified' }))
store.getState().users
/*
{
  loading: false,
  error: null,
  data: [{ id: 3, status: 'verified' }],
}
*/

store.dispatch(actions.currentUserId.set(users[0].id))
store.getState().currentUserId // 3

store.dispatch({ type: 'RESET' })
store.getState()
/*
{
  users: {
    loading: false,
    error: null,
    data: []
  },
  currentUserId: null,
}
*/


```


## api

#### scaffold

#### common verbs

#### common qualifiers

#### makeActions

#### makeReducer
