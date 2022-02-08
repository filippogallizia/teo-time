import React from 'react';
import RouterComponent from './component/Router';
import ErrorBoundary from './component/ErrorBoundary';
import { GENERAL_FONT } from './constants/constant';
import Loading from './component/loading/Loading';

const AppWrapper = (props: any) => {
  return (
    <div>
      <div className={`relative min-h-screen ${GENERAL_FONT} flex flex-col`}>
        <Loading />
        {props.children}
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
