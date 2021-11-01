import React, { useEffect, useState } from 'react';
import EventListener from './helpers/EventListener';
import GeneralButton from './component/GeneralButton';
import RouterComponent from './component/Router';
import { URL_CLIENT } from './shared/locales/constant';
import routes from './routes';
import ErrorBoundary from './component/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterComponent />
    </ErrorBoundary>
  );
}

export default App;
