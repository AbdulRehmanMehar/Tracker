import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Auth } from './helpers'

function PrivateRoute({ component: Component, ...rest }) {
  // console.log(Auth.isAuthenticated())
  return (
    <Route
      {...rest}
      render={(props) =>
        Auth.isAuthenticated()? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
}

export default PrivateRoute
