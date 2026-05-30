# ThreadHive Frontend

A Reddit-style discussion platform frontend built with React and Vite. Users can browse and create threaded discussions, vote on posts and comments, and organize content into subreddits.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 6 |
| State Management | Redux Toolkit + React Redux |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| UI Library | React Bootstrap + Bootstrap 5 |
| Icons | Bootstrap Icons |
| E2E Testing | Playwright |
| Linting | ESLint |

## Prerequisites

- Node.js 18+
- A running instance of the ThreadHive backend API at `http://localhost:5000`

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Project Structure

```
src/
├── api/              # Axios instance (baseURL: http://localhost:5000/api)
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── Comment/      # CommentForm, CommentList
│   ├── Footer/
│   ├── Forms/        # CreateThreadForm
│   ├── Header/
│   ├── PrivateRoute/ # Auth guard component
│   ├── Shared/       # FilterSortBar, PaginationComponent, VoteButtons
│   ├── Sidebar/      # Subreddit navigation sidebar
│   └── ThreadList/   # ThreadCard, ThreadList
├── config/
│   └── apiConfig.js  # All API endpoint constants
├── pages/
│   ├── Auth/         # Login, Register
│   └── User/         # Home, ThreadPage, Profile
├── reducers/         # Redux Toolkit slices
│   ├── authSlice.js
│   ├── commentSlice.js
│   ├── currentThreadSlice.js
│   ├── subredditSlice.js
│   ├── themeSlice.js
│   └── threadListSlice.js
├── services/         # API call wrappers
│   ├── authService.js
│   ├── commentService.js
│   ├── subredditService.js
│   └── threadService.js
├── store/
│   └── store.js      # Redux store configuration
└── utils/
    └── handleApiError.js
```

## Features

- **Authentication** — Register and log in; JWT token persisted to `localStorage`
- **Thread Feed** — Browse all threads with filtering by subreddit and sorting options
- **Thread Detail** — View a full thread with nested comments
- **Voting** — Upvote/downvote threads and comments
- **Subreddits** — Browse and create subreddits; filter the feed by community
- **Create Thread** — Post new threads to a subreddit
- **User Profile** — View account details and activity
- **Dark Mode** — Toggle between light and dark themes (persisted via Redux)
- **Responsive Layout** — Collapsible sidebar on mobile

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | Public | User login |
| `/register` | Public | User registration |
| `/home` | Private | Main thread feed |
| `/thread/:threadId` | Private | Thread detail and comments |
| `/profile` | Private | User profile |

Private routes redirect unauthenticated users to `/login`.

## API Configuration

All endpoints are defined as named constants in `src/config/apiConfig.js`. Never hard-code API paths — always import from this file.

```js
import { THREAD_API } from '../config/apiConfig';

// Static endpoint
THREAD_API.GET_ALL          // '/threads'

// Parameterised endpoint
THREAD_API.GET_BY_ID(id)    // '/threads/:id'
```

## State Management

Global state is managed with Redux Toolkit. Each domain has its own slice under `src/reducers/`. Async operations use `createAsyncThunk` and track status as `idle | pending | fulfilled | rejected`.

Auth token and user object are persisted to `localStorage` so the session survives page refreshes.

## Contributing

1. Add the endpoint constant to `src/config/apiConfig.js`
2. Add a service function in `src/services/`
3. Add a `createAsyncThunk` and reducers to the relevant slice in `src/reducers/`
4. Wire a new slice into `src/store/store.js` if needed
5. Dispatch from the page/component via `useDispatch`
