# Criterion: Frontend

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-04

### Context

The Emotion Diary application requires a modern, responsive, and maintainable frontend that handles complex user interactions (journaling, emotion tracking, AI chat, analytics) while providing an intuitive user experience across desktop, tablet, and mobile devices. The frontend must communicate with a REST API, manage authentication state, and handle real-time AI responses.

### Decision

Build a single-page application (SPA) using **React 19 with TypeScript**, styled with **Ant Design** component library and **SCSS** for custom styling, using **React Router v6** for routing and **React Context** for authentication state management. The application follows a component-based architecture with clear separation between pages (containers), feature components, and UI components.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Next.js (React framework) | SSR/SSG capabilities, routing built-in | Overkill for SPA, additional complexity | MVP doesn't require server-side rendering |
| React + Redux | Centralized state management | Unnecessary complexity for simple auth state | Context API sufficient for authentication needs |

### Consequences

**Positive:**
- Fast development with pre-built Ant Design components (Calendar, Menu, Modals)
- Type safety with TypeScript reduces runtime errors
- Component reusability across pages (EmotionTag, EmotionSelector, EntryForm)
- Excellent developer experience with React DevTools and TypeScript IntelliSense
- Simple state management with Context API (no Redux overhead)
- Responsive design easy to implement with SCSS mixins

**Negative:**
- Larger bundle size compared to minimal UI libraries (mitigated with code splitting)
- Ant Design customization requires understanding of Less/CSS variables
- No server-side rendering (less relevant for authenticated SPA)

**Neutral:**
- Requires build step with Vite (standard for modern web apps)
- Multiple styling approaches (Ant Design CSS + custom SCSS) require consistency guidelines

## Implementation Details

### Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API client functions
│   │   ├── diary.ts             # Diary CRUD operations
│   │   ├── emotions.ts          # Emotion fetching
│   │   ├── ai.ts                # AI chat & reports
│   │   └── auth.ts              # Authentication
│   ├── assets/                  # Images, icons
│   │   └── icons/               # SVG icons
│   ├── components/              # Reusable components
│   │   ├── DiaryEntry/          # Individual entry display
│   │   ├── EmotionWheel/        # Interactive emotion wheel
│   │   ├── EmotionSelector/     # Emotion picker
│   │   ├── EntryForm/           # Create/edit entry form
│   │   ├── Layout/              # Main layout wrapper
│   │   ├── Sidebar/             # Navigation sidebar
│   │   └── ...                  # Other UI components
│   ├── constants/               # App constants & configs
│   ├── context/                 # React Context providers
│   │   └── AuthContext.tsx      # Authentication context
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components (routes)
│   │   ├── DiaryPage/           # Diary list
│   │   ├── EmotionWheelPage/    # Emotion visualization
│   │   ├── SmartChatPage/       # AI chat interface
│   │   ├── LoginPage/           # User login
│   │   └── ...                  # Other pages
│   ├── styles/                  # Global styles & variables
│   │   └── variables/           # SCSS variables, mixins
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   ├── globalInterfaces.ts      # Shared TypeScript interfaces
│   └── custom.d.ts              # TypeScript declarations
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── Dockerfile.dev
├── eslint.config.js
├── index.html
├── nginx.conf                   # Nginx config for production
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vercel.json                  # Vercel deployment config
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Component Co-location** | Each component lives in its own folder with `.tsx`, `.scss`, and tests together for easy maintenance |
| **No Global State Library** | Authentication is the only global state, Context API is sufficient, avoiding Redux complexity |
| **BEM Naming Convention** | `.component__element--modifier` structure keeps CSS modular and prevents naming conflicts |
| **Axios over Fetch** | Interceptors centralize JWT token handling, better error handling and request cancellation |
| **SCSS with Mixins** | Reusable breakpoint mixins (`@include mobile`, `@include tablet`) ensure consistent responsive behavior |
| **Protected Routes Pattern** | Higher-order component wraps routes requiring authentication, redirecting to login if needed |
| **API Client Layer** | Separate `api/` folder abstracts backend calls, pages don't contain axios code directly |

### Code Examples

**Authentication Context:**
```typescript
// context/AuthContext.tsx
interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**API Client Pattern:**
```typescript
// api/diary.ts
export const createDiaryEntry = async (data: {
  userId: number;
  entryDate: string;
  content: string;
  emotions: number[];
}) => {
  const response = await axios.post('/diary/new', data);
  return response.data;
};

// Page component usage
const handleSave = async () => {
  try {
    setLoading(true);
    const entry = await createDiaryEntry({ userId, entryDate, content, emotions });
    navigate('/diary');
  } catch (error) {
    showError('Failed to save entry');
  } finally {
    setLoading(false);
  }
};
```

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Modern JavaScript framework (React/Vue/Angular) | ✅ | React 19 with TypeScript |
| 2 | Component-based architecture | ✅ | Clear separation: Pages → Feature Components → UI Components |
| 3 | Responsive design (mobile/tablet/desktop) | ✅ | SCSS mixins with breakpoints: 480px, 980px |
| 4 | State management implementation | ✅ | Context API for auth, local state for features |
| 5 | Routing with protected routes | ✅ | React Router v6 with authentication guards |
| 6 | API integration with error handling | ✅ | Axios client with interceptors, try-catch in components |
| 7 | TypeScript for type safety | ✅ | Strict mode enabled, interfaces for all data structures |
| 8 | UI component library | ✅ | Ant Design 6.1.0 (Calendar, Charts, Modals, Forms) |
| 9 | Code organization and modularity | ✅ | Feature-based folder structure with co-location |
| 10 | Form validation and user feedback | ✅ | Ant Design form validation + custom error messages |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| No offline support | Users cannot access app without internet | Implement service workers with PWA capabilities |
| Large bundle size (~2MB) | Slower initial load on slow connections | Code splitting, lazy loading routes, tree-shaking |
| Ant Design customization complexity | Difficult to override default styles | Switch to more customizable library (Tailwind + Headless UI) or use CSS-in-JS |
| No server-side rendering | Poor SEO, slower first paint | Migrate to Next.js if SEO becomes priority |

## References

- [Frontend Specification](https://drive.google.com/drive/folders/1RMGFrAhLpTO3F8-BLM-xrxHNZjWjPXUS?dmr=1&ec=wgc-drive-hero-goto)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [React Router Documentation](https://reactrouter.com/)
- [SCSS Guide](https://sass-lang.com/guide)