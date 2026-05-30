import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../reducers/authSlice';
import threadReducer from '../reducers/threadListSlice';
import currentThreadReducer from '../reducers/currentThreadSlice';
import commentReducer from '../reducers/commentSlice';
import themeReducer from '../reducers/themeSlice';
import subredditReducer from '../reducers/subredditSlice';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      threads: threadReducer,
      currentThread: currentThreadReducer,
      comments: commentReducer,
      theme: themeReducer,
      subreddits: subredditReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  { preloadedState = {}, store = createTestStore(preloadedState), initialEntries = ['/'], ...options } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
