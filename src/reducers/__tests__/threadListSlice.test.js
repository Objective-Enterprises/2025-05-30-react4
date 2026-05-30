import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../../test/renderWithProviders';
import {
  fetchThreads,
  createThreadThunk,
  upvoteThreadThunk,
  downvoteThreadThunk,
} from '../threadListSlice';
import { mockThread, mockThread2 } from '../../test/mockData';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';

describe('threadListSlice', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = createTestStore();
  });

  describe('fetchThreads thunk', () => {
    it('populates threads in state on success', async () => {
      await store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.threads).toHaveLength(2);
      expect(state.threads[0]._id).toBe(mockThread._id);
      expect(state.threads[1]._id).toBe(mockThread2._id);
    });

    it('sets loading to true while fetching', () => {
      store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.loading).toBe(true);
    });

    it('sets error in state on failure', async () => {
      server.use(
        http.get('http://localhost:5000/api/threads', () => {
          return HttpResponse.json({ message: 'Server error' }, { status: 500 });
        })
      );

      await store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.loading).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.threads).toHaveLength(0);
    });
  });

  describe('createThreadThunk', () => {
    it('prepends new thread to the list on success', async () => {
      await store.dispatch(fetchThreads());
      await store.dispatch(
        createThreadThunk({
          title: 'New Thread',
          content: 'New content',
          subreddit: 'sub-1',
        })
      );

      const state = store.getState().threads;
      expect(state.threads[0]._id).toBe('thread-new');
      expect(state.threads).toHaveLength(3);
    });

    it('sets error on failure', async () => {
      server.use(
        http.post('http://localhost:5000/api/threads', () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        })
      );

      await store.dispatch(createThreadThunk({ title: 'Bad', content: 'Bad' }));

      const state = store.getState().threads;
      expect(state.error).toBeTruthy();
    });
  });

  describe('upvoteThreadThunk', () => {
    it('updates voteCount for the correct thread', async () => {
      await store.dispatch(fetchThreads());
      await store.dispatch(upvoteThreadThunk(mockThread._id));

      const state = store.getState().threads;
      const updated = state.threads.find((t) => t._id === mockThread._id);
      expect(updated.voteCount).toBe(6);
    });
  });

  describe('downvoteThreadThunk', () => {
    it('updates voteCount for the correct thread', async () => {
      await store.dispatch(fetchThreads());
      await store.dispatch(downvoteThreadThunk(mockThread._id));

      const state = store.getState().threads;
      const updated = state.threads.find((t) => t._id === mockThread._id);
      expect(updated.voteCount).toBe(4);
    });
  });
});
