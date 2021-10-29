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
import Login from '../pages/login-signup/Login';
import Signup from '../pages/login-signup/Signup';
import Footer from './Footer';

const GeneralLayout = ({ children }: { children: JSX.Element }) => {
  return <div className="flex flex-col md:m-auto md:max-w-2xl">{children}</div>;
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

const RouterComponent = (): JSX.Element => {
  const token = localStorage.getItem('token');
  // const [navHeight, setNavHeight] = useState(0);

  return (
    <Router>
      <div className="relative min-h-screen">
        <div className="pb-16">
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
              path={Routes.SIGNUP}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <Signup />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.HOMEPAGE}
              condition={token ? true : false}
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
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default RouterComponent;
