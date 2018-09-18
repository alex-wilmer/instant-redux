import assert from 'assert'
import scaffold from './scaffold'

const TEST_VALUE = 123
let domains = [{ name: 'foo' }, { name: 'bar' }]

let domainsWithResolvers = [
  { name: 'foo', resolvers: { TEST: () => TEST_VALUE } },
]
let verbs = ['add', 'remove', 'assigndeep']
let adverbs = ['success', 'failure']

describe('redux scaffold', () => {
  it('should create the correct number of actions', () => {
    let { actions: allActions } = scaffold({
      domains,
      verbs,
      adverbs,
    })
    assert.strictEqual(Object.keys(allActions).length, domains.length)
    Object.values(allActions).forEach(domainActions => {
      assert.equal(
        Object.keys(domainActions).length,
        verbs.length *  adverbs.length + verbs.length,
      )
    })
  })

  it('should prepend the domain name to custom resolver actions', () => {
    let { reducers } = scaffold({
      domains: domainsWithResolvers,
      verbs,
      adverbs,
    })

    let result = reducers.foo(0, { type: 'TEST' })
    assert.notEqual(result, TEST_VALUE)

    result = reducers.foo(0, { type: 'FOO_TEST' })
    assert.equal(result, TEST_VALUE)
  })

  it('should create actions from custom resolvers', () => {
    let { actions } = scaffold({
      domains: domainsWithResolvers,
      verbs,
      adverbs,
    })

    assert.strictEqual(typeof actions.foo.test, 'function')

    const { type } = actions.foo.test()

    assert.strictEqual(type, 'FOO_TEST')
  })

  it('should ~~preserve camelCase in verbs~~ maybe do this later', () => {
    let { actions } = scaffold({
      domains,
      verbs,
      adverbs,
    })

    assert.strictEqual(typeof actions.foo.assigndeep, 'function')
  })
})
