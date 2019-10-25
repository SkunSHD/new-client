import React from 'react'
import { observer } from 'mobx-react';
import Nav from '../components/Nav'
import "../scss/styles.scss"

const Home = observer(() => (
  <div>
    <Nav />
    <div className="hero">
      <h1 className="title">Welcome to Next!</h1>
      <p className="description">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>
    </div>
  </div>
));

export default Home
