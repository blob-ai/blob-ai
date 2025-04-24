
# Component Architecture

This document outlines the overall component architecture of the Inspire.me application.

## Component Structure

Our components are organized into several categories:

### UI Components (`/components/ui`)

Basic building blocks that are widely reused across the application:

- **Core UI Components**: Button, Select, Card, Dialog, etc. (from shadcn/ui)
- **Layout Components**: PageContainer, SectionHeader, PageHeader, AppHeader
- **Feedback Components**: Toast, Progress, Dialog
- **Form Components**: Input, Select, Checkbox, RadioGroup
- **Interactive Components**: ActionButton, RainbowButton, etc.

### Feature Components

Components specific to application features, organized by domain:

#### Chat Components (`/components/chat`)
- **Chat Interface**: ChatSidebar, SuggestionChips, ContentPreview
- **Content Analysis**: PostAnalysisResult, PostAnalyzeCard
- **Content Creation**: ContentCreationCard, ContentSetupForm, ContentInput

#### Dashboard Components (`/components/dashboard`)
- **Kanban Board**: DraggableKanbanBoard, TaskCard, TaskColumn
- **Date Management**: DatePicker

#### Pricing Components (`/components/pricing`)
- **Plan Management**: PlanCard, PlanSelector

#### Landing Components (`/components/landing`)
- **Landing Sections**: Hero, Features, FAQ, CTA

#### Auth Components (`/components/auth`)
- **Authorization**: AuthGuard

### Layout Components (`/components/layouts`)

Components that define the overall application structure:

- **Layout**: Main layout with sidebar and content area
- **Sidebar**: Application navigation sidebar
- **SidebarProvider**: Context provider for sidebar state

## State Management

We use a combination of state management approaches:

- **Local Component State**: For UI-specific state
- **Context API**: For shared state across components
  - AuthContext: User authentication state
  - ChatContext: Chat and content state
  - SidebarContext: Navigation state
- **React Query**: For server state and API data

## Component Communication

Our components communicate using these patterns:

1. **Props**: For direct parent-to-child communication
2. **Context**: For sharing state across component trees
3. **Custom Hooks**: For encapsulating and sharing stateful logic

## Component Guidelines

When developing new components:

1. **Single Responsibility**: Each component should do one thing well
2. **Composition Over Configuration**: Use composition for flexible components
3. **Consistent Naming**: Follow established naming conventions
4. **TypeScript Types**: Define proper interfaces for all props
5. **Accessibility**: Ensure all components meet accessibility standards
6. **Responsive Design**: Design for all screen sizes from the start

## Common Component Patterns

### Higher-Order Components

Used for cross-cutting concerns like authentication:

```tsx
// Example: AuthGuard for protected routes
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

### Compound Components

Used for complex UI components with multiple related parts:

```tsx
// Example: Dialog composed of multiple parts
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Content goes here</p>
  </DialogContent>
</Dialog>
```

### Render Props

Used for sharing behavior between components:

```tsx
// Example: SidebarProvider sharing sidebar state
<SidebarProvider>
  {({ isSidebarOpen, toggleSidebar }) => (
    <Button onClick={toggleSidebar}>
      {isSidebarOpen ? 'Close' : 'Open'} Sidebar
    </Button>
  )}
</SidebarProvider>
```
