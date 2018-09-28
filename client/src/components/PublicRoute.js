import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={props =>
        window.sessionStorage.getItem("wallet") ? (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
