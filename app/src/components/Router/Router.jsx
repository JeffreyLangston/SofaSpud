import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import App from '../app/App';
import NotFound from '../NotFound/NotFound';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route component={App} exact path="/" />
      <Route component={NotFound} exact />
    </Switch>
  </BrowserRouter>
);

export default Router;
