import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import LayoutMain from '../components/LayoutMain'
import { login } from '../utils/auth.utils'
import store from '../store'

async function handleSubmit(event, userData, setUserData) {
  event.preventDefault()
  setUserData({ ...userData, error: '' })

  const { username, password } = userData
  const url = 'https://api-dev.fex.net/api/v1/auth/signin'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: username,
        password,
      })
    })
    if (response.status === 200) {
      const user = await response.json()
      await login({ token: user.token })
      store.setUser(user)
    } else {
      console.log('Login failed.')
      // https://github.com/developit/unfetch#caveats
      let error = new Error(response.statusText)
      error.response = response
      throw error  
    }
  } catch (error) {
    console.error(
      'You have an error in your code or there are Network issues.',
      error
    )

    const { response } = error
    setUserData({
      ...userData,
      error: response ? response.statusText : error.message
    })
  }
}

function Login() {
  const [userData, setUserData] = useState({ username: '', password: '', error: '' })
  return (
    <LayoutMain>
      <div className='login'>
        <form onSubmit={event => handleSubmit(event, userData, setUserData)}>
          <label htmlFor='username'>email</label>
          <input
            type='text'
            id='username'
            name='username'
            value={userData.username}
            onChange={event =>
              setUserData(
                { ...userData, username: event.target.value }
              )
            }
          />

          <label htmlFor='password'>password</label>
          <input
            type='text'
            id='password'
            name='password'
            value={userData.password}
            onChange={event =>
              setUserData(
                { ...userData, password: event.target.value }
              )
            }
          />

          <button type='submit'>Login</button>

          {userData.error && <p className='error'>Error: {userData.error}</p>}
        </form>
      </div>
      <style jsx>{`
        .login {
          max-width: 340px;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        form {
          display: flex;
          flex-flow: column;
        }

        label {
          font-weight: 600;
        }

        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .error {
          margin: 0.5rem 0 0;
          color: brown;
        }
      `}</style>
    </LayoutMain>
  )
}

Login.authRequired = false;

export default Login
