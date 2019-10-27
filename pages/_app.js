import React from 'react'
import { Provider } from 'mobx-react'
import { getSnapshot, applySnapshot } from 'mobx-state-tree'
import App from 'next/app'
import store from '../store'

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    console.log('---> ---> MyApp getInitialProps')
    //
    // Check whether the page being rendered by the App has a
    // static getInitialProps method and if so call it
    //
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
    if (typeof window !== 'undefined') {
      applySnapshot(store, props.initialState);
    }
  }

  // render() {
  //   const { Component, pageProps } = this.props
  //   return (
  //       <Component {...pageProps} />
  //   )
  // }
}
