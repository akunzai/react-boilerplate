import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Counter, Home, Layout, TodoDetail, TodoList } from './components';

export default function App(): JSX.Element {
  const baseUrl = document
    .getElementsByTagName('base')[0]
    ?.getAttribute('href');

  // here app catches the suspense from page in case translations are not yet loaded
  return (
    <BrowserRouter basename={baseUrl || ''}>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/counter' element={<Counter />} />
          <Route path='/todo-list' element={<TodoList />} />
          <Route path='/todo/:id' element={<TodoDetail />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
