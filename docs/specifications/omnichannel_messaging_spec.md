# VoiceOS Omnichannel Messaging Layer: Technical Specification

This document details the design and technical specifications for the Omnichannel Messaging Layer (M09) within the VoiceOS platform. This module is responsible for intelligently routing and delivering messages across various communication channels, ensuring effective and timely communication with contacts.

## Core Principles

*   **Contact Preference**: Prioritize the contact's preferred communication channel.
*   **Channel Availability**: Respect channel-specific constraints, such as business hours or quiet times.
*   **Fallback Mechanism**: Implement a robust fallback strategy to ensure message delivery even if the primary channel is unavailable.
*   **Modularity**: Designed as a distinct n8n module (M09) for flexible integration and management.

## Architecture (M09 n8n Workflow)

### Trigger
*   **Event-based**: Triggered by various events within the VoiceOS, such as appointment confirmations (from M07), CRM updates (from M05), or follow-up reminders.

### Core Logic
1.  **Message Context Retrieval**: Gather all necessary information for the message, including contact details (from M05), event type, and message content.
2.  **Channel Selection Algorithm**: Utilize a Python function (or equivalent n8n logic) to determine the optimal channel for message delivery based on predefined rules.
    ```python
    def select_channel(contact, event_type, time_of_day):
        # 1. Check preference
        preferred = contact.get('preferred_channel')
        if preferred and is_channel_available(preferred, time_of_day):
            return preferred
        
        # 2. Priority order
        for channel in ['whatsapp', 'email', 'sms']:
            if is_channel_available(channel, time_of_day):
                return channel
        
        # 3. Fallback
        return 'email'

    def is_channel_available(channel, time_of_day):
        if channel in ['whatsapp', 'sms'] and time_of_day.hour >= 21:
            return False  # No messages after 9 PM
        return True
    ```
3.  **Channel-Specific Node Execution**: Based on the selected channel, route the message to the appropriate n8n node (e.g., WhatsApp node, SMTP node for email, SMS node).
4.  **Template Selection**: Dynamically select the correct message template based on the event type and channel.
5.  **Message Delivery**: Send the message through the chosen channel.

### Downstream
*   None (message delivery is the final step for this module).

### Audit
*   Log message delivery status, chosen channel, and recipient to the PostgreSQL `audit_logs` table.

## Data Flow

```mermaid
graph TD
    A[Event Trigger (e.g., M07, M05)] --> B[M09: Message Context Retrieval]
    B --> C{Channel Selection Algorithm}
    C -- WhatsApp --> D[WhatsApp Node]
    C -- Email --> E[SMTP Node]
    C -- SMS --> F[SMS Node]
    D --> G[Message Delivered]
    E --> G
    F --> G
    G --> H[Audit Log (PG audit_logs)]
```

## Key Data Entities (PostgreSQL)

*   `contacts`: Stores contact preferences, including `preferred_channel`.
*   `audit_logs`: Records message delivery events.
*   `config`: May store channel-specific settings or business hours.

## Integration Points

*   **M03 (AI Conversation Engine)**: Can trigger messages based on conversational flow.
*   **M05 (CRM)**: Provides contact details and updates.
*   **M07 (Appointment Scheduler)**: Triggers appointment confirmations and reminders.
*   **M15 (Configuration Layer)**: Provides channel-specific configurations and business hours.

## Risks & Mitigations

*   **Channel API Reliability**: External messaging APIs (WhatsApp, SMS gateways) can experience outages. (Mitigation: Implement circuit breakers and exponential backoff for retries, and ensure robust fallback mechanisms).
*   **Message Delivery Guarantees**: Ensuring critical messages are delivered even if a channel fails. (Mitigation: Implement a DLQ for failed messages and alert human operators for manual intervention).
*   **Cost Management**: Different channels have different costs. Inefficient routing could lead to higher operational expenses. (Mitigation: Optimize the channel selection algorithm to balance cost and delivery effectiveness).
