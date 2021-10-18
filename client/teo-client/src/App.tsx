import React from 'react';
import BookingPage from './pages/booking/BookingPage';

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
      <BookingPage />
    </HomeLayout>
  );
}

export default App;
