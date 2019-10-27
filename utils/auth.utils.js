import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'

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

  return token
}

export const logout = () => {
  cookie.remove('token')
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
  Router.push('/login')
}

// Wrapper checks auth and loggs out from all windows
export const withAuthSync = WrappedComponent => {

  // return class Wrapper extends React.Component {
  //   static getInitialProps = async (ctx) => {
  //     const token = auth(ctx)

  //     let componentProps = {}
  //     if (token && WrappedComponent.getInitialProps) {
  //       componentProps = await WrappedComponent.getInitialProps(ctx)
  //     }

  //     return { ...componentProps, token }
  //   }

  //   componentDidMount() {
  //     if (process.browser) {
  //       window.addEventListener('storage', this.syncLogout)
  //     }
  //   }

  //   componentWillMount() {
  //     if (process.browser) {
  //       window.removeEventListener('storage', this.syncLogout)
  //       window.localStorage.removeItem('logout')
  //     }
  //   }

  //   syncLogout = event => {
  //     if (event.key === 'logout') {
  //       console.log('logged out from storage!')
  //       Router.push('/login')
  //     }
  //   }

  //   render() {
  //     return <WrappedComponent {...this.props} />
  //   }
  // }

  const Wrapper = props => {
    console.log('---> ---> Wrapper body')
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!')
        Router.push('/login')
      }
    }

    useEffect(() => {
      window.addEventListener('storage', syncLogout)
      return () => {
        window.removeEventListener('storage', syncLogout)
        window.localStorage.removeItem('logout')
      }
    }, [null])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    console.log('---> ---> Wrapper getInitialProps')
    const token = auth(ctx)

    let componentProps = {}
    if (token && WrappedComponent.getInitialProps) {
      componentProps = await WrappedComponent.getInitialProps(ctx)
    }

    return { ...componentProps, token }
  }

  return Wrapper
}
