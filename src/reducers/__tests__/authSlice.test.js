import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../../test/renderWithProviders';
import { loginUser, registerUser, clearAuthState, logoutUser } from '../authSlice';
import { mockUser, mockToken } from '../../test/mockData';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = createTestStore();
  });

  describe('loginUser thunk', () => {
    it('sets token and user in state on success', async () => {
      await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      expect(state.login.status).toBe('fulfilled');
      expect(state.login.error).toBeNull();
    });

    it('persists token and user to localStorage on success', async () => {
      await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));

      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
    });

    it('sets login.status to pending while request is in flight', () => {
      store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.login.status).toBe('pending');
      expect(state.login.error).toBeNull();
    });

    it('sets login.error and rejected status on failure', async () => {
      server.use(
        http.post('http://localhost:5000/api/auth/login', () => {
          return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        })
      );

      await store.dispatch(loginUser({ email: 'wrong@example.com', password: 'wrong' }));

      const state = store.getState().auth;
      expect(state.login.status).toBe('rejected');
      expect(state.login.error).toBe('Invalid credentials');
      expect(state.token).toBeNull();
    });
  });

  describe('registerUser thunk', () => {
    it('sets registration.status to fulfilled on success', async () => {
      await store.dispatch(
        registerUser({ username: 'newuser', email: 'new@example.com', password: 'password' })
      );

      const state = store.getState().auth;
      expect(state.registration.status).toBe('fulfilled');
      expect(state.registration.error).toBeNull();
    });

    it('sets registration.error on failure', async () => {
      server.use(
        http.post('http://localhost:5000/api/auth/register', () => {
          return HttpResponse.json({ message: 'Email already exists' }, { status: 409 });
        })
      );

      await store.dispatch(
        registerUser({ username: 'existing', email: 'exists@example.com', password: 'password' })
      );

      const state = store.getState().auth;
      expect(state.registration.status).toBe('rejected');
      expect(state.registration.error).toBe('Email already exists');
    });
  });

  describe('clearAuthState action', () => {
    it('resets login and registration status to idle', async () => {
      server.use(
        http.post('http://localhost:5000/api/auth/login', () => {
          return HttpResponse.json({ message: 'Fail' }, { status: 401 });
        })
      );
      await store.dispatch(loginUser({ email: 'x', password: 'x' }));
      expect(store.getState().auth.login.status).toBe('rejected');

      store.dispatch(clearAuthState());

      const state = store.getState().auth;
      expect(state.login.status).toBe('idle');
      expect(state.login.error).toBeNull();
      expect(state.registration.status).toBe('idle');
      expect(state.registration.error).toBeNull();
    });
  });

  describe('logoutUser action', () => {
    it('clears token and user from state and localStorage', async () => {
      await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));
      expect(store.getState().auth.token).toBe(mockToken);

      store.dispatch(logoutUser());

      const state = store.getState().auth;
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
