import React from 'react'
import { observer } from 'mobx-react'
import Router from 'next/router'
import LayoutMain from '../components/LayoutMain'
import { withAuthSync } from '../utils/auth.utils'
import nextCookie from 'next-cookies'
import getHost from '../utils/get-host'
import store from '../store'

const Profile = observer(props => {
  const { email, username } = store.user

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
})

Profile.getInitialProps = async (ctx) => {
  const { token } = nextCookie(ctx)
  return {};
}

Profile.authRequired = true;

export default Profile
