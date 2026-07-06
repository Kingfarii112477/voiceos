# VoiceOS Premium Web Dashboard: Technical Specification

This document defines the architecture, design system, and key components for the VoiceOS Premium Web Dashboard, built with Next.js 14, Tailwind CSS, and shadcn/ui. The dashboard follows a high-end, dark-glassmorphism aesthetic to provide a professional and trustworthy administrative experience.

## Technical Stack

*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS 3.4
*   **UI Components**: shadcn/ui (Radix UI primitives)
*   **Icons**: Lucide React
*   **State Management**: Zustand
*   **Charts**: Recharts
*   **Real-time**: Socket.io-client (for live call monitoring)
*   **Authentication**: NextAuth.js
*   **Data Fetching**: TanStack Query (React Query)

## Design System (Dark Glassmorphism)

### Color Palette (CSS Variables)
```css
:root {
  --background: #0A0A0F;
  --surface: #12121A;
  --surface-hover: #1A1A24;
  --accent: #6C63FF;
  --accent-hover: #5A52E0;
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0B0;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --radius: 12px;
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-bg: rgba(255, 255, 255, 0.03);
}
```

### UI Principles
*   **Glassmorphism**: Use semi-transparent backgrounds with backdrop blur for cards and modals.
*   **Soft Shadows**: Implement subtle, layered shadows to create depth without harsh edges.
*   **Rounded Corners**: Standardize on a `12px` (0.75rem) radius for all major UI elements.
*   **Typography**: Prioritize legibility with a clean sans-serif font (e.g., Inter or Geist).
*   **Micro-interactions**: Add smooth transitions for hover states, button presses, and page navigations.

## Key Pages & Features

### 1. Live Call Monitor (`/`)
*   **Real-time Call Cards**: Display active calls with caller info, duration, and a live "pulse" animation.
*   **Live Transcript Stream**: Show the conversation transcript updating in real-time.
*   **Confidence Meter**: An animated progress bar showing the AI's confidence in its current response.
*   **Quick Actions**: Buttons for manual handoff, call termination, or muting.

### 2. CRM Kanban (`/crm`)
*   **Lead Pipeline**: A drag-and-drop Kanban board for managing contacts through different stages (New Lead, Scheduled, Seen, Follow-up, Closed).
*   **Contact Detail Modals**: View full interaction history, memory summaries, and profile details.
*   **Search & Filters**: Quickly find contacts by name, phone, or status.

### 3. Appointment Calendar (`/appointments`)
*   **Full Calendar View**: Integrated calendar showing all scheduled appointments.
*   **Slot Management**: Interface for manually adding or rescheduling appointments.
*   **Sync Status**: Show the status of synchronization with external calendars (Google, Outlook).

### 4. Knowledge Base Manager (`/knowledge`)
*   **Document Ingestion**: Upload interface for seeding the KB with new documents.
*   **Vector Search Test**: A "playground" area for testing RAG performance with specific queries.
*   **Chunk Editor**: View and edit the text chunks stored in Qdrant.

### 5. Analytics Dashboard (`/analytics`)
*   **KPI Overview**: High-level metrics for call volume, conversion rate, and AI performance.
*   **Grafana Embeds**: Seamlessly integrate complex Grafana panels for technical monitoring.
*   **Export Reports**: Button for generating PDF or CSV reports.

### 6. Configuration & Personas (`/config`)
*   **Industry Selector**: Switch between the 10 pre-configured industry packs.
*   **Persona Editor**: Fine-tune voice selection, style instructions, and system prompts.
*   **Workflow Toggles**: Enable/disable specific modules or features.

## Component Architecture

### Reusable Components
*   `Layout`: Sidebar navigation and top header.
*   `GlassCard`: A standardized card component with glassmorphism styles.
*   `ConfidenceBadge`: A color-coded badge for displaying AI confidence levels.
*   `LivePulse`: A CSS animation component for indicating active calls.
*   `KanbanBoard`: A generic drag-and-drop board for CRM and task management.

### API Integration (`lib/api.ts`)
*   Centralized client for communicating with n8n webhooks and the PostgreSQL/Qdrant backend.
*   Implements HMAC verification for secure data exchange.
*   Handles token-based authentication for dashboard users.
