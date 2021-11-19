import React from 'react';
import RouterComponent from './component/Router';
import ErrorBoundary from './component/ErrorBoundary';
import { GENERAL_FONT } from './shared/locales/constant';

const AppWrapper = (props: any) => {
  return (
    <div className={`relative min-h-screen ${GENERAL_FONT} flex flex-col`}>
      {props.children}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppWrapper>
        <RouterComponent />
      </AppWrapper>
    </ErrorBoundary>
  );
}

export default App;
