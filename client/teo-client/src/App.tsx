import React from 'react';
import BookingPage from './pages/booking/BookingPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import SuccessfulPage from './pages/successfulSchedule/SuccesfulPage';
import Login from './pages/login/Login';

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

const ProtectedRoute = ({
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
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <ProtectedRoute
            path="/successful"
            condition={false}
            altRoute="/login"
          >
            <SuccessfulPage />
          </ProtectedRoute>
          <ProtectedRoute path="/login" condition={true} altRoute="/">
            <Login />
          </ProtectedRoute>
          <ProtectedRoute path="/" condition={true} altRoute="/login">
            <HomeLayout>
              <BookingPage />
            </HomeLayout>
          </ProtectedRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
