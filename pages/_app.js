import React from 'react'
import { Provider } from 'mobx-react'
import { getSnapshot, applySnapshot } from 'mobx-state-tree'
import App from 'next/app'
import store from '../store'
// Utils
import { auth, syncLogout } from '../utils/auth.utils'

export default class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    if (!store.isAuth && Component.authRequired) {
      await auth(ctx)
    }

    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      initialState: getSnapshot(store),
      pageProps,
    }
  }

  constructor(props) {
    super(props)
    if (this.isClient) {
      applySnapshot(store, props.initialState);
    }
  }

  get isClient() {
    return typeof window !== 'undefined';
  }

  componentDidMount() {
    if (this.isClient) {
      window.addEventListener('storage', syncLogout)
    }
  }

  componentWillUnmount() {
    if (this.isClient) {
      window.removeEventListener('storage', syncLogout)
      window.localStorage.removeItem('logout')
   }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
        <Component {...pageProps} />
    )
  }
}
