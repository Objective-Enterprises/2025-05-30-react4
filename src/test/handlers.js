import { http, HttpResponse } from 'msw';
import { mockUser, mockToken, mockThread, mockThread2, mockSubreddit, mockComment } from './mockData';

const BASE = 'http://localhost:5000/api';

export const handlers = [
  // Auth
  http.post(`${BASE}/auth/login`, () => {
    return HttpResponse.json({ data: { token: mockToken, user: mockUser } });
  }),

  http.post(`${BASE}/auth/register`, () => {
    return HttpResponse.json({ data: { message: 'Registered successfully' } });
  }),

  // Threads
  http.get(`${BASE}/threads`, () => {
    return HttpResponse.json({ data: [mockThread, mockThread2] });
  }),

  http.get(`${BASE}/threads/:id`, ({ params }) => {
    if (params.id === mockThread._id) {
      return HttpResponse.json({ data: mockThread });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post(`${BASE}/threads`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: { ...mockThread, _id: 'thread-new', title: body.title, content: body.content },
    });
  }),

  http.post(`${BASE}/threads/:id/upvote`, ({ params }) => {
    return HttpResponse.json({ data: { ...mockThread, _id: params.id, voteCount: 6 } });
  }),

  http.post(`${BASE}/threads/:id/downvote`, ({ params }) => {
    return HttpResponse.json({ data: { ...mockThread, _id: params.id, voteCount: 4 } });
  }),

  // Comments
  http.get(`${BASE}/comments/thread/:threadId`, () => {
    return HttpResponse.json({ data: [mockComment] });
  }),

  http.post(`${BASE}/comments`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: { ...mockComment, _id: 'comment-new', content: body.content },
    });
  }),

  http.post(`${BASE}/comments/:id/upvote`, ({ params }) => {
    return HttpResponse.json({ data: { ...mockComment, _id: params.id, voteCount: 2 } });
  }),

  http.post(`${BASE}/comments/:id/downvote`, ({ params }) => {
    return HttpResponse.json({ data: { ...mockComment, _id: params.id, voteCount: 0 } });
  }),

  // Subreddits
  http.get(`${BASE}/subreddits`, () => {
    return HttpResponse.json({ data: [mockSubreddit] });
  }),

  http.get(`${BASE}/subreddits/:id`, ({ params }) => {
    if (params.id === mockSubreddit._id) {
      return HttpResponse.json({
        data: { subreddit: mockSubreddit, threads: [mockThread] },
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post(`${BASE}/subreddits`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: { _id: 'sub-new', name: body.name, description: body.description || '' },
    });
  }),
];
