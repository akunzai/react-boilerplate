import { catchError, from, map, Observable, of } from 'rxjs';
import { axiosFactory } from '.';
import { Todo } from '../types';

export class TodoService {
  private baseUrl = '/todos';
  constructor(private axiosInstance = axiosFactory()) {}

  getTodoList(): Observable<Todo[]> {
    return from(this.axiosInstance.get<Todo[]>(this.baseUrl)).pipe(
      map((response) => response.data),
      catchError(this.handleError<Todo[]>('getTodoList', []))
    );
  }

  getTodo(id: number): Observable<Todo | undefined> {
    const url = `${this.baseUrl}/${id}`;
    return from(this.axiosInstance.get<Todo>(url)).pipe(
      map((response) => response.data),
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return from(this.axiosInstance.post<Todo>(this.baseUrl, todo)).pipe(
      map((response) => response.data),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  deleteTodo(todo: Todo): Observable<Todo> {
    const url = `${this.baseUrl}/${todo.id}`;
    return from(this.axiosInstance.delete<Todo>(url)).pipe(
      map((response) => response.data),
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  updateTodo(todo: Todo): Observable<unknown> {
    const url = `${this.baseUrl}/${todo.id}`;
    return from(this.axiosInstance.put<Todo>(url, todo)).pipe(
      catchError(this.handleError<unknown>('updateTodo'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${operation}:`, error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
