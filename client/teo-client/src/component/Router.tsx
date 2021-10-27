import React from 'react';
import Routes from '../routes';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import Navbar from './NavBar';
import GeneralPage from '../pages/general/GeneralPage';
import Login from '../pages/login/Login';

const GeneralLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col h-screen md:items-center md:justify-center">
      {children}
    </div>
  );
};

type ProtectedRouteType = {
  children: JSX.Element;
  condition: boolean;
  altRoute: string;
} & RouteProps;

export const ProtectedRoute = ({
  children,
  condition,
  altRoute,
  ...props
}: ProtectedRouteType) => {
  if (condition) {
    return <Route {...props}>{children}</Route>;
  }
  return (
    <Redirect
      to={{
        pathname: altRoute,
      }}
    />
  );
};

const RouterComponent = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <ProtectedRoute
            path={Routes.LOGIN}
            condition={true}
            altRoute={Routes.ROOT}
          >
            <Login />
          </ProtectedRoute>

          <ProtectedRoute
            path={Routes.HOMEPAGE}
            condition={true}
            altRoute={Routes.LOGIN}
          >
            <GeneralLayout>
              <GeneralPage />
            </GeneralLayout>
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.ROOT}
            condition={true}
            altRoute={Routes.LOGIN}
          >
            <Redirect
              to={{
                pathname: Routes.HOMEPAGE,
              }}
            />
          </ProtectedRoute>
        </Switch>
      </div>
    </Router>
  );
};

export default RouterComponent;
