import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import { Providers, ServiceContainer } from "react-service-container";

import Layout from './common/Layout';
import Home from './common/Home';
import Counter from './counter/Counter';
import TodoList from './todo/TodoList';
import TodoDetail from './todo/TodoDetail';
import TodoService from './todo/TodoService';
import InMemoryTodoService from './todo/InMemoryTodoService';
import './App.scss';

export default function App(props: any) {
  const baseUrl = document.getElementsByTagName('base')[0]?.getAttribute('href');
  let providers: Providers = [{ provide: TodoService, useClass: InMemoryTodoService }];
  if (process.env.REACT_APP_TODO_URL) {
    providers = [TodoService]
  }

  // loading component for suspense fallback
  const Loader = () => (
    <div className="App">
      <div>loading...</div>
    </div>
  )

  // here app catches the suspense from page in case translations are not yet loaded
  return (
    <Suspense fallback={<Loader />}>
      <Router basename={baseUrl || ''}>
        <ServiceContainer providers={providers}>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/counter' component={Counter} />
            <Route path='/todo-list' component={TodoList} />
            <Route path='/todo/:id' component={TodoDetail} />
          </Layout>
        </ServiceContainer>
      </Router>
    </Suspense>
  );
}
