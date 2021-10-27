import React, { useEffect, useState } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import EventListener from './helpers/EventListener';
import GeneralButton from './component/GeneralButton';
import RouterComponent from './component/Router';

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

const ErrorComponent = (props: any) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-red-600 ">
      <p className="mb-10">{props.message}</p>
      <div>
        <GeneralButton
          buttonText="Torna all'inizio"
          onClick={() => EventListener.emit('errorHandling', false)}
        />
      </div>
    </div>
  );
};

function App() {
  const [error, setError] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("Qualcosa e' andato storto");
  useEffect(() => {
    if (error && error.data) {
      if (typeof error.data.error.message === 'string') {
        setErrorMessage(error.data.error.message);
      }
    }
  }, [error]);
  const removeListener = EventListener.addListener('errorHandling', setError);
  if (!error) {
    return <RouterComponent />;
  } else {
    return (
      <ErrorComponent message={errorMessage} removeListener={removeListener} />
    );
  }
}

export default App;
