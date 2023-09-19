import test from 'node:test'
import assert from 'node:assert'
import fetch from 'node-fetch'

let testUser = {
  'username': 'tester',
  'password': 'p@ssw0rd',
}

const apiServer = process.env['TEST_SERVER']

test('create user', async (t) => {
  await t.test('post', async (t) => {
    const response = await fetch(`http://${apiServer}/users`, {
      method: 'post',
      body: JSON.stringify(testUser),
      headers: {'Content-Type': 'application/json'},
    })

    const responseUser = await response.json()

    testUser.id = responseUser.id
    assert.deepEqual(responseUser, testUser)
  })

  await t.test('get', async (t) => {
    const response = await fetch(`http://${apiServer}/users/${testUser.id}`)
    const responseUser = await response.json()
    assert.deepEqual(responseUser, testUser)
  })
})

test('update user', async (t) => {
  await t.test('patch', async (t) => {
    testUser.username = 'tester2'
    testUser.password = 'pa55word'
    const response = await fetch(`http://${apiServer}/user/${testUser.id}`, {
      method: 'patch',
      body: JSON.stringify(testUser),
      headers: {'Content-Type': 'application/json'},
    })

    const responseUser = await response.json()
    assert.deepEqual(responseUser, testUser)
  })

  await t.test('get', async (t) => {
    const response = await fetch(`http://${apiServer}/users/${testUser.id}`)
    const responseUser = await response.json()
    assert.deepEqual(responseUser, testUser)
  })
})

test('delete user', async (t) => {
  await t.test('delete', async (t) => {
    const response = await fetch(`http://${apiServer}/users/${testUser.id}`, { method: 'delete' })
    const deleted = await response.json()
    assert.deepEqual(deleted, {deleted: 1})
  })

  await t.test('get', async (t) => {
    const response = await fetch(`http://${apiServer}/users/${testUser.id}`)
    const responseUser = await response.json()
    assert.deepEqual(responseUser, {})
  })
})