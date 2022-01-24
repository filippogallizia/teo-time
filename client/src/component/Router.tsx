// external libraries
import React from 'react';
import Routes from '../routes';
import {
  Router as BrowserRouter,
  Switch,
  Route,
  RouteProps,
  Redirect,
  useHistory,
} from 'react-router-dom';

import { createBrowserHistory } from 'history';

// local files
import Navbar from './NavBar';
import GeneralPage from '../pages/general/GeneralPage';
import Login, { ForgotPassword } from '../pages/login-signup-resetPass/Login';
import Signup from '../pages/login-signup-resetPass/Signup';
import Footer from './Footer';
import ResetPassword from '../pages/login-signup-resetPass/ResetPassword';
import ContactPage from '../pages/contact/ContactPage';
import { ShrinkHeigthLayout } from './GeneralLayouts';
import PrivacyPolicy from '../pages/privacyPolicy/PrivacyPolicy';
import ErrorHanlder from './ErrorHandler';
import ErrorsAndWarningsModal from './ErrorsAndWarningsModal';
import Authentication from './authentication/Authentication';

type ProtectedRouteType = {
  children: JSX.Element;
  condition: boolean;
  altRoute: string;
} & RouteProps;

export const history = createBrowserHistory();

export const useHistry = () => {
  const history = useHistory();
  return history;
};

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
  return (
    <BrowserRouter history={history}>
      <Authentication>
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
      </Authentication>
    </BrowserRouter>
  );
};

export default RouterComponent;
