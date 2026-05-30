export const mockUser = {
  _id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
};

export const mockSubreddit = {
  _id: 'sub-1',
  name: 'testsubreddit',
  description: 'A test subreddit',
};

export const mockThread = {
  _id: 'thread-1',
  title: 'Test Thread',
  content: 'This is a test thread',
  author: { _id: 'user-1', username: 'testuser' },
  subreddit: mockSubreddit,
  voteCount: 5,
  commentCount: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockThread2 = {
  _id: 'thread-2',
  title: 'Second Thread',
  content: 'Another test thread',
  author: { _id: 'user-1', username: 'testuser' },
  subreddit: mockSubreddit,
  voteCount: 3,
  commentCount: 0,
  createdAt: '2024-01-02T00:00:00.000Z',
};

export const mockComment = {
  _id: 'comment-1',
  content: 'Test comment',
  author: { _id: 'user-1', username: 'testuser' },
  thread: 'thread-1',
  voteCount: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockToken = 'mock-jwt-token';
