import { User } from '../types';
import { getBaseUrl } from '../utils';

export class UserService {
  private get baseUrl(): string {
    return getBaseUrl();
  }

  getMe(): Promise<User> {
    return fetch(`${this.baseUrl}/api/me`).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to get current user');
      }
      return response.json();
    });
  }

  updateMe(user: User): Promise<User> {
    return fetch(`${this.baseUrl}/api/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update current user');
      }
      return response.json();
    });
  }

  login(email: string, password: string): Promise<User | undefined> {
    return fetch(`${this.baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      if (response.status === 401) {
        return undefined;
      }
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      return response.json();
    });
  }

  logout(): Promise<void> {
    return fetch(`${this.baseUrl}/api/logout`, {
      method: 'POST',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
    });
  }
}
