import { Redirect, Route, Switch } from 'wouter';
import { Counter, Home, Layout, TodoDetail, TodoList } from './components';

export default function App(): JSX.Element {
  // here app catches the suspense from page in case translations are not yet loaded
  return (
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
  );
}
