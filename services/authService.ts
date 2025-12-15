import { User } from '../types';

const USERS_KEY = 'smart-wardrobe-users';
const SESSION_KEY = 'smart-wardrobe-session';

export const authService = {
  login: (username: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[username] && users[username] === password) {
      const user = { username };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error('用户名或密码错误');
  },

  register: (username: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[username]) {
      throw new Error('用户名已存在');
    }
    users[username] = password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login after register
    const user = { username };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
