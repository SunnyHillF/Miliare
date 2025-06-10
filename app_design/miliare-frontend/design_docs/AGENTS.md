# AGENTS.md

## Project Overview

This application is designed to meet the requirements outlined in `Design_specs.md`. The frontend is built with **Next.js 15** running on **Node.js 22**, utilizing the latest versions of **Tailwind CSS** and a **modern financial theme** with custom components. The goal is to deliver a professional, sophisticated, and maintainable user interface suitable for financial services and business applications.
The backend infrastructure is defined using **AWS Amplify Gen&nbsp;2**, which provisions the GraphQL API and storage resources through TypeScript configuration.

## 🚨 CRITICAL: Memory Optimization for Amplify Builds

### ⚠️ **NEVER USE WILDCARD IMPORTS FOR LUCIDE-REACT**

**The most critical rule for preventing Amplify build failures:**

#### ❌ **FORBIDDEN - Causes Memory Exhaustion:**
```typescript
import * as icons from 'lucide-react'  // NEVER DO THIS
```

#### ✅ **REQUIRED - Use Specific Imports:**
```typescript
import { DollarSign, Clock, Users, TrendingUp } from 'lucide-react'

// For dynamic icon usage, create a mapping:
const iconMap: Record<string, any> = {
  DollarSign,
  Clock, 
  Users,
  TrendingUp
}

// Then use: const Icon = iconMap[iconName]
```

### Why This Matters
- **Wildcard imports** load 1000+ icons (~50MB) into memory
- **Amplify builds** fail with out-of-memory errors
- **Build time** increases from 6s to timeout/failure
- **Bundle size** becomes bloated with unused icons

### Implementation Rules
1. **Always import specific icons** from lucide-react
2. **Create icon mappings** for dynamic usage patterns
3. **Never use** `import *` syntax with any large library
4. **Monitor bundle analyzer** to catch large imports

### Current Build Configuration
- **Instance Type**: XLarge (72GB RAM) - Required due to lucide-react usage
- **Heap Size**: 60GB for Node.js builds
- **Chunk Size**: Max 200kb per webpack chunk
- **Tree Shaking**: Enabled for lucide-react via modularizeImports

### If Build Fails
1. Check for wildcard imports: `grep -r "import \* as.*lucide" .`
2. Replace with specific imports immediately
3. Verify XLarge instance is selected in Amplify Console
4. See `MEMORY_OPTIMIZATION.md` for detailed troubleshooting

## Design Theme: Professional Financial Services

### Color Palette
The application uses a sophisticated **Navy Blue & Gold** professional palette:

- **Primary**: Deep Navy Blue (#1e40af) - Professional, trustworthy, financial
- **Secondary**: Warm Gray (#f7fafc) - Clean, modern backgrounds  
- **Accent**: Gold (#d69e2e) - Premium, success indicators
- **Success**: Professional Green (#38a169) - Positive metrics, confirmations
- **Warning**: Amber (#d69e2e) - Attention, pending states
- **Error**: Professional Red (#e53e3e) - Errors, critical alerts
- **Background**: Light Gray (#fafbfc) - Clean, professional backdrop

### Typography
- **Font Family**: Inter - Modern, highly legible, professional
- **Font Features**: Tabular numbers for financial data, optimized spacing
- **Hierarchy**: Clear typography scale with proper weight distribution

### Visual Style
- **Cards**: Elevated with subtle shadows and rounded corners
- **Spacing**: Generous whitespace for clarity and focus
- **Icons**: Lucide React - Consistent, professional icon set
- **Gradients**: Subtle gradients for depth and premium feel
- **Borders**: Clean, subtle borders with proper contrast

### Components
All components are **custom-built** for reliability and performance:
- No external component library dependencies
- TypeScript-first with proper interfaces
- Responsive design built-in
- Accessibility compliant
- Consistent with financial services UX patterns

## Next.js 15 Specific Considerations

### Breaking Change: Async Params in Dynamic Routes
**CRITICAL:** In Next.js 15, the `params` prop in dynamic route page components is now a **Promise** and must be awaited.

#### ✅ **CORRECT (Next.js 15):**
```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params; // Must await params
  // ... rest of component
}
```

#### ❌ **INCORRECT (Pre-Next.js 15):**
```typescript
interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const { slug } = params; // This will cause TypeScript errors in Next.js 15
  // ... rest of component
}
```

### Key Points:
- **Always await params** in dynamic route components (`[slug]`, `[id]`, etc.)
- **Make the component async** when using dynamic params
- **Update TypeScript interfaces** to reflect `params: Promise<T>`
- **This applies to all dynamic routes** including nested routes like `[category]/[slug]`

### Example Dynamic Route Structure:
```
app/
├── blog/
│   └── [slug]/
│       └── page.tsx ← Must use async params
├── dashboard/
│   └── learn/
│       └── [partnerSlug]/
│           └── page.tsx ← Must use async params
```

## Data Flow & API Integration

### Client-Side Rendering (CSR):
All data required for CSR is fetched from the **Amplify GraphQL API**.

### Server-Side Rendering (SSR):
All data required for SSR is also fetched from the **Amplify GraphQL API**.

### Data Submission:
All mutations and file uploads are handled through Amplify's GraphQL API and Storage modules. Email notifications continue to be triggered via these operations.

## Architecture & Best Practices

### Frontend:
- Built with Next.js 15 and Node.js 22.
- Uses the latest Tailwind CSS and shadcn/ui for a modern, consistent design.
- All UI should be responsive and performant.

### Data Handling:
- Use Amplify GraphQL for all data fetching and submission on both the client and server.
- Store uploaded documents using Amplify Storage (S3).

### Extensibility:
- Code should be modular and easy to extend for future features.
- Follow best practices for component structure and state management.

### Security:
- Ensure that sensitive operations (such as admin access) are protected and validated on the server side.

## Custom Components Guide for AI Coding Agents

### Why Custom Components Are Superior for AI Agents

**Pre-built component libraries often fail for AI agents because:**
- Complex dependency chains that break unpredictably
- Opaque component behavior that's hard to debug
- Frequent version conflicts and missing peer dependencies
- Over-engineered components with unnecessary complexity
- Documentation that doesn't match actual behavior

**Custom components provide:**
- ✅ **Full control** over functionality and styling
- ✅ **Predictable behavior** with no hidden surprises
- ✅ **Easy debugging** with transparent code
- ✅ **Zero dependency conflicts** beyond React and Tailwind
- ✅ **Exactly what you need** without bloat

### Custom Component Architecture

#### Directory Structure
```
components/
├── custom/
│   ├── Button.tsx          # Basic interactive elements
│   ├── Card.tsx           # Layout components
│   ├── Modal.tsx          # Complex UI patterns
│   ├── Table.tsx          # Data display
│   ├── Form/              # Form-related components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Checkbox.tsx
│   └── Chart/             # Data visualization
│       ├── LineChart.tsx
│       └── BarChart.tsx
```

### Essential Custom Components

#### 1. MetricCard Component
```typescript
import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  description?: string
  icon?: React.ReactNode
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  description,
  icon 
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600', 
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeColors[changeType]} mt-1`}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### 2. SimpleTable Component
```typescript
import React from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface SimpleTableProps {
  columns: Column[]
  data: any[]
  title?: string
  description?: string
}

export function SimpleTable({ columns, data, title, description }: SimpleTableProps) {
  return (
    <div className="bg-white rounded-lg shadow border">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="px-6 py-8 text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}
```

#### 3. StatusBadge Component
```typescript
import React from 'react'

interface StatusBadgeProps {
  status: string
  variant?: 'success' | 'warning' | 'info' | 'error' | 'neutral'
}

export function StatusBadge({ status, variant = 'neutral' }: StatusBadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800', 
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  }

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
      {status}
    </span>
  )
}
```

#### 4. Button Component
```typescript
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}
```

#### 5. Input Component
```typescript
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
```

### Custom Component Best Practices

#### 1. **Type Safety First**
```typescript
// Always define proper TypeScript interfaces
interface ComponentProps {
  required: string
  optional?: boolean
  variant?: 'type1' | 'type2' | 'type3'  // Use union types for variants
  children?: React.ReactNode
}

// Extend HTML element props when appropriate
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}
```

#### 2. **Tailwind Utilities Pattern**
```typescript
// Use object maps for variant-based styling
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
}

// Combine classes safely
className={`base-classes ${variants[variant]} ${customClassName}`}
```

#### 3. **Accessibility by Default**
```typescript
// Include proper ARIA attributes
<button
  aria-label={ariaLabel}
  aria-pressed={isPressed}
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
```

#### 4. **Responsive Design Built-in**
```typescript
// Always include responsive utilities
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

#### 5. **Error Handling and Fallbacks**
```typescript
// Provide sensible defaults and handle edge cases
export function DataTable({ data = [], columns = [], loading = false }) {
  if (loading) return <div>Loading...</div>
  if (!data.length) return <div>No data available</div>
  
  return (
    // Table implementation
  )
}
```

### Usage Patterns

#### Implementing Custom Components
```typescript
// Import custom components
import { MetricCard } from '@/components/custom/MetricCard'
import { SimpleTable } from '@/components/custom/SimpleTable'
import { StatusBadge } from '@/components/custom/StatusBadge'

export default function Dashboard() {
  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status: string) => (
        <StatusBadge 
          status={status} 
          variant={status === 'active' ? 'success' : 'warning'} 
        />
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <MetricCard
        title="Total Users"
        value="1,234"
        change="+12%"
        changeType="positive"
        icon={<UsersIcon className="h-8 w-8" />}
      />
      
      <SimpleTable
        title="User List"
        columns={tableColumns}
        data={userData}
      />
    </div>
  )
}
```

### When to Create vs. Use Inline Styling

#### ✅ **Create Custom Component When:**
- Pattern is used 3+ times across the application
- Logic or state management is involved
- Complex styling that would clutter the JSX
- Need consistent behavior and props validation

#### ✅ **Use Inline Tailwind When:**
- One-off styling that won't be reused
- Simple layout adjustments
- Quick prototyping
- Component-specific styling that doesn't need abstraction

### Performance Considerations

#### 1. **Memoization for Expensive Components**
```typescript
import { memo } from 'react'

export const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Component implementation
})
```

#### 2. **Avoid Inline Object Creation**
```typescript
// ❌ Bad: Creates new object on every render
<Component style={{ marginTop: '20px' }} />

// ✅ Good: Use Tailwind classes
<Component className="mt-5" />
```

#### 3. **Conditional Class Names**
```typescript
// Use clsx or similar utility for complex conditions
import clsx from 'clsx'

<div className={clsx(
  'base-classes',
  isActive && 'active-classes',
  variant === 'large' && 'large-classes'
)} />
```

### Error Prevention

#### 1. **Always Provide Fallbacks**
```typescript
export function Avatar({ src, alt, size = 'md' }) {
  return (
    <img
      src={src || '/default-avatar.png'}
      alt={alt || 'User avatar'}
      className={`rounded-full ${sizes[size]}`}
      onError={(e) => {
        e.currentTarget.src = '/default-avatar.png'
      }}
    />
  )
}
```

#### 2. **Validate Props in Development**
```typescript
// Use TypeScript for compile-time validation
// Add runtime validation for critical props
if (process.env.NODE_ENV === 'development') {
  if (!required) {
    console.warn('Component: required prop is missing')
  }
}
```

## Tailwind CSS Guidelines & Best Practices

### Core Philosophy - Utility-First Approach
- **DO:** Use single-purpose utility classes directly in markup (`flex`, `p-6`, `text-xl`, `bg-white`)
- **DON'T:** Create custom CSS classes unless absolutely necessary
- **WHY:** Faster development, safer changes, easier maintenance, portable code, CSS doesn't grow

### Managing Utility Classes

#### ✅ **DO:**
```jsx
// Good: Use utility classes for styling
<div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
  <img className="size-12 shrink-0" src="/logo.svg" alt="Logo" />
  <div className="text-xl font-medium text-black">Title</div>
</div>
```

#### ❌ **DON'T:**
```jsx
// Bad: Avoid inline styles
<div style={{display: 'flex', padding: '24px'}}>
  <img style={{width: '48px', height: '48px'}} />
</div>
```

### Responsive Design
- **Always use responsive utilities:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Mobile-first approach:** Base classes apply to all sizes, use prefixes for larger screens
```jsx
<div className="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6">
```

### State Variants
- Use state variants for interactions: `hover:`, `focus:`, `active:`, `disabled:`
```jsx
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
```

### Managing Duplication

#### 1. **Component Approach (Preferred)**
```jsx
// Create reusable components for repeated UI patterns
function Button({ children, variant = 'primary' }) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

#### 2. **Custom CSS (When Components Are Overkill)**
```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600;
  }
}
```

#### 3. **Multi-cursor Editing (For Small Local Duplications)**
- Use your editor's multi-cursor feature to edit multiple similar elements simultaneously

### Avoiding Style Conflicts

#### ✅ **DO:**
```jsx
// Use conditional classes
<div className={gridLayout ? "grid" : "flex"}>
```

#### ❌ **DON'T:**
```jsx
// Avoid conflicting utilities
<div className="grid flex"> {/* grid will override flex */}
```

### Using Important Modifier
- Use `!` suffix sparingly when you need to force specificity:
```jsx
<div className="bg-red-500!"> {/* Forces !important */}
```

### Design System Integration
- **Use CSS variables for consistency:** Tailwind utilities should reference your design tokens
- **Leverage theme variables:** Use predefined spacing, colors, and typography scales
- **Follow the constraint-based approach:** Choose from predefined values rather than arbitrary ones

### Component Patterns

#### Large UI Sections (Use Components)
```jsx
function DashboardCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
```

#### Small Repeated Elements (Use Utilities + Conditionals)
```jsx
<button 
  className={`px-3 py-2 rounded-lg font-medium ${
    isActive 
      ? 'bg-blue-500 text-white' 
      : 'text-gray-700 hover:bg-gray-100'
  }`}
>
```

### Performance Considerations
- **Purge unused styles:** Ensure your `content` array in Tailwind config covers all template files
- **Avoid style duplication:** Use components for repeated patterns
- **Leverage Tailwind's optimization:** Trust the framework's CSS generation and purging

## AI Coding Agent Instructions

-### General Guidelines:
- Follow the design and data flow as described above
- Use the Amplify GraphQL API consistently across client and server rendering contexts
- Users are referenced by their Auth ID, and profile information is persisted via Amplify
- Ensure all new features and components are consistent with the modern UI/UX standards set by Tailwind and shadcn/ui
- Document any architectural or design decisions in the codebase or relevant markdown files
- When in doubt, refer to `Design_specs.md` for detailed requirements

### Custom Component Strategy:
1. **Prefer custom components over pre-built libraries** - they're more reliable for AI agents
2. **Start with simple, focused components** - build complexity gradually
3. **Always use TypeScript interfaces** - type safety prevents runtime errors
4. **Follow the established patterns** - use the component templates provided above
5. **Test components in isolation** - ensure they work independently
6. **Document component props** - clear interfaces make components easier to use

### Tailwind-Specific Instructions:
1. **Always use utility-first approach** - prefer Tailwind utilities over custom CSS
2. **Create components for repeated UI patterns** - don't duplicate complex class combinations
3. **Use responsive design patterns** - every interface should work on mobile and desktop
4. **Implement proper state management** - use hover, focus, and active states appropriately
5. **Follow the design system** - use consistent spacing, colors, and typography from the theme
6. **Avoid style conflicts** - never add conflicting utility classes to the same element
7. **Use semantic markup** - proper HTML structure with appropriate ARIA attributes
8. **Optimize for performance** - ensure efficient class usage and leverage Tailwind's purging

### Code Quality Standards:
- Prefer readability over brevity in class names
- Group related utilities logically (layout, spacing, colors, typography)
- Use meaningful component names that describe their purpose
- Comment complex utility combinations when their purpose isn't immediately clear
- Test responsive behavior across different screen sizes
- Ensure proper accessibility with focus states and semantic markup
- When using React hooks like `useEffect` in a component, add the `'use client'`
  directive at the top of the file or ensure the parent component already has it
  so Next.js compiles the component for the client.
