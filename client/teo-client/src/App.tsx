import React from 'react';
import BookingPage from './pages/booking/BookingPage';

const HomeLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col h-screen md:items-center md:justify-center">
      {children}
    </div>
  );
};

function App() {
  return (
    <HomeLayout>
      <BookingPage />
    </HomeLayout>
  );
}

export default App;
