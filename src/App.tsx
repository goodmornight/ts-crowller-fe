import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import LoginPage from './Pages/Login';
import HomePage from './Pages/Home';

function App() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" exact component={LoginPage} />
        </Switch>
      </HashRouter>
    </div>
  )
}

export default App;