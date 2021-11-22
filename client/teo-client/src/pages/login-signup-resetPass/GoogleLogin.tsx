import React, { useContext, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin } from 'react-google-login';
import { ACCESS_TOKEN, USER_INFO } from '../../shared/locales/constant';
import { useHistory } from 'react-router-dom';
import { googleLoginService } from './service/LoginService';
import routes from '../../routes';
import { UserContext } from '../../component/UserContext';
import { gapi } from 'gapi-script';

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

const apiKey = 'AIzaSyDEQDDO1RB83m8FiQl4Wfl13LKG4wP2RKo';
var SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client
    .init({
      apiKey,
      // Your API key will be automatically added to the Discovery Document URLs.
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      ],
      // clientId and scope are optional if auth is not required.
      clientId,
      scope: SCOPES,
    })
    .then(function () {
      console.log('aqui');
      // 3. Initialize and make the API request.
      // gapi.auth2.getAuthInstance().isSignedIn.listen();
      const eventStartTime = new Date();

      eventStartTime.setDate(eventStartTime.getDate() + 2);

      const eventEndtime = new Date();
      const event = {
        summary: 'OSTEOPATIA CON TEO',
        location: 'via Osti',
        description: 'trattamento osteopatico',
        start: {
          dateTime: eventStartTime,
          timeZone: 'Europe/Lisbon',
        },
        end: {
          dateTime: eventEndtime,
          timeZone: 'Europe/Lisbon',
        },
        colorId: 1,
      };

      var request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      console.log('ziocane');

      request.execute(function (event: any) {
        console.log('here');
        alert('Event created: ' + event.htmlLink);
      });
    })
    .catch((e: any) => {
      console.log(e);
    });
}

function GoogleLoginComponent() {
  const history = useHistory();
  const { setUser, setToken } = useContext(UserContext);
  const responseGoogle = (response: any) => {
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
    gapi.load('client', start);
  };

  useEffect(() => {
    //window.gapi is available at this point
    // window.onGoogleScriptLoad = () => {
    // }
    //ensure everything is set before loading the script
    // loadGoogleScript();
  }, []);

  console.log(gapi, 'gapi');

  // var request = gapi.client.calendar.events.insert({
  //   calendarId: 'primary',
  //   resource: event,
  // });

  // request.execute(function (event: any) {
  //   alert('Event created: ' + event.htmlLink);
  // });

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
