import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { ServiceContainer } from 'react-service-container';
import { TodoService } from './api';
import { Counter, Home, Layout, TodoDetail, TodoList } from './components';

export default function App(): JSX.Element {
  const baseUrl = document
    .getElementsByTagName('base')[0]
    ?.getAttribute('href');

  // here app catches the suspense from page in case translations are not yet loaded
  return (
    <Router basename={baseUrl || ''}>
      <ServiceContainer providers={[TodoService]}>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/counter" component={Counter} />
            <Route exact path="/todo-list" component={TodoList} />
            <Route exact path="/todo/:id" component={TodoDetail} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </ServiceContainer>
    </Router>
  );
}
