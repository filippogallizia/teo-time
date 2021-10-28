import React, { useEffect, useState } from 'react';
import EventListener from './helpers/EventListener';
import GeneralButton from './component/GeneralButton';
import RouterComponent from './component/Router';
import { URL_CLIENT } from './constant';
import routes from './routes';

const ErrorComponent = (props: any) => {
  return (
    <div className="flex flex-col justify-center items-center text-red-600 ">
      <p className="mb-10">{props.message}</p>
      <div>
        <a href={`${URL_CLIENT}${routes.HOMEPAGE}`}>
          <GeneralButton
            buttonText="Torna all'inizio"
            onClick={() => {
              EventListener.emit('errorHandling', false);
            }}
          />
        </a>
      </div>
    </div>
  );
};

function App() {
  const [error, setError] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("Qualcosa e' andato storto");
  useEffect(() => {
    console.log(error, 'error');
    if (error && error.data && error.data.error && error.data.error.message) {
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
