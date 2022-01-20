// external libraries
import React, { useEffect, useMemo, useState } from 'react';
import Routes from '../routes';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';

// local files
import Navbar from './NavBar';
import GeneralPage from '../pages/general/GeneralPage';
import Login, { ForgotPassword } from '../pages/login-signup-resetPass/Login';
import Signup from '../pages/login-signup-resetPass/Signup';
import Footer from './Footer';
import { ACCESS_TOKEN, USER_INFO } from '../shared/locales/constant';
import ResetPassword from '../pages/login-signup-resetPass/ResetPassword';
import { UserContext } from './UserContext';
import ContactPage from '../pages/contact/ContactPage';
import { ShrinkHeigthLayout } from './GeneralLayouts';
import PrivacyPolicy from '../pages/privacyPolicy/PrivacyPolicy';
import ErrorHanlder from './ErrorHandler';
import ErrorsAndWarningsModal from './ErrorsAndWarningsModal';

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

const MainContentWrapper = (props: any) => {
  return <div className="flex-1 flex flex-col p-2">{props.children}</div>;
};

const RouterComponent = (): JSX.Element => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo(
    () => ({ user, setUser, token, setToken }),
    [user, setUser, token, setToken]
  );

  useEffect(() => {
    const userInfo = localStorage.getItem(USER_INFO);
    const TOKEN = localStorage.getItem(ACCESS_TOKEN);
    if (TOKEN) {
      setToken(TOKEN);
    }
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [setUser]);

  return (
    <Router>
      <UserContext.Provider value={value}>
        <Navbar />
        <MainContentWrapper>
          <Switch>
            <Route path={Routes.ERRORS_AND_WARNINGS}>
              <ErrorsAndWarningsModal />
            </Route>
            <ProtectedRoute
              path={Routes.LOGIN}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ShrinkHeigthLayout>
                <Login />
              </ShrinkHeigthLayout>
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.RESET_PASSWORD}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ResetPassword />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.LOGIN_FORGOT_PASSWORD}
              condition={true}
              altRoute={Routes.LOGIN}
            >
              <ForgotPassword />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.SIGNUP}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ShrinkHeigthLayout>
                <Signup />
              </ShrinkHeigthLayout>
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.CONTACT}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ContactPage />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.PRIVACY_POLICY}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ShrinkHeigthLayout>
                <PrivacyPolicy />
              </ShrinkHeigthLayout>
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.HOMEPAGE}
              condition={true}
              altRoute={Routes.LOGIN}
            >
              <ShrinkHeigthLayout>
                <GeneralPage />
              </ShrinkHeigthLayout>
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
        </MainContentWrapper>
        <ErrorHanlder />
        <Footer />
      </UserContext.Provider>
    </Router>
  );
};

export default RouterComponent;