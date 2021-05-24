import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import { ServiceContainer } from 'react-service-container';

import Layout from './common/Layout';
import Home from './common/Home';
import Counter from './counter/Counter';
import TodoList from './todo/TodoList';
import TodoDetail from './todo/TodoDetail';
import TodoService from './todo/TodoService';
import './App.scss';

export default function App() {
  const baseUrl = document
    .getElementsByTagName('base')[0]
    ?.getAttribute('href');

  // here app catches the suspense from page in case translations are not yet loaded
  return (
    <Router basename={baseUrl || ''}>
        <ServiceContainer providers={[TodoService]}>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/counter" component={Counter} />
            <Route path="/todo-list" component={TodoList} />
            <Route path="/todo/:id" component={TodoDetail} />
          </Layout>
        </ServiceContainer>
      </Router>
  );
}
