import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import Home from '../User/Home';
import { mockThread, mockThread2, mockToken, mockUser } from '../../test/mockData';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';

const authPreloadedState = {
  auth: {
    token: mockToken,
    user: mockUser,
    login: { status: 'idle', error: null },
    registration: { status: 'idle', error: null },
  },
};

describe('Home page', () => {
  it('shows loading indicator while fetching threads', () => {
    renderWithProviders(<Home />, { preloadedState: authPreloadedState });

    expect(screen.getByRole('status')).toHaveTextContent(/loading threads/i);
  });

  it('renders thread titles after successful fetch', async () => {
    renderWithProviders(<Home />, { preloadedState: authPreloadedState });

    await waitFor(() => {
      expect(screen.getByText(mockThread.title)).toBeInTheDocument();
      expect(screen.getByText(mockThread2.title)).toBeInTheDocument();
    });
  });

  it('shows "No threads found" when thread list is empty', async () => {
    server.use(
      http.get('http://localhost:5000/api/threads', () => {
        return HttpResponse.json({ data: [] });
      })
    );

    renderWithProviders(<Home />, { preloadedState: authPreloadedState });

    await waitFor(() => {
      expect(screen.getByText(/no threads found/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    server.use(
      http.get('http://localhost:5000/api/threads', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      })
    );

    renderWithProviders(<Home />, { preloadedState: authPreloadedState });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('renders the Create button', async () => {
    renderWithProviders(<Home />, { preloadedState: authPreloadedState });

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });
});
