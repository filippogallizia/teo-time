import React, { useContext } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { ACCESS_TOKEN, USER_INFO } from '../../shared/locales/constant';
import { useHistory } from 'react-router-dom';

import { googleLoginService } from './service/LoginService';
import routes from '../../routes';
import { UserContext } from '../../component/UserContext';

// refresh token
// import { refreshTokenSetup } from '../utils/refreshToken';

export const refreshTokenSetup = (res: any) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    console.log('newAuthRes:', newAuthRes);
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem('authToken', newAuthRes.id_token);

    // manage own token
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, newAuthRes.id_token);

    // Setup the other timer after the first one

    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};
const clientId =
  '345460796534-lfe6gvqmqijc5g6h0l813gm82q1m7cl5.apps.googleusercontent.com';

function GoogleLoginComponent() {
  const history = useHistory();
  const { setUser, setToken } = useContext(UserContext);
  const responseGoogle = (response: any) => {
    console.log(response, 'google res');
    googleLoginService(
      (res: any) => {
        localStorage.setItem(ACCESS_TOKEN, response.tokenId);
        setToken(response.tokenId);
        if (res.user) {
          localStorage.setItem(USER_INFO, JSON.stringify(res.user));
          setUser(res.user);
        }
        history.push(routes.HOMEPAGE_BOOKING);
      },
      { token: response.tokenId }
    );
    refreshTokenSetup(response);
  };

  return (
    <>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      {/* <GoogleLogout
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={() => {
          console.log('successfull logout');
        }}
      ></GoogleLogout> */}
    </>
  );
}

export default GoogleLoginComponent;
