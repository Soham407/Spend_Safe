# SpendSafe Code Structure Guide

**Last Updated:** 2026-01-16  
**Architecture:** Feature-Based (Vertical Slice)

---

## 📁 Directory Overview

```
src/
├── app/                    # Next.js 15 App Router (Routes, Layouts, API)
├── components/             # Shared UI Components (domain-agnostic)
├── features/               # Feature Modules (Vertical Slices)
├── hooks/                  # Custom React Hooks
├── lib/                    # External Service Clients & Utilities
└── copy/                   # Centralized Text Content
```

---

## 🎯 Feature Modules (`src/features/`)

Each feature module is **self-contained** with its own:

- **Business Logic** (actions, calculations, validations)
- **Domain Types** (TypeScript interfaces)
- **UI Components** (feature-specific views)
- **Data Access** (repository patterns, if applicable)

### **1. Income** (`src/features/income/`)

**Purpose:** Manage income events and ledger tracking.

```
income/
├── actions.ts                      # Server Actions (createIncomeEvent, getIncomeEventsWithAssumptions)
├── types.ts                        # IncomeEvent domain types
├── validation.ts                   # Zod schemas for income data
├── LedgerView.tsx                  # Main ledger/history view
└── components/
    ├── IncomeCapture.tsx           # Income entry form
    └── IncomeModal.tsx             # Modal for quick income logging
```

**Key Exports:**

- `createIncomeEvent(data)` - Creates income with atomic assumption
- `getIncomeEventsWithAssumptions()` - Fetches all income + assumptions
- `LedgerView` - Full ledger table UI

**Related API Routes:**

- `POST /api/income-events` - Create income event
- `GET /api/income-events` - Fetch all events

---

### **2. Estimates** (`src/features/estimates/`)

**Purpose:** Calculate safe-to-spend and financial projections.

```
estimates/
├── calculator.ts                   # Core safe-to-spend calculation logic
├── calculator.test.ts              # Unit tests for calculations
├── panicSnapshot.ts                # Panic mode conservative calculations
├── degradation.ts                  # Time-based degradation logic
└── components/
    ├── SafeToSpendCard.tsx         # Main dashboard card
    └── SafeToSpendDisplay.tsx      # Alternative display component
```

**Key Exports:**

- `calculateSafeToSpend(events, assumptions)` - Main calculation
- `calculatePanicSnapshot(events, assumptions)` - Conservative snapshot
- `SafeToSpendCard` - Primary UI component

**Related API Routes:**

- `GET /api/estimates/safe-to-spend` - Get current estimate
- `GET /api/panic-snapshot` - Get panic mode snapshot

---

### **3. Assumptions** (`src/features/assumptions/`)

**Purpose:** Manage income assumption states (pending, confirmed, deferred).

```
assumptions/
├── actions.ts                      # updateAssumptionState, getAssumptions
├── types.ts                        # AssumptionState enum, types
├── repository.ts                   # Database access layer
├── validation.ts                   # State transition validation
└── components/
    ├── AllocationList.tsx          # Pending/Recent sections
    ├── AllocationCard.tsx          # Individual allocation card
    └── RealityCheckModal.tsx       # Reality check prompt
```

**Key Exports:**

- `updateAssumptionState(id, newState)` - Confirm/defer assumptions
- `AssumptionState` - Enum: PENDING, CONFIRMED, DEFERRED
- `PendingActionsSection` - Dashboard pending list
- `RecentExecutionSection` - Dashboard history

**Related API Routes:**

- `PATCH /api/assumptions/:id` - Update assumption state
- `GET /api/allocations/pending` - Fetch pending allocations

---

### **4. Settings** (`src/features/settings/`)

**Purpose:** User preferences and account management.

```
settings/
├── actions.ts                      # updateUserSettings, getUserSettings
├── types.ts                        # UserSettings types
└── components/
    ├── PassiveModeToggle.tsx       # Passive mode switch
    └── AccountSettingsModal.tsx    # Email/password/delete account
```

**Key Exports:**

- `updatePassiveMode(enabled)` - Toggle passive mode
- `PassiveModeToggle` - UI component
- `AccountSettingsModal` - Full settings modal

**Related API Routes:**

- `PATCH /api/settings` - Update user settings

---

### **5. Dashboard** (`src/features/dashboard/`)

**Purpose:** Main overview orchestration.

```
dashboard/
└── DashboardView.tsx               # Orchestrates SafeToSpendCard + Allocations
```

**Key Exports:**

- `DashboardView` - Main dashboard layout

---

### **6. Profile** (`src/features/profile/`)

**Purpose:** User profile and account overview.

```
profile/
└── ProfileView.tsx                 # Profile page with settings integration
```

---

### **7. Panic** (`src/features/panic/`)

**Purpose:** Conservative financial snapshot view.

```
panic/
└── PanicView.tsx                   # Panic mode dashboard
```

---

### **8. History** (`src/features/history/`)

**Purpose:** Historical transaction view.

```
history/
└── HistoryView.tsx                 # Full history timeline
```

---

### **9. Common** (`src/features/common/`)

**Purpose:** Shared types across features.

```
common/
└── types.ts                        # IncomeEventData, SnapshotData, etc.
```

---

## 🧩 Shared Components (`src/components/`)

**Domain-agnostic UI elements** used across multiple features:

```
components/
├── Sidebar.tsx                     # Desktop navigation sidebar
├── IconRail.tsx                    # Icon-based navigation rail
└── MobileNav.tsx                   # Mobile bottom navigation
```

**Usage Pattern:**

```typescript
import { Sidebar } from "@/components/Sidebar";
```

---

## 🔌 API Routes (`src/app/api/`)

```
api/
├── income-events/
│   └── route.ts                    # POST, GET income events
├── estimates/
│   └── safe-to-spend/
│       └── route.ts                # GET safe-to-spend calculation
├── panic-snapshot/
│   └── route.ts                    # GET panic snapshot
├── assumptions/
│   └── [id]/
│       └── route.ts                # PATCH update assumption
├── allocations/
│   └── pending/
│       └── route.ts                # GET pending allocations
└── settings/
    └── route.ts                    # PATCH user settings
```

---

## 🎣 Custom Hooks (`src/hooks/`)

```
hooks/
└── useSpendSafeData.ts             # Main data fetching hook
```

**Usage:**

```typescript
const {
  snapshot,
  incomeEvents,
  isPassiveMode,
  lastRealityCheck,
  isLoading,
  refreshTrigger,
  triggerRefresh,
  updatePassiveMode,
  addIncome,
  acknowledgeRealityCheck,
  shouldShowRealityCheck,
} = useSpendSafeData();
```

---

## 🗺️ Navigation Map

### **User Flows → Code Locations**

| User Flow               | Entry Point                                         | Key Components                                              |
| ----------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| **View Dashboard**      | `/dashboard` → `app/(dashboard)/dashboard/page.tsx` | `DashboardView`, `SafeToSpendCard`, `PendingActionsSection` |
| **Log Income**          | Click "+" → `IncomeModal`                           | `features/income/components/IncomeModal.tsx`                |
| **View Ledger**         | Sidebar → "Ledger"                                  | `features/income/LedgerView.tsx`                            |
| **Confirm Assumption**  | Dashboard → "Execute"                               | `features/assumptions/components/AllocationCard.tsx`        |
| **Panic Mode**          | Sidebar → "Panic"                                   | `features/panic/PanicView.tsx`                              |
| **Toggle Passive Mode** | Profile → Toggle                                    | `features/settings/components/PassiveModeToggle.tsx`        |
| **Update Account**      | Profile → Settings                                  | `features/settings/components/AccountSettingsModal.tsx`     |

---

## 🔍 Code Review Checklist

### **✅ Architecture Compliance**

- [ ] **Feature Isolation**: Each feature module is self-contained
- [ ] **No Cross-Feature Imports**: Features don't directly import from other features (use shared types in `features/common/types.ts`)
- [ ] **Clear Separation**: Business logic (actions) separated from UI (components)
- [ ] **Type Safety**: All domain types defined in `types.ts` files

### **✅ Import Patterns**

**Correct:**

```typescript
// Feature-specific imports
import { createIncomeEvent } from "@/features/income/actions";
import { SafeToSpendCard } from "@/features/estimates/components/SafeToSpendCard";
import { AssumptionState } from "@/features/assumptions/types";

// Shared components
import { Sidebar } from "@/components/Sidebar";

// Utilities
import { createClient } from "@/lib/supabase/client";
```

**Incorrect (Old Pattern):**

```typescript
// ❌ Don't use these anymore
import { createIncomeEvent } from "@/domain/income/actions";
import { SafeToSpendCard } from "@/ui/components/SafeToSpendCard";
```

### **✅ File Organization**

Each feature should follow this structure:

```
feature-name/
├── actions.ts          # Server actions & data fetching
├── types.ts            # TypeScript interfaces
├── validation.ts       # Zod schemas (if needed)
├── repository.ts       # Database access (if needed)
├── FeatureView.tsx     # Main view component
└── components/         # Feature-specific UI components
    ├── Component1.tsx
    └── Component2.tsx
```

---

## 🚀 Development Workflow

### **Adding a New Feature**

1. **Create Feature Directory:**

   ```bash
   mkdir -p src/features/new-feature/components
   ```

2. **Define Types:**

   ```typescript
   // src/features/new-feature/types.ts
   export interface NewFeatureData {
     id: string;
     // ... fields
   }
   ```

3. **Create Actions:**

   ```typescript
   // src/features/new-feature/actions.ts
   "use server";

   export async function createNewFeature(data: NewFeatureData) {
     // Implementation
   }
   ```

4. **Build UI Components:**

   ```typescript
   // src/features/new-feature/components/NewFeatureCard.tsx
   "use client";

   export function NewFeatureCard() {
     // Implementation
   }
   ```

5. **Create API Route (if needed):**
   ```typescript
   // src/app/api/new-feature/route.ts
   import { createNewFeature } from "@/features/new-feature/actions";
   ```

### **Modifying Existing Features**

1. Navigate to `src/features/<feature-name>/`
2. All related code is colocated in this directory
3. Update actions, types, or components as needed
4. No need to hunt across `domain/`, `ui/`, etc.

---

## 📊 Dependency Graph

```
┌─────────────────┐
│   app/routes    │
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
    ┌────▼────┐      ┌──────▼──────┐   ┌──────▼──────┐
    │ features│      │  components │   │    hooks    │
    └────┬────┘      └─────────────┘   └──────┬──────┘
         │                                     │
         │                                     │
    ┌────▼────────────────────────────────────▼──┐
    │              lib/ (supabase, utils)        │
    └────────────────────────────────────────────┘
```

**Key Principles:**

- **Routes** orchestrate features
- **Features** are independent vertical slices
- **Components** are reusable UI primitives
- **Hooks** provide data/state management
- **Lib** provides external integrations

---

## 🔧 Migration Notes

### **What Changed:**

1. **`src/domain/*` → `src/features/*/`**

   - Domain logic moved into feature modules
   - Each feature owns its business logic

2. **`src/ui/*` → `src/features/*/components/` or `src/components/`**

   - Feature-specific UI → `features/*/components/`
   - Shared UI → `components/`

3. **Eliminated Layer-Based Structure**
   - No more hunting across `domain/`, `ui/`, `lib/`
   - Everything for a feature is in one place

### **Benefits:**

✅ **Easier Navigation**: Find all income-related code in `features/income/`  
✅ **Better Scalability**: Add features without touching existing ones  
✅ **Clearer Ownership**: Each feature is a self-contained module  
✅ **Faster Onboarding**: New developers can understand features independently  
✅ **Reduced Coupling**: Features don't accidentally depend on each other

---

## 📚 Additional Resources

- **PRD:** `PRD.md` - Product requirements
- **TRD:** `trd.md` - Technical requirements
- **Reference:** `Reference.md` - Design inspiration
- **Schema:** `schema.sql` - Database structure
- **README:** `README.md` - Project overview

---

## 🎯 Quick Reference

### **Most Common Tasks:**

| Task                     | Location                               |
| ------------------------ | -------------------------------------- |
| Add income event         | `features/income/actions.ts`           |
| Update calculation logic | `features/estimates/calculator.ts`     |
| Modify dashboard UI      | `features/dashboard/DashboardView.tsx` |
| Change assumption flow   | `features/assumptions/actions.ts`      |
| Update settings          | `features/settings/actions.ts`         |
| Add shared component     | `components/`                          |
| Create API endpoint      | `app/api/`                             |

---

**Questions?** Check the conversation history or review the PRD/TRD for context.
