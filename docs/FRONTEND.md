# Frontend Architecture & Documentation

## Overview
The Research Agent frontend is a Next.js 14 (App Router) application. It acts as the primary user interface for discovering, analyzing, and organizing AI research literature. It communicates with the Python FastAPI backend to retrieve data and execute complex analysis workflows.

## Technology Stack
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand (Global state), TanStack Query (Server state caching)
- **Data Visualization**: Recharts (Trends), React Flow (Knowledge Graph)
- **Icons**: Lucide React

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (app)/          # Main application routes (requires sidebar)
│   │   │   ├── research/   # Research workspace (Search, Graph, Trends)
│   │   │   ├── library/    # User library and saved papers
│   │   │   ├── dashboard/  # Researcher dashboard
│   │   │   └── ...
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── claims/         # Claim/provenance display
│   │   ├── layout/         # Shell and sidebar
│   │   ├── paper/          # Paper list and details
│   │   └── ui/             # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts          # API client for backend communication
│   │   ├── types.ts        # Shared TypeScript interfaces (Contract)
│   │   └── format.ts       # Utility formatting functions
│   └── mocks/              # Mock data for local testing
```

## Key Workflows
1. **Research Discovery**: Users query literature via `/research`. The `ResearchWorkspace` component orchestrates a multi-tab interface displaying Search Results, Timeline, Knowledge Graph, Comparison Table, and Trends.
2. **Library Management**: Users can save papers to collections in the `/library` route, attaching tags and notes.
3. **Data Provenance**: All synthesis claims include citations linking directly to the source paper, highlighting the `ClaimView` component's role in verifying AI-generated outputs.

## Development Rules
- **Type Safety**: The API client must strictly adhere to the types defined in `lib/types.ts` (API_CONTRACT.md).
- **Mocks First**: Use `NEXT_PUBLIC_USE_MOCKS=true` to develop UI components rapidly before integrating with the real backend.
- **Provenance Requirement**: Never render a claim without its associated `kind` badge (e.g. `synthesis`, `extraction`) and citation links.

## Building and Testing
```bash
npm install
npm run dev       # Start local server
npm run typecheck # Verify TypeScript integrity
npm run lint      # Lint checks
npm run build     # Production build
```
