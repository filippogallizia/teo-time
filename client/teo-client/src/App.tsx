import React, { useState } from 'react';
import './App.css';
import BookSlotContainer from './component/BookSlotContainer';
import CalendarComponent from './component/Caledar';

function App() {
  const [isBookSlotView, setIsBookSlotView] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div className="App" style={{ maxWidth: '600px' }}>
        <CalendarComponent setIsBookSlotView={setIsBookSlotView} />
      </div>
      {isBookSlotView ? (
        <BookSlotContainer setIsBookSlotView={setIsBookSlotView} />
      ) : null}
    </div>
  );
}

export default App;
