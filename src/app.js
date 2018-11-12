import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import 'antd/dist/antd.css'
import './assets/common.sass'
import routes from './routes'

const App = () => (
  <Switch>
    {
      routes.map(({ name, path, exact = true, component }) => (
        <Route key={name} path={path} exact={exact} component={component}/>
      ))
    }
  </Switch>  
)
export default App