# VoiceOS PostgreSQL Schema Blueprint

This document outlines the proposed PostgreSQL schema for the VoiceOS project, designed to support persistent data storage for CRM, Memory, Analytics, and Configuration modules, as identified in the HANDOFF_P3.md..docx. The schema aims for modularity, scalability, and adherence to best practices for relational database design.

## Core Principles

*   **Normalization**: Minimize data redundancy and improve data integrity.
*   **Modularity**: Design tables to align with VoiceOS modules for clear separation of concerns.
*   **Scalability**: Consider future growth and performance requirements.
*   **Auditability**: Include timestamps for creation and updates, and user tracking where applicable.

## Table Definitions

### 1. `users` Table

Stores user information, central to CRM and authentication.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id`        | `SERIAL`  | `PRIMARY KEY` | Unique identifier for the user. |
| `username`  | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | User's chosen username. |
| `email`     | `VARCHAR(100)`| `UNIQUE`, `NOT NULL` | User's email address. |
| `password_hash` | `VARCHAR(255)`| `NOT NULL` | Hashed password for security. |
| `created_at`| `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of user creation. |
| `updated_at`| `TIMESTAMP` | `DEFAULT NOW()` | Last update timestamp. |

### 2. `crm_contacts` Table

Stores contact information for the CRM module.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id`        | `SERIAL`  | `PRIMARY KEY` | Unique identifier for the contact. |
| `user_id`   | `INT`     | `FOREIGN KEY (users.id)` | The user who owns this contact. |
| `first_name`| `VARCHAR(50)` | `NOT NULL` | Contact's first name. |
| `last_name` | `VARCHAR(50)` | `NOT NULL` | Contact's last name. |
| `email`     | `VARCHAR(100)`| `UNIQUE`    | Contact's email address. |
| `phone_number`| `VARCHAR(20)` | `UNIQUE`    | Contact's phone number. |
| `company`   | `VARCHAR(100)`|             | Company associated with the contact. |
| `status`    | `VARCHAR(50)` | `DEFAULT 'lead'` | Current status (e.g., 'lead', 'customer'). |
| `created_at`| `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of contact creation. |
| `updated_at`| `TIMESTAMP` | `DEFAULT NOW()` | Last update timestamp. |

### 3. `memory_events` Table

Stores conversational memory events, linked to users and contacts.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id`        | `SERIAL`  | `PRIMARY KEY` | Unique identifier for the memory event. |
| `user_id`   | `INT`     | `FOREIGN KEY (users.id)` | The user associated with this event. |
| `contact_id`| `INT`     | `FOREIGN KEY (crm_contacts.id)` | The contact associated with this event. |
| `event_type`| `VARCHAR(50)` | `NOT NULL` | Type of event (e.g., 'message', 'action', 'decision'). |
| `content`   | `TEXT`    | `NOT NULL` | JSON or text content of the memory event. |
| `timestamp` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of the event. |
| `embedding_id`| `VARCHAR(255)`| `UNIQUE`    | Reference to Qdrant embedding for this event. |

### 4. `analytics_logs` Table

Stores logs for analytics and performance monitoring.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id`        | `SERIAL`  | `PRIMARY KEY` | Unique identifier for the log entry. |
| `module`    | `VARCHAR(50)` | `NOT NULL` | The VoiceOS module generating the log. |
| `level`     | `VARCHAR(20)` | `NOT NULL` | Log level (e.g., 'INFO', 'WARN', 'ERROR'). |
| `message`   | `TEXT`    | `NOT NULL` | Log message content. |
| `details`   | `JSONB`   |             | Structured JSON details for the log. |
| `timestamp` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of the log entry. |

### 5. `configuration_settings` Table

Stores system-wide or user-specific configuration settings.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id`        | `SERIAL`  | `PRIMARY KEY` | Unique identifier for the setting. |
| `user_id`   | `INT`     | `FOREIGN KEY (users.id)` | Optional: User-specific setting. |
| `key`       | `VARCHAR(100)`| `NOT NULL` | Configuration key. |
| `value`     | `TEXT`    |             | Configuration value. |
| `type`      | `VARCHAR(50)` | `NOT NULL` | Data type of the value (e.g., 'string', 'json', 'boolean'). |
| `created_at`| `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of creation. |
| `updated_at`| `TIMESTAMP` | `DEFAULT NOW()` | Last update timestamp. |

### 6. `audit_logs` Table

Stores audit trails for critical actions, as per AIS Fixed Output Contract.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id`        | `SERIAL`  | `PRIMARY KEY` | Unique identifier for the audit log. |
| `user_id`   | `INT`     | `FOREIGN KEY (users.id)` | The user who performed the action. |
| `action`    | `VARCHAR(100)`| `NOT NULL` | Description of the action performed. |
| `entity_type`| `VARCHAR(50)` |             | Type of entity affected (e.g., 'contact', 'workflow'). |
| `entity_id` | `INT`     |             | ID of the entity affected. |
| `details`   | `JSONB`   |             | Structured JSON details of the audit event. |
| `timestamp` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of the action. |

## Relationships

*   `crm_contacts.user_id` references `users.id` (One-to-Many: One user can have many contacts).
*   `memory_events.user_id` references `users.id` (One-to-Many: One user can have many memory events).
*   `memory_events.contact_id` references `crm_contacts.id` (One-to-Many: One contact can have many memory events).
*   `configuration_settings.user_id` references `users.id` (One-to-Many: One user can have many custom settings).
*   `audit_logs.user_id` references `users.id` (One-to-Many: One user can have many audit logs).

## Future Considerations

*   **Indexing**: Add appropriate indexes to frequently queried columns (e.g., `email`, `phone_number`, `timestamp`) for performance optimization.
*   **Partitioning**: For very large tables (e.g., `memory_events`, `analytics_logs`), consider partitioning by time or `user_id`.
*   **Security**: Implement Row-Level Security (RLS) for multi-tenant environments to ensure users only access their own data.
*   **Data Retention Policies**: Define and implement policies for archiving or deleting old data, especially for logs and memory events.
