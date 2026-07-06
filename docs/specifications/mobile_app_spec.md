# VoiceOS Mobile Companion App: Technical Specification

This document defines the architecture, design system, and key features for the VoiceOS Mobile Companion App, built with Flutter. The app is designed to provide administrators with real-time monitoring and management capabilities on the go, maintaining visual and functional consistency with the Premium Web Dashboard.

## Technical Stack

*   **Framework**: Flutter 3.x
*   **State Management**: Riverpod (with `StateNotifier` and `FutureProvider`)
*   **Navigation**: GoRouter (declarative and named routing)
*   **Networking**: Dio (with interceptors for auth and logging)
*   **Local Storage**: Hive (for lightweight, fast NoSQL storage)
*   **Serialization**: Freezed (for immutable data classes and union types)
*   **Push Notifications**: Firebase Cloud Messaging (FCM)
*   **Security**: `local_auth` (for biometric authentication)

## Design System (Mobile Consistency)

### Visual Style
*   **Consistent Aesthetic**: Adheres to the dark-glassmorphism style of the web dashboard, using semi-transparent cards, backdrop blurs, and soft shadows.
*   **Color Palette**: Reuses the same CSS variables for `--background`, `--surface`, `--accent`, etc., translated into Flutter `Color` objects.
*   **Typography**: Uses the same sans-serif font family, with scaled sizes optimized for mobile viewports.
*   **Haptic Feedback**: Integrates subtle haptics for button presses and critical notifications to enhance the mobile experience.

## Key Features & Screens

### 1. Home Dashboard (`home_screen.dart`)
*   **Live Call Count**: A prominent, animated counter showing the number of active calls.
*   **Daily Stats Overview**: Quick-view cards for total calls, conversion rate, and missed calls.
*   **Recent Activity Feed**: A scrollable list of the latest system events and notifications.

### 2. Live Calls & Handoff (`live_calls_screen.dart`)
*   **Active Call List**: Real-time display of ongoing calls with caller ID and duration.
*   **Live Transcript Viewer**: View the conversation transcript as it happens.
*   **Handoff Control**: A dedicated button for operators to take over a call directly from their mobile device.

### 3. Mobile CRM (`crm_screen.dart`)
*   **Contact List**: Searchable and filterable list of all CRM contacts.
*   **Quick Contact View**: View contact details, interaction history, and memory summaries.
*   **Lead Status Update**: Quickly move contacts through the pipeline stages.

### 4. Notifications & Alerts (`notifications_screen.dart`)
*   **Push Notification History**: A central hub for all received alerts (e.g., low-confidence calls, emergency triggers).
*   **Actionable Alerts**: Notifications that allow users to take immediate action (e.g., "Tap to View Call").

### 5. Settings & Security (`settings_screen.dart`)
*   **API Configuration**: Interface for setting up the connection to the n8n orchestration layer.
*   **Biometric Toggle**: Enable/disable Fingerprint or FaceID for app access.
*   **Theme Switcher**: Option to toggle between the default dark glassmorphism and a standard light mode.

## Architecture: Clean Architecture (Feature-First)

The app follows a strict layered architecture to ensure testability and maintainability:

1.  **Presentation Layer**:
    *   **Screens**: The main UI pages.
    *   **Widgets**: Reusable UI components (e.g., `GlassCard`, `ConfidenceMeter`).
    *   **Providers**: Riverpod providers for managing UI state and business logic.
2.  **Domain Layer**:
    *   **Entities**: Simple, immutable data classes representing business objects (e.g., `Call`, `Contact`).
    *   **Use Cases**: Encapsulate specific business rules and orchestrate data flow.
3.  **Data Layer**:
    *   **Repositories**: Implementation of domain-layer repository interfaces.
    *   **Data Sources**: Handle raw data retrieval from APIs (Dio) or local storage (Hive).
    *   **DTOs (Data Transfer Objects)**: Represent the data structure received from external APIs.

## API Integration & Security

*   **Dio Interceptors**: Automatically add authentication tokens and log requests for debugging.
*   **HMAC Verification**: Ensure all data received from the backend is authentic and untampered.
*   **Biometric Lock**: Protect sensitive data with a biometric authentication gate upon app launch.
