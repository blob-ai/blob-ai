
# UI Component System Documentation

This document outlines our UI component system, designed to provide consistent styling, accessibility, and reusability across the application.

## Core UI Components

### Layout Components

- **PageContainer**: Consistent container for page content
  - Props: `children`, `className`, `noPadding?`, `fullWidth?`
  - Usage: Wraps main content with consistent padding and width
  - File: `/components/ui/page-container.tsx`
  
- **PageHeader**: Standardized page header
  - Props: `title`, `description?`, `className?`, `actions?`
  - Usage: Top section of each page with consistent styling
  - File: `/components/ui/layout/page-header.tsx`
  
- **SectionHeader**: Reusable section header
  - Props: `title`, `description?`, `className?`, `rightContent?`, `children?`
  - Usage: Headers for content sections within a page
  - File: `/components/ui/section-header.tsx`
  
- **CardContainer**: Reusable container for card-like elements
  - Props: `children`, `className?`, `noPadding?`, `fullWidth?`
  - Usage: Content blocks, panels, and card-like elements
  - File: `/components/ui/card-container.tsx`

- **AppHeader**: Application top navigation bar
  - File: `/components/ui/layout/app-header.tsx`

### Interactive Components

- **ActionButton**: Consistent button with icon support
  - Props: `icon?`, `label`, `className?`, `mobileIconOnly?`, `variant?`, `size?`
  - Usage: Primary actions, menu items, and call-to-actions
  - File: `/components/ui/action-button.tsx`

- **Button**: Core button component from shadcn/ui
  - Variants: "default", "destructive", "outline", "secondary", "ghost", "link"
  - Sizes: "default", "sm", "lg", "icon"
  - File: `/components/ui/button.tsx`

- **RainbowButton**: Animated button with rainbow gradient
  - Usage: Call-to-action buttons and special actions
  - File: `/components/ui/rainbow-button.tsx`

### Form Components

- **Input**: Text input field
  - File: `/components/ui/input.tsx`

- **Select**: Dropdown selection component
  - Components: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
  - File: `/components/ui/select.tsx`

- **Checkbox**: Checkbox input component
  - File: `/components/ui/checkbox.tsx`

- **RadioGroup**: Radio button group component
  - File: `/components/ui/radio-group.tsx`

### Data Display Components

- **Avatar**: User avatar component
  - Components: `Avatar`, `AvatarImage`, `AvatarFallback`
  - File: `/components/ui/avatar.tsx`

- **ScrollArea**: Custom scrollable area
  - File: `/components/ui/scroll-area.tsx`

- **TextShimmer**: Text with gradient shimmer animation
  - Props: `children`, `className?`, `duration?`
  - File: `/components/ui/text-shimmer.tsx`

### Feedback Components

- **Toast**: Notification toast component
  - Usage: User notifications, feedback messages
  - File: `/components/ui/toast.tsx`
  - Utilities: `useToast` hook for easy toast creation

- **Dialog**: Modal dialog component
  - Components: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
  - File: `/components/ui/dialog.tsx`

- **Progress**: Progress bar component
  - Props: `value`, `max?`, `className?`
  - File: `/components/ui/progress.tsx`

## Component Usage Examples

### Basic Layout Example

```tsx
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { CardContainer } from "@/components/ui/card-container";

function MyPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Page Title"
        description="Description of the page"
      />
      
      <SectionHeader title="Section Title" />
      
      <CardContainer>
        <p>Card content goes here</p>
      </CardContainer>
    </PageContainer>
  );
}
```

### Interactive Components Example

```tsx
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { PlusIcon } from "lucide-react";

function MyComponent() {
  return (
    <div className="space-y-4">
      <Button>Standard Button</Button>
      
      <Button variant="outline">Outline Button</Button>
      
      <ActionButton
        icon={<PlusIcon />}
        label="Add Item"
        mobileIconOnly
      />
    </div>
  );
}
```

### Form Components Example

```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function MyForm() {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      
      <div>
        <label htmlFor="category">Category</label>
        <Select>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Accessibility Guidelines

- All components support keyboard navigation
- Form controls have proper labels and ARIA attributes
- Sufficient color contrast for all text elements
- Focus management for interactive elements

## Theme System

Our UI components use a consistent theme system based on CSS variables and Tailwind CSS. The theme defines:

- Colors (primary, secondary, accent, destructive)
- Typography (font families, sizes, weights)
- Spacing (margin, padding scales)
- Borders (radius, width, colors)
- Shadows (elevation levels)

## Responsive Design Strategy

- Mobile-first approach
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly sizing on mobile devices
- Layout adaptations at breakpoints using Tailwind's prefix system
