// Ground-truth design tokens — see spec/design-system.md & spec/theme.json
export const COLORS = {
  accent: '#3b82f6',
  accentDark: '#1d4ed8',
  ink: '#111827',
  muted: '#6b7280',
  axis: '#9ca3af',
  line: '#e5e7eb',
  zebra: '#f9fafb',
  navy: '#0a0e2a',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  canceled: '#6b7280',
} as const;

// theme.json dataColors.colors
export const DATA_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#84cc16',
];

// Build / deployment status palette (per brief)
export const STATUS_COLORS = {
  succeeded: '#10b981',
  failed: '#ef4444',
  canceled: '#6b7280',
  partiallySucceeded: '#f59e0b',
} as const;

// Bug severity palette (per brief — vivid, matches the published screen)
export const SEVERITY_COLORS = {
  Critical: '#e8000d',
  High: '#f57c00',
  Medium: '#f5c800',
  Low: '#00c247',
} as const;

// Retrospect work-item category palette (per brief)
export const CATEGORY_COLORS = {
  'Tech Debt': '#b0224f',
  Product: '#4caf50',
  Maintenance: '#2196f3',
  Innovation: '#14253d',
} as const;
