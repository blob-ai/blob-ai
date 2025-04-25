# Inspire.me - AI-Powered Content Creation Platform

## Project Info

**URL**: https://lovable.dev/projects/31cf770c-4532-4df9-8320-79f91681c2d5

## Project Overview

Inspire.me is an AI-powered content creation platform that helps users create and optimize content for various platforms. The application features AI chat capabilities, workspace management, and plan-based subscription tiers.

## Project Structure

### Core Functionality

#### AI Chat System (`/src/utils/systemPrompts.ts`, `/src/contexts/ChatContext.tsx`, `/src/pages/ChatInterface.tsx`)
- Defines different chat modes through system prompts:
  - Default chat for general assistance
  - Content Analysis for post evaluation
  - Content Creation for generating new content
- Chatbot interface in ChatInterface
- Chat state and functions managed in ChatContext

#### Backend (`/supabase/functions/`)
- Edge Functions for AI processing
- Chat completions handler for OpenAI integration

### Pages (`/src/pages/`)
- `Auth.tsx` - Authentication page (login/signup)
- `ChatInterface.tsx` - Main AI chat interface
- `Dashboard.tsx` - User dashboard
- `Index.tsx` - Landing page
- `UpgradePlan.tsx` - Plan upgrade modal
- `Templates.tsx` - Content templates
- `Workspace.tsx` - User workspace management
- `NotFound.tsx` - 404 page

### Components (`/src/components/`)
- `/ui/` - Basic UI components (buttons, cards, forms, etc.)
- `/layouts/` - Layout components (Sidebar, SidebarProvider, Layout)
- `/chat/` - Chat-related components
- `/dashboard/` - Dashboard-related components
- `/pricing/` - Pricing and plan-related components
- `/landing/` - Landing page components
- `/auth/` - Authentication components

### Contexts (`/src/contexts/`)
- `AuthContext.tsx` - Authentication state and functions
- `ChatContext.tsx` - Chat state and functions

### Utility Folders
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions
- `/src/utils/` - Helper functions (System Prompts are here)
- `/src/integrations/` - Third-party integrations (e.g., Supabase)

## Component Documentation

For detailed documentation on our UI components and component architecture, see:
- [Component Architecture](./src/components/README.md)
- [UI Component System](./src/components/ui/README.md)

## Feature-Specific Components

- **Authentication**: Authentication components in `/src/components/auth/`
- **Chat Interface**: Chat components in `/src/components/chat/`
- **Dashboard**: Dashboard components in `/src/components/dashboard/`
- **Content Creation**: Content creation components in `/src/components/chat/creation/`
- **Pricing Plans**: Pricing components in `/src/components/pricing/`

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (authentication and database)

## Database Schema

The application uses Supabase for authentication and data storage. Key tables include:

- `profiles` - User profile information including subscription plans
- `chat_threads` - Chat conversation threads
- `chat_messages` - Individual messages within threads
- `content_setups` - Saved content configurations
- `content_drafts` - User's content drafts
- `content_analyses` - Content analysis results

## Development Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Deployment

1. Open [Lovable](https://lovable.dev/projects/31cf770c-4532-4df9-8320-79f91681c2d5)
2. Click on Share -> Publish

## Custom Domain Setup

1. Navigate to Project > Settings > Domains
2. Click Connect Domain
3. Follow the instructions in [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# inspire.me System Prompt and UI Improvements

## 🚀 Implemented Improvements

### 1. Enhanced System Prompts
- **Better Structure**: Added clear Markdown formatting with headings, bullet points, and formatting guides
- **Reduced Redundancy**: Eliminated repetitive greetings and unnecessary acknowledgments
- **Clear Communication Guidelines**: Added explicit directives for focused responses and better structured outputs
- **Improved Organization**: Better structured all system prompt sections with consistent formatting

### 2. Enhanced Message Rendering
- **Custom AssistantMessageContent Component**: Created a dedicated component for properly rendering AI responses
- **Markdown Support**: Added support for:
  - **Headings**: Bold section titles are properly rendered as headings
  - **Lists**: Bullet points are rendered as proper HTML lists
  - **Code Blocks**: Triple backtick code blocks render with appropriate styling
  - **Bold Text**: Bold formatting with `**text**` is properly rendered
  - **Emoji Highlights**: Key emojis (✅, 💡, 📊) are rendered with proper styling

### 3. Analysis Improvements
- **Improved Analysis Parser**: Enhanced the parseAnalysisResponse function to better handle Markdown formatting
- **Better Section Detection**: Added support for different heading formats and nested content

## 🧠 Technical Approach

### System Prompts
Modified the system prompts in `src/utils/systemPrompts.ts` to:
- Follow a consistent structure with clear section headings
- Use formatting to improve readability
- Provide explicit instruction about communication style
- Eliminate redundant greeting patterns

### Message Rendering Components
1. Created `AssistantMessageContent.tsx` component to properly render formatted AI messages
2. Added CSS modules for styling with `AssistantMessageContent.module.css`
3. Updated `ChatInterface.tsx` to use the new component for rendering AI messages

### Analysis Parser
Enhanced the `parseAnalysisResponse` function in `ChatContext.tsx` to:
- Better detect section headings in different formats
- Handle bullet points with or without formatting
- Process nested content appropriately

## 🎯 Results
The improvements create a more effective AI assistant that:
- Provides more structured, scannable responses
- Eliminates redundant greetings and fluff
- Uses visual organization to improve understanding
- Delivers more consistent, professional communication
