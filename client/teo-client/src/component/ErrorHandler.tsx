import { useEffect, useState } from 'react';
import EventListener from '../helpers/EventListener';
import { useHistory } from 'react-router-dom';
import routes from '../routes';

const ErrorHanlder = () => {
  const [err, setErr] = useState(false);
  const history = useHistory();
  useEffect(() => {
    const handler = EventListener.addListener('errorHandling', setErr);
    return () => {
      handler.removeEventListener();
    };
  }, []);
  if (!err) return null;
  return (
    <div
      onClick={() => {
        setErr(false);
        history.push(routes.LOGIN);
      }}
    >
      <p
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
        }}
      >
        qualcosa e' andato stortooooo
      </p>
    </div>
  );
};

export default ErrorHanlder;
