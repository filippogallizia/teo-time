import React from 'react';
import BookingPage from './pages/booking/BookingPage';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SuccessfulPage from './pages/successfulSchedule/SuccesfulPage';

const HomeLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col h-screen md:items-center md:justify-center">
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/successful">
            <SuccessfulPage />
          </Route>
          <Route path="/">
            <HomeLayout>
              <BookingPage />
            </HomeLayout>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
