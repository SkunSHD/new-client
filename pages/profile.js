import React from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import LayoutMain from '../components/LayoutMain'
import { withAuthSync } from '../utils/auth.utils'
import getHost from '../utils/get-host'
import store from '../store'


const Profile = props => {
  const { email, username, } = props.user
  return (
    <LayoutMain>
      <h1>Profile</h1>
      <p>Email: <strong>{email}</strong></p>
      <p>Username: <strong>{username}</strong></p>

      <style jsx>{`
        img {
          max-width: 200px;
          border-radius: 0.5rem;
        }

        h1 {
          margin-bottom: 0;
        }

        .lead {
          margin-top: 0;
          font-size: 1.5rem;
          font-weight: 300;
          color: #666;
        }

        p {
          color: #6a737d;
        }
      `}</style>
    </LayoutMain>
  )
}

Profile.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx)
  const apiUrl = 'https://api-dev.fex.net/api/v1/config'

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res.writeHead(302, { Location: '/login' }).end()

  try {
    const response = await fetch(apiUrl, {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    if (response.ok) {
      const config = await response.json()
      console.log('---> ---> Profile.getInitialProps: isClient', process.browser)
      console.log('config', config)
      store.setUser(config.user)
      return config
    } else {
      // https://github.com/developit/unfetch#caveats
      return await redirectOnError()
    }
  } catch (error) {
    // Implementation or Network error
    return redirectOnError()
  }
}

export default withAuthSync(Profile)
