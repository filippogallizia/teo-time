import React, { useState } from 'react';
import Calendar from 'react-calendar';
import logo from './logo.svg';
import './App.css';

function App() {
  const [value, onChange] = useState(new Date());
  console.log(value, 'value')
  return (
    <div className="App" style={{maxWidth: "600px"}}>
      <Calendar
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default App;
