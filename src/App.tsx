import React from 'react';
import { Redirect, Route, Router, Switch } from 'wouter';
import { Counter, Home, Layout, TodoDetail, TodoList } from './components';

export default function App(): React.ReactElement {
  const baseUrl = document
    .getElementsByTagName('base')[0]
    ?.getAttribute('href')
    ?.replace(/[/]$/, '');
  // here app catches the suspense from page in case translations are not yet loaded
  return (
    <Router base={baseUrl || ''}>
      <Layout>
        <Switch>
          <Route path='/'>
            <Home />
          </Route>
          <Route path='/counter'>
            <Counter />
          </Route>
          <Route path='/todo-list'>
            <TodoList />
          </Route>
          <Route path='/todo/:id'>
            {(params) => <TodoDetail id={Number(params.id)} />}
          </Route>
          <Route>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}
