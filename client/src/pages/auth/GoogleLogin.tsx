import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { googleLoginService } from './AuthApi/LoginService';
import routes from '../../routes';
import SessionService from '../../services/SessionService';
import LocalStorageManager from '../../services/StorageService';

export const refreshTokenSetup = (res: any) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;

    // manage own token
    LocalStorageManager.removeItem('google_token');
    LocalStorageManager.setItem('google_token', newAuthRes.id_token);
    SessionService.refreshToken(newAuthRes.access_token);

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
  const responseGoogle = (response: any) => {
    googleLoginService(
      (res: any) => {
        const { tokenId } = response;
        const { user } = res;
        LocalStorageManager.setItem('google_token', response.accessToken);
        if (res.user) {
          SessionService.login({ token: tokenId, user });
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
        buttonText="Sign in with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        scope="https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar"
      />
    </>
  );
}

export default GoogleLoginComponent;
