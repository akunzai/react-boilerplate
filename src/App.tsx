import React from 'react';
import { Redirect, Route, Router, Switch } from 'wouter';
import { Home, Layout, Login, Settings, TodoDetail, TodoList } from './components';
import { ProtectedRoute } from './components/shared';
import { getBaseUrl } from './utils';

export default function App(): React.ReactElement {
  const baseUrl = getBaseUrl();
  // here app catches the suspense from page in case translations are not yet loaded
  return (
    <Router base={baseUrl || ''}>
      <Layout>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Route>
          <Route path="/todo-list">
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          </Route>
          <Route path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route>
          <Route path="/todo/:id">
            {(params) => (
              <ProtectedRoute>
                <TodoDetail id={Number(params.id)} />
              </ProtectedRoute>
            )}
          </Route>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}
