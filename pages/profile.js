import React from 'react'
import Router from 'next/router'
import LayoutMain from '../components/LayoutMain'
import { withAuthSync } from '../utils/auth.utils'
import nextCookie from 'next-cookies'
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
  // if user doesn't signIn {Profile.getInitialProps} doesn't called
  // because of redirect in {Wrapper.getInitialProps}
  const { token } = nextCookie(ctx)
  
  // TODO: Need advice
  // I can't move this to model because of the ssr
  // when {Profile.getInitialProps} call ends the rendered components send to client
  // so if I created a reaction in model on setToken that does getConfig call
  // then {Profile.getInitialProps} wouldn't know when getConfig fetched
  const config = await store.getConfig(ctx)
  return config
}

export default withAuthSync(Profile)
