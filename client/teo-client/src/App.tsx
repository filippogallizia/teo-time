import React from 'react';
import BookingComponent from './component/BookingComponent';

const HomeLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col justify-center h-screen md:items-center">
      {children}
    </div>
  );
};

function App() {
  return (
    <HomeLayout>
      <BookingComponent />
    </HomeLayout>
  );
}

export default App;
