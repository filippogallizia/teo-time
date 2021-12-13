import React from 'react';
import RouterComponent from './component/Router';
import ErrorBoundary from './component/ErrorBoundary';
import { GENERAL_FONT } from './shared/locales/constant';
import Loading from './component/loading/Loading';

const AppWrapper = (props: any) => {
  return (
    <div>
      <div className={`relative min-h-screen ${GENERAL_FONT} flex flex-col`}>
        {props.children}
        <Loading />
      </div>
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
