import React from 'react';
import Routes from './routes';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import Login from './pages/login/Login';
import GeneralPage from './pages/home/GeneralPage';
import Navbar from './component/NavBar';

const HomeLayout = ({ children }: { children: JSX.Element }) => {
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

function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <nav>
          <ul>
            <li>
              <Link to={Routes.HOMEPAGE_BOOKING}>Booking</Link>
            </li>
          </ul>
        </nav> */}
        <Navbar />

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
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
            <HomeLayout>
              <GeneralPage />
            </HomeLayout>
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
}

export default App;
