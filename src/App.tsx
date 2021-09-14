import { Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { ServiceContainer } from 'react-service-container';
import Home from './common/Home';
import Layout from './common/Layout';
import Counter from './counter/Counter';
import TodoDetail from './todo/TodoDetail';
import TodoList from './todo/TodoList';
import TodoService from './todo/TodoService';

export default function App(): JSX.Element {
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
