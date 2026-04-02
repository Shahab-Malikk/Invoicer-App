# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Frontend — Invoicer App (Next.js 15)

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build — must pass with 0 errors before task is done
npm run lint      # ESLint check
npm start         # Start production server (requires build first)
```

No test framework is configured. Verification is done via `npm run build` (zero errors) and manual browser testing.

## Stack

- Next.js 15 App Router
- TypeScript (strict mode — no `any` ever)
- Tailwind CSS (utility classes only — no custom CSS)
- JWT auth via httpOnly cookie (set by backend, never touched manually)
- Running on: http://localhost:3000
- Backend API: http://localhost:5000
- External auth UI: http://localhost:4005/?app=kycv1 (configurable via NEXT_PUBLIC_AUTH_UI_URL)

## Auth flow (4 layers — read this to understand the security model)

1. **Edge middleware** (`middleware.ts`) — checks cookie _presence_ only, redirects unauthenticated users to external auth UI
2. **Server layout** (`app/(protected)/layout.tsx`) — reads `auth_token` + `user_info` cookies server-side, hydrates `AuthProvider`
3. **Client guard** (`core/components/ModuleGuard.tsx`) — checks `user.modules` from context, redirects if user lacks access to a specific module
4. **Backend `[Authorize]`** — full JWT signature validation on every API call

Login is handled externally. The callback route (`app/auth/callback/route.ts`) exchanges an auth code with the backend, then sets two cookies: `auth_token` (httpOnly) and `user_info` (readable by JS for client hydration).

---

## Folder structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              Login page
│   ├── (protected)/
│   │   ├── layout.tsx                Auth guard + AuthProvider hydration
│   │   ├── dashboard/
│   │   │   └── page.tsx              Module tile grid
│   │   └── modules/
│   │       ├── invoice/
│   │       │   └── page.tsx          Invoice route (uses ModuleGuard)
│   │       └── school-fee/
│   │           └── page.tsx          School fee route (uses ModuleGuard)
│   ├── layout.tsx                    Root layout
│   ├── page.tsx                      Redirects to /dashboard or /login
│   └── globals.css                   Tailwind directives only
│
├── modules/                          ← All module UI lives here
│   ├── invoice/
│   │   ├── index.tsx                 Public entry point (default export)
│   │   ├── types.ts                  TypeScript interfaces
│   │   └── components/               Sub-components for this module only
│   └── school-fee/
│       ├── index.tsx
│       ├── types.ts
│       └── components/
│
├── core/                             ← Shared infrastructure — be careful here
│   ├── auth/
│   │   ├── AuthContext.tsx           React context + useAuth hook
│   │   └── authActions.ts            Server Actions: loginAction, logoutAction
│   ├── api/
│   │   └── apiClient.ts              Fetch wrapper — ALWAYS use this
│   └── components/
│       ├── ModuleGuard.tsx           Client-side module access guard
│       └── Navbar.tsx                Top navigation
│
├── lib/
│   └── constants.ts                  MODULE_KEYS, API_BASE_URL
│
├── middleware.ts                     Edge route protection
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local                        API URLs (not committed to git)
```

---

## The golden rules

1. **Modules never import from each other**
   `modules/invoice/` cannot import from `modules/school-fee/` — ever.

2. **All API calls go through apiClient.ts**
   Never use raw `fetch()` inside module code.

3. **Never modify core files unless the task explicitly requires it**
   Core files are: `middleware.ts`, `AuthContext.tsx`, `authActions.ts`,
   `apiClient.ts`, `ModuleGuard.tsx`, `Navbar.tsx`

4. **Every module page must be wrapped in ModuleGuard**
   No exceptions — this is the access control layer.

5. **No inline styles — Tailwind only**
   If it can't be done with Tailwind classes, ask before doing anything else.

---

## Core files — what each one does

| File                                 | Purpose                                       | Modify?                          |
| ------------------------------------ | --------------------------------------------- | -------------------------------- |
| `middleware.ts`                      | Edge redirect — no token → /login             | Only if auth flow changes        |
| `core/auth/AuthContext.tsx`          | Holds user + modules in React context         | Only if user model changes       |
| `core/auth/authActions.ts`           | Server Actions for login/logout               | Only if auth flow changes        |
| `core/api/apiClient.ts`              | All API calls — attaches cookie automatically | Only if new HTTP methods needed  |
| `core/components/ModuleGuard.tsx`    | Redirects if user lacks module access         | Only if access logic changes     |
| `core/components/Navbar.tsx`         | Top nav — reads modules from context          | Only if nav design changes       |
| `lib/constants.ts`                   | MODULE_KEYS enum + API_BASE_URL               | Add new keys when adding modules |
| `app/(protected)/layout.tsx`         | Reads cookies server-side, wraps AuthProvider | Only if auth structure changes   |
| `app/(protected)/dashboard/page.tsx` | MODULE_REGISTRY — dashboard tiles             | Add entry when adding modules    |

---

## How to add a new module — follow this exactly every time

### Step 1 — Add the key to lib/constants.ts

```typescript
export const MODULE_KEYS = {
  INVOICE: "invoice",
  SCHOOL_FEE: "school_fee",
  YOUR_MODULE: "your_module", // ← add here
} as const;

export type ModuleKey = (typeof MODULE_KEYS)[keyof typeof MODULE_KEYS];
```

### Step 2 — Add to MODULE_REGISTRY in app/(protected)/dashboard/page.tsx

```typescript
const MODULE_REGISTRY: Record<
  string,
  {
    label: string;
    href: string;
    description: string;
    color: string;
  }
> = {
  // existing entries...
  your_module: {
    label: "Your Module",
    href: "/modules/your-module",
    description: "One sentence describing what this module does",
    color: "bg-violet-50 border-violet-100 hover:border-violet-300",
  },
};
```

Available tile colors (use one per module, no repeats):

```
violet:  bg-violet-50 border-violet-100 hover:border-violet-300
teal:    bg-teal-50   border-teal-100   hover:border-teal-300
amber:   bg-amber-50  border-amber-100  hover:border-amber-300
rose:    bg-rose-50   border-rose-100   hover:border-rose-300
blue:    bg-blue-50   border-blue-100   hover:border-blue-300
indigo:  bg-indigo-50 border-indigo-100 hover:border-indigo-300
```

### Step 3 — Create the module folder and files

```
modules/your-module/
├── index.tsx        ← default export, root UI component
├── types.ts         ← all TypeScript interfaces for this module
└── components/      ← sub-components (create as needed)
    └── .gitkeep
```

### Step 4 — Create the route page

```tsx
// app/(protected)/modules/your-module/page.tsx
import ModuleGuard from "@/core/components/ModuleGuard";
import YourModule from "@/modules/your-module";

export default function YourModulePage() {
  return (
    <ModuleGuard moduleKey="your_module">
      <YourModule />
    </ModuleGuard>
  );
}
```

### Step 5 — Remind the backend session

When you start the backend session for this module, tell Claude Code:
"Add 'your_module' to admin@test.com's modules in UserService.cs"

---

## API calls — patterns to always follow

### Always define types first (in modules/{name}/types.ts)

```typescript
// modules/invoice/types.ts

export interface Invoice {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  createdAt: string;
}

export interface CreateInvoiceRequest {
  title: string;
  amount: number;
  dueDate: string;
}

export interface UpdateInvoiceRequest {
  title?: string;
  amount?: number;
  status?: Invoice["status"];
}
```

### GET request

```typescript
import { apiGet } from "@/core/api/apiClient";
import type { Invoice } from "./types";

const invoices = await apiGet<Invoice[]>("/api/invoice");
const single = await apiGet<Invoice>("/api/invoice/some-id");
```

### POST request

```typescript
import { apiPost } from "@/core/api/apiClient";
import type { Invoice, CreateInvoiceRequest } from "./types";

const created = await apiPost<Invoice>("/api/invoice", {
  title: "Website Design",
  amount: 15000,
  dueDate: "2026-04-30",
} satisfies CreateInvoiceRequest);
```

### PUT / DELETE

```typescript
import { apiPut, apiDelete } from "@/core/api/apiClient";

const updated = await apiPut<Invoice>("/api/invoice/id", { status: "Sent" });
await apiDelete("/api/invoice/id");
```

### Full component with loading + error + empty states

```typescript
'use client'
import { useState, useEffect } from 'react'
import { apiGet } from '@/core/api/apiClient'
import type { Invoice } from './types'

export default function InvoiceApp() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    apiGet<Invoice[]>('/api/invoice')
      .then(setInvoices)
      .catch(() => setError('Failed to load invoices. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage message={error} />

  return (
    <div>
      {invoices.length === 0 ? <EmptyState /> : <InvoiceTable data={invoices} />}
    </div>
  )
}
```

---

## Tailwind patterns — copy these exactly

### Page wrapper (every module index.tsx starts with this)

```tsx
<div>
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Page Title</h1>
      <p className="text-gray-500 text-sm mt-1">Subtitle or description</p>
    </div>
    {/* optional action button goes here */}
  </div>
  {/* page content */}
</div>
```

### White card

```tsx
<div className="bg-white rounded-2xl border border-gray-200 p-6">content</div>
```

### Primary button

```tsx
<button
  onClick={handleClick}
  disabled={loading}
  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium
             rounded-lg hover:bg-indigo-700 active:bg-indigo-800
             transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Saving..." : "Save"}
</button>
```

### Secondary / outline button

```tsx
<button
  onClick={handleClick}
  className="px-4 py-2 border border-gray-200 text-gray-700 text-sm
             font-medium rounded-lg hover:bg-gray-50 transition"
>
  Cancel
</button>
```

### Danger button

```tsx
<button
  onClick={handleDelete}
  className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium
             rounded-lg hover:bg-red-100 transition"
>
  Delete
</button>
```

### Input field

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Field Label
  </label>
  <input
    type="text"
    placeholder="Placeholder text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg
               text-sm placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-indigo-500
               focus:border-transparent transition"
  />
</div>
```

### Select dropdown

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Status
  </label>
  <select
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg
               text-sm focus:outline-none focus:ring-2
               focus:ring-indigo-500 transition bg-white"
  >
    <option value="">Select...</option>
    <option value="draft">Draft</option>
  </select>
</div>
```

### Data table

```tsx
<div className="overflow-hidden rounded-xl border border-gray-200">
  <table className="w-full text-sm">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th
          className="px-4 py-3 text-left text-xs font-medium
                       text-gray-500 uppercase tracking-wide"
        >
          Column Name
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {items.map((item) => (
        <tr key={item.id} className="hover:bg-gray-50 transition">
          <td className="px-4 py-3 text-gray-900">{item.field}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Status badge

```tsx
// Define outside component
const STATUS_STYLES: Record<string, string> = {
  Draft:   'bg-gray-100  text-gray-600',
  Sent:    'bg-blue-100  text-blue-700',
  Paid:    'bg-green-100 text-green-700',
  Overdue: 'bg-red-100   text-red-700',
  Active:  'bg-green-100 text-green-700',
  Inactive:'bg-gray-100  text-gray-500',
}

// In JSX
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                  text-xs font-medium ${STATUS_STYLES[status] ?? ''}`}>
  {status}
</span>
```

### Loading spinner

```tsx
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="animate-spin rounded-full h-8 w-8
                      border-b-2 border-indigo-600"
      />
    </div>
  );
}
```

### Empty state

```tsx
function EmptyState({
  message = "No items yet",
  hint = "Create one to get started",
}) {
  return (
    <div
      className="text-center py-16 border border-dashed
                    border-gray-200 rounded-2xl"
    >
      <p className="text-gray-400 text-sm font-medium">{message}</p>
      <p className="text-gray-400 text-xs mt-1">{hint}</p>
    </div>
  );
}
```

### Error message

```tsx
function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-red-700
                    bg-red-50 border border-red-100 rounded-lg px-4 py-3"
    >
      <span>{message}</span>
    </div>
  );
}
```

### Success message

```tsx
{
  success && (
    <div
      className="text-sm text-green-700 bg-green-50 border
                  border-green-100 rounded-lg px-4 py-3"
    >
      {success}
    </div>
  );
}
```

### Modal / dialog (no fixed positioning — use this pattern)

```tsx
{
  isOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center
                  justify-center bg-black/40 px-4"
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full
                    max-w-md p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Modal Title
        </h2>
        {/* content */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-200 text-gray-700
                           text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white text-sm
                           font-medium rounded-lg hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## TypeScript rules

```typescript
// ✅ Always type state
const [items, setItems] = useState<Invoice[]>([])
const [open, setOpen]   = useState<boolean>(false)

// ✅ Always type props
interface TableProps {
  data:     Invoice[]
  onDelete: (id: string) => void
}

// ✅ Use satisfies for request objects
const payload = {
  title:  'Invoice #1',
  amount: 5000,
} satisfies CreateInvoiceRequest

// ✅ Use union types for status/enum fields
type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'

// ❌ Never use any
const data: any = ...       // forbidden
const fn = (x: any) => ... // forbidden
```

---

## Component structure rules

```typescript
// ✅ Correct structure for a module index.tsx
"use client"; // only if using hooks/events

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/core/api/apiClient";
import type { Invoice } from "./types";
import InvoiceTable from "./components/InvoiceTable";
import CreateInvoiceForm from "./components/CreateInvoiceForm";

export default function InvoiceApp() {
  // 1. state
  // 2. effects
  // 3. handlers
  // 4. render
}
```

Sub-components go in `modules/{name}/components/` — not in `app/` or `core/`.

---

## Current modules

| Module     | Key        | Route               | Tile color | Status     |
| ---------- | ---------- | ------------------- | ---------- | ---------- |
| invoice    | invoice    | /modules/invoice    | violet     | Shell only |
| school_fee | school_fee | /modules/school-fee | teal       | Shell only |

---

## Environment variables

```bash
# .env.local (never commit this file)
API_BASE_URL=http://localhost:5000              # server-side (Server Actions)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000  # client-side (apiClient.ts)
```

---

## Session rules — follow every time

1. **Read this file first** — before touching any code
2. **Read existing module files** relevant to today's task
3. **State your plan clearly** — wait for approval before writing
4. **Write code following the patterns above** — do not invent new patterns
5. **Do not touch core files** unless the task explicitly requires it
6. **After writing** — state exactly what to test and how
7. **Verify** — `npm run build` must show 0 errors before the task is done

---
