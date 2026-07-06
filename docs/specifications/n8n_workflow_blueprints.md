# VoiceOS n8n Workflow Blueprints: 15-Module Implementation

This document provides the detailed specifications and structural blueprints for all 15 n8n workflows in the VoiceOS platform, as extracted and synthesized from the Kimi conversation. Each workflow is designed to follow the **AIS Fixed Output Contract** for production-grade reliability.

## AIS Fixed Output Contract (Universal Pattern)

Every workflow follows this standardized structure to ensure observability, error handling, and performance tracking:

1.  **Trigger**: Webhook, Schedule, or HTTP Request.
2.  **Validation**: Check input against the `VoiceOSInterModuleMessage` schema.
3.  **Core Logic**: The primary business process for the module.
4.  **Audit Log**: Write success/failure to the PostgreSQL `audit_logs` table.
5.  **Error Handler**: A global error trigger that catches any node failure.
6.  **DLQ (Dead Letter Queue)**: Write failed events to the PostgreSQL `dlq_events` table.
7.  **Alerting**: Send a notification (Slack/Email) for critical failures.

---

## 15-Module Workflow Specifications

### M01: Call Gateway
*   **Trigger**: LiveKit Webhook (Call Initiated/Ended).
*   **Core Logic**: Route calls based on caller ID, business hours (from M15), and availability.
*   **Downstream**: Triggers M02 for speech recognition.
*   **Audit**: Log call ID, caller number, and initial routing decision.

### M02: Speech Recognition
*   **Trigger**: HTTP Request from M01 (Audio Stream/Blob).
*   **Core Logic**: Call the `faster-whisper` API for transcription. Clean and normalize the transcript.
*   **Downstream**: Sends transcript to M03.
*   **Audit**: Log transcription confidence and processing time.

### M03: AI Conversation Engine
*   **Trigger**: HTTP Request from M02 (Transcript).
*   **Core Logic**: Call Ollama (Llama 3.1) with the industry-specific system prompt (from M15). Perform intent classification and tool routing.
*   **Downstream**: May call M04 (Memory), M05 (CRM), M06 (Knowledge Base), or M07 (Scheduler).
*   **Audit**: Log generated response, detected intent, and confidence score.

### M04: Memory System
*   **Trigger**: Internal call from M03.
*   **Core Logic**: Retrieve short-term context from Redis and long-term history from PostgreSQL `conversations`.
*   **Downstream**: Returns context to M03.
*   **Audit**: Log memory retrieval success and context window size.

### M05: CRM
*   **Trigger**: Internal call from M03 or M08.
*   **Core Logic**: Perform CRUD operations on PostgreSQL `contacts` and `crm_records`. Handle duplicate merging.
*   **Downstream**: Returns contact details to the caller.
*   **Audit**: Log all database writes with idempotency keys.

### M06: Knowledge Base
*   **Trigger**: Internal call from M03.
*   **Core Logic**: Perform vector search on Qdrant `knowledge_base`. Use RAG to augment the LLM prompt.
*   **Downstream**: Returns factual context to M03.
*   **Audit**: Log search relevance scores and KB hit/miss status.

### M07: Appointment Scheduler
*   **Trigger**: Internal call from M03.
*   **Core Logic**: Check availability in PostgreSQL `appointments`. Manage bookings using the Saga pattern (check → hold → confirm).
*   **Downstream**: Triggers M08/M09 for confirmations.
*   **Audit**: Log all booking attempts, successes, and conflicts.

### M08: Email Automation
*   **Trigger**: Event-based (e.g., Booking Confirmed).
*   **Core Logic**: Render HTML templates and send via SMTP.
*   **Downstream**: None.
*   **Audit**: Log email delivery status and recipient.

### M09: Messaging Automation
*   **Trigger**: Event-based.
*   **Core Logic**: Route messages through WhatsApp, Telegram, or SMS based on user preference and channel availability.
*   **Downstream**: None.
*   **Audit**: Log message delivery status and channel used.

### M10: Research Agent
*   **Trigger**: Internal call from M06 (on KB miss).
*   **Core Logic**: Perform web search (SearXNG) and summarize findings using Ollama.
*   **Downstream**: Updates M06 after Human-in-the-Loop (HITL) approval.
*   **Audit**: Log search queries and summary quality.

### M11: Analytics
*   **Trigger**: Scheduled (Hourly/Daily).
*   **Core Logic**: Aggregate data from PostgreSQL `analytics_events` and `audit_logs`. Push metrics to Prometheus/Grafana.
*   **Downstream**: None.
*   **Audit**: Log aggregation success and report generation.

### M12: Human Handoff
*   **Trigger**: Confidence < 0.65 or explicit request.
*   **Core Logic**: Package conversation context and notify human operators via the Web Dashboard and Mobile App.
*   **Downstream**: Live call transfer.
*   **Audit**: Log handoff reason and operator response time.

### M13: Self-Improvement
*   **Trigger**: Scheduled (Nightly).
*   **Core Logic**: Analyze failures in `dlq_events` and low-confidence interactions. Generate recommendations for KB updates or prompt refinements.
*   **Downstream**: Updates M15 after approval.
*   **Audit**: Log generated improvement reports and approved changes.

### M14: Security
*   **Trigger**: Cross-cutting for all incoming requests.
*   **Core Logic**: Validate JWTs, enforce rate limits, and audit all sensitive operations.
*   **Downstream**: Blocks unauthorized requests.
*   **Audit**: Log all security violations and access attempts.

### M15: Configuration Layer
*   **Trigger**: System Startup or Industry Switch.
*   **Core Logic**: Load industry-specific settings (prompts, KB paths, workflow params) from PostgreSQL `config`.
*   **Downstream**: Provides configuration to all other modules.
*   **Audit**: Log all configuration changes and reloads.
