# SpendSafe

**Manual-first financial clarity tool for freelancers and independent workers**

SpendSafe helps you estimate safe-to-spend funds after accounting for taxes and obligations, using _assumption-explicit_ language and manual confirmations to reduce anxiety without creating false confidence.

## 🎯 Project Philosophy

- **PRD is the source of truth** - All features align with PRD.md
- **TRD defines constraints** - Architecture follows TRD.md strictly
- **Reference is inspiration** - UI/UX patterns from reference_UI

## 🧠 Core Principles

1. **Manual-First**: No automation without explicit user control
2. **Assumption Transparency**: Every number shows what it assumes
3. **Non-Authoritative**: No implied advice or guarantees
4. **Degradation Visible**: Pending assumptions age and warn users
5. **User Responsibility**: System explains, never decides

## 🛠️ Tech Stack

### Framework

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**

### Styling

- **Tailwind CSS 4** (with neumorphic + glassmorphic design patterns)

### Critical Libraries ("Secret Sauce")

- **decimal.js** - Arbitrary precision math (no 0.1 + 0.2 ≠ 0.3)
- **@tanstack/react-query** - Data freshness & caching
- **zod** - Schema validation (shared client/server)
- **react-hook-form** - Form state management
- **date-fns** - Time-based degradation logic
- **@supabase/supabase-js** + **@supabase/ssr** - Backend & auth

### UI Components

- **lucide-react** - Icon library
- **clsx** + **tailwind-merge** - Conditional styling

## 📁 Directory Structure

```
src/
├── domain/              # Pure TypeScript logic (NO React imports)
│   ├── income/
│   │   ├── types.ts
│   │   └── validation.ts
│   ├── assumptions/
│   │   ├── types.ts
│   │   └── logic.ts
│   └── estimates/
│       ├── calculator.ts  # Safe-to-spend using decimal.js
│       └── degradation.ts # Time-based confidence decay
│
├── ui/                  # React components & hooks
│   ├── components/      # Reusable UI primitives
│   ├── hooks/           # React Query wrappers
│   └── features/        # Feature-specific components
│
├── app/                 # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│
├── lib/                 # Infrastructure
│   ├── supabase/
│   │   ├── client.ts    # Client-side Supabase
│   │   └── server.ts    # Server-side Supabase
│   └── utils.ts
│
└── copy/                # Centralized language (security boundary)
    └── en.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Clone and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Testing

**Important: Vitest v4 Limitations with Next.js 16**

Vitest v4 **cannot** run tests for async Server Components that use Next.js 16 server-only functions like `cookies()`, `headers()`, `params`, or `searchParams`.

**Test Coverage Guidelines**:

- ✅ **Sync Server Components**: Can be tested with Vitest
- ✅ **Client Components**: Can be tested with Vitest
- ❌ **Async Server Components**: Require E2E/integration tests (use Playwright, Cypress, etc.)

This is a known limitation - see https://github.com/vitest-dev/vitest/issues/5862

```bash
npm test  # Run Vitest unit tests
```

### Build for Production

```bash
npm run build
npm run start
```

## 🗄️ Database Setup

The database schema is defined in `schema.sql`. To apply it to your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy/paste the contents of `schema.sql`
4. Execute the migration

## 📖 Key Documents

- **PRD.md** - Product Requirements (source of truth)
- **TRD.md** - Technical Requirements & Architecture
- **Reference.md** - Prior art & design patterns
- **schema.sql** - Database schema
- **schema_reference.md** - Schema design decisions

## 🎨 Design System

Based on `reference_UI`, the app uses:

- **Neumorphism**: Soft 3D effects via shadows
- **Glassmorphism**: Frosted glass panels
- **Dark Rail**: #1e1e1e sidebar
- **Premium Animations**: Cubic-bezier transitions
- **Typography**: Inter font family

## 🧪 Development Guidelines

### Domain Layer Rules

- **NO** React or Next.js imports
- **NO** side effects (pure functions only)
- Use `decimal.js` for all financial calculations
- Explicitly document assumptions in comments

### Copy as Security Boundary

All user-facing text lives in `src/copy/en.ts`. Any change requires review to prevent "regulated-advice signaling."

### State Management

- Use React Query for server state
- Avoid Redux (client-heavy, not server-state-heavy)
- Context API for global UI state only

## 📝 License

[Specify your license]

## 🙏 Acknowledgments

- PRD & TRD design by [Author]
- Reference UI patterns from `reference_UI/`
