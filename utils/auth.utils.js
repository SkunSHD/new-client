import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import store from '../store'

export const login = ({ token }) => {
  cookie.set('token', token, { expires: 1 })
  Router.push('/profile')
}

export const auth = ctx => {
  const { token } = nextCookie(ctx)
  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end()
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push('/login')
  }

  // NOTE: so far it's useless
  // store.setToken(token)

  return token
}

export const logout = () => {
  cookie.remove('token')
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
  Router.push('/login')
}

// Wrapper checks auth and signs out from all windows
export const withAuthSync = WrappedComponent => {

  class Wrapper extends React.Component {
    static getInitialProps = async (ctx) => {
      console.log('---> ---> Wrapper getInitialProps')
      const token = auth(ctx)

      let componentProps = {}
      if (token && WrappedComponent.getInitialProps) {
        await store.getConfig(ctx)
        componentProps = await WrappedComponent.getInitialProps(ctx)
      }

      return { ...componentProps, token }
    }

    componentDidMount() {
      window.addEventListener('storage', this.syncLogout)
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout)
      window.localStorage.removeItem('logout')
    }

    syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!')
        Router.push('/login')
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return Wrapper
}
