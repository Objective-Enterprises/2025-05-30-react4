# ThreadHive Frontend — Agent Instructions

React + Vite frontend for a Reddit-style discussion platform. No TypeScript — pure JavaScript/JSX.

## Commands

```bash
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

No test runner is configured.

## Architecture

```
src/
├── pages/        # Route-level page components (Auth/, User/)
├── components/   # Reusable UI by domain (Header/, Sidebar/, ThreadList/, etc.)
├── services/     # API call wrappers — one file per resource
├── reducers/     # Redux Toolkit slices — one per domain
├── store/        # configureStore (store.js)
├── api/          # axiosInstance.js (single Axios instance, baseURL: http://localhost:5000/api)
├── config/       # apiConfig.js — all endpoint constants
└── utils/        # handleApiError.js
```

## Key Conventions

### API Layer
- All endpoints are defined in `src/config/apiConfig.js` as named constants (e.g., `THREAD_API.GET_ALL`). Always use these — never hard-code paths.
- Parameterized routes are functions: `GET_BY_ID: (id) => \`/threads/\${id}\``
- Service files (`src/services/`) wrap axios calls and return `res.data.data` (backend shape).
- The axios instance in `src/api/axiosInstance.js` has no interceptors configured yet.

### State Management (Redux Toolkit)

- Global state is managed by Redux Toolkit in `src/store/store.js`
- One slice per domain in `src/reducers/`. Auth token + user object are persisted to `localStorage`.
- Async operations use `createAsyncThunk`. Track status with `state.status` (`idle | pending | fulfilled | rejected`). Handle loading, success, and error states in extraReducers:
  - `.addCase(thunk.pending, () => {})`: set loading true, clear error
  - `.addCase(thunk.fulfilled, (state, action) => {})`: set loading false, update state with `action.payload`
  - `.addCase(thunk.rejected, (state, action) => {})`: set loading false, set `state.error`
- Thunks call service functions, not axios directly.
- Always select the most narrow data needed to minimize re-renders:

```jsx
// BAD - selecting entire user object when only name is needed
const user = useSelector((state) => state.auth.user);
return <div>{user?.name}</div>;

// GOOD - selecting only the name to minimize re-renders
const name = useSelector((state) => state.auth.user?.name);
return <div>{name}</div>;
```

### Components

- PascalCase filenames. CSS co-located: `ComponentName.jsx` + `ComponentName.css` in the same folder.
- UI library: **react-bootstrap** (Navbar, Container, Card, Button, etc.).
- Access Redux state with `useSelector`/`useDispatch`; navigation with `useNavigate`.
- Dark mode: `themeSlice` toggles `data-theme="dark"` on the document root.

### Routing
- `PrivateRoute` wraps protected pages — it reads `state.auth.token` and redirects to `/login` if absent.
- Filter state is passed via URL search params (e.g., `?subreddit=ID`), not Redux.

## Data Flow (add a new feature)
1. Add endpoint to `src/config/apiConfig.js`
2. Add service function to the relevant file in `src/services/`
3. Add `createAsyncThunk` + reducers to the slice in `src/reducers/`
4. Wire slice into `src/store/store.js` if new
5. Dispatch from page/component using `useDispatch`
