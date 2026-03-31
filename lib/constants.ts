/**
 * MODULE_KEYS — canonical string keys shared across:
 *   - Dashboard's MODULE_REGISTRY
 *   - ModuleGuard's moduleKey prop
 *   - Backend's User.Modules list
 *
 * Always use these constants instead of raw strings.
 * This makes renaming a module a one-line change.
 */
export const MODULE_KEYS = {
  INVOICE: 'invoice',
  SCHOOL_FEE: 'school_fee',
} as const

export type ModuleKey = (typeof MODULE_KEYS)[keyof typeof MODULE_KEYS]

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'
