# ⚡ Next.js 15 Enterprise Frontend Starter

A **production-ready Next.js 15 frontend** with RTK Query for server-state, Zustand for UI state, full JWT auth flow, and a polished dark-mode dashboard — pre-integrated with the NestJS Enterprise Backend.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Architecture & Design Decisions](#-architecture--design-decisions)
4. [Folder Structure](#-folder-structure)
5. [Setup Instructions](#-setup-instructions)
6. [Environment Variables](#-environment-variables)
7. [Running the Project](#-running-the-project)
8. [State Management Guide](#-state-management-guide)
9. [Authentication Flow](#-authentication-flow)
10. [Next.js 15 Features Used](#-nextjs-15-features-used)
11. [API Integration](#-api-integration)
12. [Component Library](#-component-library)
13. [Performance Optimizations](#-performance-optimizations)
14. [Adding New Features](#-adding-new-features)
15. [Testing](#-testing)
16. [Deployment](#-deployment)

---

## 📌 Project Overview

This starter ships a complete, working enterprise dashboard that connects to the NestJS backend starter out of the box. It is intentionally opinionated — every architectural choice is explained below so you can adapt it confidently.

### What works on day one

| Feature | Status |
|---|---|
| Login / Register pages | ✅ |
| JWT access + refresh token rotation | ✅ |
| Middleware-based route protection | ✅ |
| Dashboard with live stats | ✅ |
| Full user CRUD (list, create, edit, delete, view) | ✅ |
| Role-based UI (USER / ADMIN / SUPER_ADMIN) | ✅ |
| Profile page with editable fields | ✅ |
| Paginated data tables | ✅ |
| Collapsible sidebar + responsive mobile layout | ✅ |
| Suspense streaming + skeleton loaders | ✅ |
| Dark-mode-first design system | ✅ |
| Toast notifications | ✅ |
| Form validation (Zod + react-hook-form) | ✅ |

---

## 🛠 Technology Stack

| Concern | Library | Version | Why |
|---|---|---|---|
| Framework | Next.js | 15 | App Router, RSC, streaming, edge middleware |
| Language | TypeScript | 5.6 | Full type safety end-to-end |
| Server State | RTK Query (`@reduxjs/toolkit`) | 2.3 | Cache, deduplication, auto-invalidation |
| Client State | Zustand | 4.5 | Minimal, ergonomic, no boilerplate |
| Styling | Tailwind CSS | 3.4 | Utility-first with custom design tokens |
| Forms | react-hook-form + Zod | 7 / 3 | Performant forms with schema validation |
| Auth | js-cookie + jwt-decode | — | Client-side cookie management |
| Notifications | react-hot-toast | 2 | Lightweight, styled to match design |
| Icons | lucide-react | 0.4 | Consistent, tree-shakeable icon set |

---

## 🏗 Architecture & Design Decisions

### Why RTK Query for server state?

RTK Query provides cache management, request deduplication, automatic background refetching, and tag-based cache invalidation — all without writing a single `useEffect`. When a user is created, the `UserList` cache tag is invalidated and the table refetches automatically.

```
Component → useGetUsersQuery() → RTK Query cache
                                       ↓ cache miss
                               customBaseQuery → NestJS API
                                       ↓ 401?
                               token refresh → retry
```

### Why Zustand for UI state?

UI state (sidebar open, active modal, loading overlays) has nothing to do with the server. Zustand gives a single store with zero boilerplate. Components subscribe to only the slices they need — no re-renders from unrelated state changes.

```
useUIStore.getState().openModal('edit-user', user)
// Anywhere in the app — no dispatch, no connect()
```

### State Boundary: What goes where?

| State type | Store | Examples |
|---|---|---|
| Remote data | RTK Query | Users list, profile, paginated queries |
| Auth identity | Redux (authSlice) | Current user, isAuthenticated, role |
| UI / ephemeral | Zustand (uiStore) | Sidebar state, modal type/payload |
| Form state | react-hook-form | Login form, create/edit forms |
| URL state | Next.js router | Current page, query params |

### Server Components vs Client Components

Following the React Server Components principle: **push client boundary as far down the tree as possible**.

```
app/users/page.tsx          → Server Component (no 'use client')
  └── Suspense boundary
        └── UsersView.tsx   → 'use client' (needs hooks, interactivity)
              └── UserModal → 'use client' (forms, state)
```

This means the outer shell streams instantly from the server. The interactive table hydrates independently.

---

## 📁 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root HTML shell + Providers
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   │
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx        # Split-panel login
│   │   └── register/page.tsx     # Registration
│   │
│   ├── dashboard/
│   │   ├── layout.tsx            # Sidebar + Topbar shell
│   │   ├── page.tsx              # Stats + recent users (streaming)
│   │   └── loading.tsx           # Route-level loading UI
│   │
│   ├── users/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Full CRUD table
│   │   └── loading.tsx
│   │
│   └── profile/
│       ├── layout.tsx
│       ├── page.tsx              # Current user profile editor
│       └── loading.tsx
│
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   ├── Badge.tsx             # RoleBadge, StatusBadge
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx             # Portal-based modal
│   │   ├── Table.tsx             # Composable table primitives
│   │   ├── Pagination.tsx
│   │   └── Spinner.tsx
│   │
│   ├── auth/
│   │   ├── AuthHydrator.tsx      # Hydrates Redux from cookies on mount
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx           # Collapsible nav + logout
│   │   └── Topbar.tsx            # Page title + user avatar
│   │
│   ├── dashboard/
│   │   ├── DashboardStats.tsx    # 4 stat cards (RTK Query)
│   │   └── RecentUsers.tsx       # Mini user list
│   │
│   ├── users/
│   │   ├── UsersView.tsx         # Full CRUD table + search
│   │   └── UserModal.tsx         # Create / Edit / View modal
│   │
│   ├── profile/
│   │   └── ProfileView.tsx       # Profile editor
│   │
│   └── skeletons/
│       └── index.tsx             # UserTableSkeleton, StatCardSkeleton, ProfileSkeleton
│
├── hooks/
│   ├── useAuth.ts                # Auth state accessor hook
│   └── useDebounce.ts            # Input debouncing
│
├── lib/
│   ├── token.ts                  # Cookie read/write + JWT decode/expiry check
│   └── utils.ts                  # cn(), formatDate(), extractErrorMessage(), etc.
│
├── services/
│   └── api/
│       ├── baseQuery.ts          # RTK Query base query with token refresh
│       ├── authApi.ts            # register, login, refresh, logout
│       └── userApi.ts            # CRUD + getMe (with tag invalidation)
│
├── store/
│   ├── index.ts                  # configureStore (Redux)
│   ├── hooks.ts                  # useAppDispatch, useAppSelector
│   ├── uiStore.ts                # Zustand UI store
│   └── slices/
│       └── authSlice.ts          # Auth Redux slice + selectors
│
├── styles/
│   └── globals.css               # Tailwind + design tokens + animations
│
├── types/
│   └── index.ts                  # All shared TypeScript interfaces
│
└── middleware.ts                 # Edge middleware for route protection
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 9+
- The **NestJS backend starter** running on `http://localhost:3000`

### 1. Clone & install

```bash
git clone https://github.com/your-org/next-frontend-starter.git
cd next-frontend-starter
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME="Enterprise Dashboard"
NEXT_PUBLIC_ACCESS_TOKEN_KEY=access_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=refresh_token
```

### 3. Start development server

```bash
npm run dev
```

Open `http://localhost:3001` — you will be redirected to `/auth/login`.

### 4. Seed credentials (from backend)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@example.com | Admin@123456 |
| User | user@example.com | User@123456 |

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | — | NestJS backend base URL |
| `NEXT_PUBLIC_APP_NAME` | — | `Enterprise Dashboard` | App title in meta tags |
| `NEXT_PUBLIC_APP_URL` | — | `http://localhost:3001` | Frontend URL |
| `NEXT_PUBLIC_ACCESS_TOKEN_KEY` | — | `access_token` | Cookie name for access token |
| `NEXT_PUBLIC_REFRESH_TOKEN_KEY` | — | `refresh_token` | Cookie name for refresh token |

> All `NEXT_PUBLIC_` variables are bundled into the client. Never put secrets here.

---

## ▶️ Running the Project

```bash
# Development (Turbopack — fast HMR)
npm run dev

# Production build
npm run build

# Run production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Tests
npm test
npm run test:cov
```

---

## 🗄 State Management Guide

### RTK Query — Server State

All server interactions go through RTK Query endpoints defined in `src/services/api/`.

#### Using a query

```tsx
// Fetch users with automatic caching
const { data, isLoading, isFetching, error } = useGetUsersQuery({ page: 1, limit: 10 });
```

#### Using a mutation

```tsx
// Create user — auto-invalidates UserList cache tag
const [createUser, { isLoading }] = useCreateUserMutation();

await createUser({
  email: 'new@example.com',
  username: 'newuser',
  password: 'Pass@123',
  role: 'USER',
}).unwrap(); // .unwrap() throws on error — catch it
```

#### Cache invalidation flow

```
createUser mutation completes
  → invalidates { type: 'UserList', id: 'LIST' }
    → useGetUsersQuery re-fetches automatically
      → table updates without manual refresh
```

#### Tag structure in `userApi.ts`

| Tag | Provides | Invalidated by |
|---|---|---|
| `{ type: 'UserList', id: 'LIST' }` | `getUsers` | `createUser`, `deleteUser` |
| `{ type: 'User', id: N }` | `getUserById` | `updateUser(N)`, `deleteUser(N)` |
| `{ type: 'User', id: 'ME' }` | `getMe` | `updateUser(currentUser.id)` |

---

### Zustand — UI State

```tsx
import { useUIStore } from '@store/uiStore';

// Open a modal with data
const { openModal, closeModal, modal } = useUIStore();
openModal('edit-user', user);

// Sidebar
const { sidebarCollapsed, toggleCollapse } = useUIStore();

// Check if a specific modal is open
const isModalOpen = modal.type === 'create-user';
const editTarget  = modal.payload as User | null;
```

---

### Redux — Auth State

```tsx
import { useAppSelector } from '@store/hooks';
import { selectCurrentUser, selectUserRole } from '@store/slices/authSlice';

const user = useAppSelector(selectCurrentUser);
const role = useAppSelector(selectUserRole);

// Or use the convenience hook:
import { useAuth } from '@hooks/useAuth';
const { user, isAdmin, isSuper } = useAuth();
```

---

## 🔑 Authentication Flow

### Login sequence

```
User submits LoginForm
  → useLoginMutation fires POST /auth/login
    → on success:
        tokenStore.setTokenPair(accessToken, refreshToken)  ← cookies
        dispatch(setCredentials({ user, tokens }))          ← Redux
        router.push('/dashboard')
```

### Token refresh (automatic, transparent)

```
Any RTK Query request fires
  → customBaseQuery checks: is access token expired? (within 30s buffer)
    → yes: tryRefreshTokens() → POST /auth/refresh
      → success: update cookies, retry original request
      → failure: clear cookies + dispatch(clearCredentials()) → redirect to /login
```

### Hydration after hard refresh

```
Page loads → AuthHydrator useEffect runs
  → reads access token from cookie
  → decodes JWT payload (sub, email, role)
  → dispatch(setCredentials(...))
  → Redux auth state restored without any API call
```

### Logout

```
User clicks "Sign out"
  → dispatch(clearCredentials())    ← clear Redux immediately (optimistic)
  → tokenStore.clearAll()           ← remove cookies
  → POST /auth/logout               ← server invalidates refresh token
  → router.push('/auth/login')
```

### Middleware route protection (Edge)

```
Request arrives at /dashboard
  → middleware.ts reads cookies (runs on Edge — no JS bundle)
    → no access_token AND no refresh_token?
      → redirect to /auth/login?callbackUrl=/dashboard
    → has tokens?
      → NextResponse.next() — allow through
```

---

## 🚀 Next.js 15 Features Used

### React Server Components (RSC)

All page files (`page.tsx`) are Server Components by default. They render HTML on the server — no JS sent to the client for the outer shell.

```tsx
// app/users/page.tsx — Server Component
export default function UsersPage() {
  return (
    <div>
      <h2>Users</h2>
      <Suspense fallback={<UserTableSkeleton />}>
        <UsersView />   {/* Client Component — hydrates independently */}
      </Suspense>
    </div>
  );
}
```

### Streaming with Suspense

Each `<Suspense>` boundary enables streaming: the server sends the shell immediately and streams each boundary's content as it resolves.

```tsx
// Dashboard streams stats and recent users independently
<Suspense fallback={<StatCardSkeleton />}>
  <DashboardStats />     {/* Streams when RTK Query resolves */}
</Suspense>

<Suspense fallback={<TableSkeleton />}>
  <RecentUsers />        {/* Streams independently */}
</Suspense>
```

### Route-level `loading.tsx`

Next.js automatically wraps each route segment in a Suspense boundary using `loading.tsx`:

```tsx
// app/users/loading.tsx — shown instantly while page.tsx suspends
export default function UsersLoading() {
  return <PageSpinner />;
}
```

### Edge Middleware

`middleware.ts` runs on the Edge runtime (Vercel / Cloudflare Workers compatible) — zero cold starts, no Node.js APIs:

```ts
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
```

### Turbopack (dev)

```bash
next dev --turbo   # ~10× faster HMR vs Webpack
```

### Optimised package imports

```ts
// next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react'],
}
// Prevents importing the entire lucide bundle — only used icons are bundled
```

---

## 🔌 API Integration

All backend endpoints are mapped to RTK Query hooks:

| Endpoint | Hook | Cache Tags |
|---|---|---|
| `POST /auth/register` | `useRegisterMutation` | — |
| `POST /auth/login` | `useLoginMutation` | — |
| `POST /auth/refresh` | `useRefreshTokensMutation` | — |
| `POST /auth/logout` | `useLogoutMutation` | — |
| `GET /users` | `useGetUsersQuery(query)` | `UserList` |
| `GET /users/me` | `useGetMeQuery()` | `User:ME` |
| `GET /users/:id` | `useGetUserByIdQuery(id)` | `User:id` |
| `POST /users` | `useCreateUserMutation` | invalidates `UserList` |
| `PATCH /users/:id` | `useUpdateUserMutation` | invalidates `User:id`, `UserList`, `User:ME` |
| `DELETE /users/:id` | `useDeleteUserMutation` | invalidates `User:id`, `UserList` |

### Adding a new API module

1. Create `src/services/api/postApi.ts`:

```ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => '/posts' }),
  }),
});

export const { useGetPostsQuery } = postApi;
```

2. Register in `src/store/index.ts`:

```ts
import { postApi } from '@services/api/postApi';

reducer: {
  [postApi.reducerPath]: postApi.reducer,
},
middleware: (getDefault) => getDefault().concat(postApi.middleware),
```

3. Use in any component:

```tsx
const { data } = useGetPostsQuery();
```

---

## 🧩 Component Library

### UI Primitives (`src/components/ui/`)

All primitives accept standard HTML attributes plus a few extras:

```tsx
// Input — with error, prefix, suffix
<Input
  placeholder="Email"
  error={errors.email?.message}
  prefix={<Mail size={14} />}
/>

// Button — variants: primary | secondary | ghost | destructive | outline
<Button variant="secondary" size="sm" disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Save'}
</Button>

// Badge — role and status variants
<RoleBadge role={user.role} />     // USER | ADMIN | SUPER_ADMIN
<StatusBadge status={user.status} /> // ACTIVE | INACTIVE | BANNED

// Avatar — shows initials from name or email
<Avatar user={user} size="md" />

// Modal — portal-based, Escape to close, backdrop click closes
<Modal isOpen={isOpen} onClose={close} title="Create User" size="md">
  <MyForm />
</Modal>

// Table — composable primitives
<Table>
  <Thead><Th>Name</Th><Th>Role</Th></Thead>
  <Tbody>
    {users.map(u => (
      <Tr key={u.id}><Td>{u.name}</Td><Td><RoleBadge role={u.role} /></Td></Tr>
    ))}
  </Tbody>
</Table>

// Pagination
<Pagination meta={meta} onPageChange={setPage} />
```

---

## ⚡ Performance Optimizations

| Technique | Where | Effect |
|---|---|---|
| React Server Components | All `page.tsx` files | Zero JS sent for outer shell |
| Suspense streaming | Dashboard, Users, Profile | Page shell instant, data streams in |
| Route-level `loading.tsx` | All routes | Instant loading UI, no layout shift |
| Skeleton loaders | Table, stats, profile | Prevents CLS during hydration |
| RTK Query deduplication | All queries | Same query from N components = 1 request |
| RTK Query caching | All queries | Navigating back = instant, no refetch |
| Tag invalidation | Mutations | Precise refetch — not a full cache bust |
| `optimizePackageImports` | lucide-react | Tree-shakes icons at build time |
| Turbopack | Dev server | ~10× faster HMR |
| Input debouncing | `useDebounce` | Search fires after 400ms pause |
| `--turbo` flag | `npm run dev` | Faster local dev builds |

---

## ➕ Adding New Features

### New protected page

1. Create `src/app/myfeature/page.tsx` (Server Component)
2. Create `src/app/myfeature/layout.tsx` (copy Sidebar + Topbar shell)
3. Create `src/app/myfeature/loading.tsx`
4. Add the route to `Sidebar.tsx` nav items
5. Add the route to `middleware.ts` `PROTECTED_PREFIXES`

### New Zustand slice

```ts
// Add to uiStore.ts
myFeatureOpen: boolean;
setMyFeatureOpen: (v: boolean) => void;

// In create():
myFeatureOpen: false,
setMyFeatureOpen: (v) => set({ myFeatureOpen: v }),
```

### New form with validation

```tsx
const schema = z.object({ name: z.string().min(1) });
type Values = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<Values>({
  resolver: zodResolver(schema),
});
```

---

## 🧪 Testing

```bash
npm test             # run all tests
npm run test:watch   # watch mode
npm run test:cov     # with coverage report
```

Test files live alongside components: `Button.test.tsx` next to `Button.tsx`.

Example test:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

test('renders button text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 🚢 Deployment

### Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-api.railway.app/api/v1
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3001
CMD ["node", "server.js"]
```

Add to `next.config.ts`:

```ts
output: 'standalone',
```

### Production checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Configure CORS on the NestJS backend to allow the frontend URL
- [ ] Set `secure: true` on cookies in `src/lib/token.ts`
- [ ] Enable `output: 'standalone'` in `next.config.ts` for Docker
- [ ] Set up a CDN for static assets (Next.js does this automatically on Vercel)
- [ ] Configure CSP headers in `next.config.ts`
- [ ] Remove demo credential hints from `LoginForm.tsx`

---

## 📄 License

MIT — free to use as the foundation for any project.

## 👨‍💻 Author

**Kawsar Mia**

Software Engineer — Backend & Frontend

- Email: imkawsar007@gmail.com
- GitHub: https://github.com/kawsar007
- LinkedIn: https://www.linkedin.com/in/kawsar007/
- Portfolio: https://kawsar-mia.netlify.app/

If you have any questions, suggestions, or improvements, feel free to reach out.

## 🤝 Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.