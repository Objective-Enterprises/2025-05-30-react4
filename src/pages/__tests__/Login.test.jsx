import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import Login from '../Auth/Login';
import { mockToken, mockUser } from '../../test/mockData';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';

// alert is called on success in Login.jsx
vi.stubGlobal('alert', vi.fn());

describe('Login page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders email and password fields and a submit button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates form fields as the user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'secret');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('secret');
  });

  it('dispatches loginUser and stores token on successful login', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(store.getState().auth.token).toBe(mockToken);
      expect(store.getState().auth.user).toEqual(mockUser);
    });
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('shows error message when login fails', async () => {
    server.use(
      http.post('http://localhost:5000/api/auth/login', () => {
        return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'bad@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });
});
