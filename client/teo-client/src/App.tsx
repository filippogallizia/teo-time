import React from 'react';
import RouterComponent from './component/Router';
import ErrorBoundary from './component/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterComponent />
    </ErrorBoundary>
  );
}

export default App;
