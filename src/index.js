import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter
} from 'react-router-dom'

const rootEl = document.getElementById('app')
import App from './app'
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, rootEl)