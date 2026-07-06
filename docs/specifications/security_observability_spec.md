# VoiceOS Security Hardening & Observability Framework

This document details the security measures and observability framework implemented in the VoiceOS platform. It ensures the system is resilient against threats, protects sensitive data, and provides comprehensive visibility into system performance and health.

## 1. Security Hardening

### 1.1 Threat Model (STRIDE Analysis)
*   **Spoofing**: Mitigated by strong authentication (JWTs, NextAuth.js) and HMAC verification for all inter-module and external webhook communications.
*   **Tampering**: Prevented by using HTTPS/TLS for all data in transit and immutable audit logs (`audit_logs` table) for all critical actions.
*   **Repudiation**: Addressed by comprehensive audit logging, ensuring every action is tied to an authenticated actor or system process.
*   **Information Disclosure**: Mitigated by Row-Level Security (RLS) in PostgreSQL, `pgcrypto` for PII encryption, and strict access controls on the Web Dashboard.
*   **Denial of Service (DoS)**: Prevented by Nginx rate limiting, circuit breakers on external API calls, and resource quotas in Docker Compose.
*   **Elevation of Privilege**: Addressed by principle of least privilege for database users, secure API key management, and regular security audits.

### 1.2 Data Protection
*   **PII Encryption**: Sensitive contact information (e.g., phone numbers, emails) is encrypted at rest using PostgreSQL's `pgcrypto` extension.
*   **Row-Level Security (RLS)**: Enforced in PostgreSQL to ensure multi-tenant isolation, preventing users from accessing data outside their assigned industry or organization.
*   **API Key Management**: API keys are stored securely (e.g., using Docker secrets or a dedicated secrets manager) and are subject to a mandatory 90-day rotation policy.

### 1.3 Network Security
*   **Nginx Reverse Proxy**: Acts as the single entry point, handling SSL termination and enforcing rate limiting rules to protect backend services.
*   **Internal Network Isolation**: Docker Compose networks are configured to restrict communication between services (e.g., the database is only accessible by n8n and the dashboard backend).

## 2. Observability Framework

### 2.1 Metrics Collection (Prometheus)
*   Prometheus scrapes metrics from all VoiceOS components, including n8n, PostgreSQL, Redis, Qdrant, and custom FastAPI wrappers.
*   Key metrics include request latency, error rates, resource utilization (CPU/Memory), and custom business metrics (e.g., active calls).

### 2.2 Visualization (Grafana Dashboards)
Grafana provides real-time visibility into system health and performance through dedicated dashboard panels:
*   **Call Volume**: Tracks the number of inbound and outbound calls per hour and per day.
*   **Active Calls (Gauge)**: Displays the current number of ongoing calls.
*   **AI Confidence Distribution**: Visualizes the confidence scores of the AI Conversation Engine (M03) to identify areas needing improvement.
*   **Module Error Rates**: Tracks the failure rates of individual n8n modules to pinpoint bottlenecks or bugs.
*   **Handoff Rate %**: Monitors the percentage of calls escalated to human operators (M12).
*   **KB Hit Rate %**: Measures the effectiveness of the Knowledge Base (M06) in answering user queries.
*   **DLQ Depth**: Monitors the size of the Dead Letter Queue (`dlq_events`). An alert is triggered if the depth exceeds 10, indicating a systemic issue.

### 2.3 Logging & Tracing
*   **Centralized Logging**: All services output logs in a structured JSON format, which are aggregated and searchable (e.g., using ELK stack or similar).
*   **Audit Logs**: Critical business events and security-related actions are permanently recorded in the PostgreSQL `audit_logs` table.
*   **Distributed Tracing**: (Future enhancement) Implement OpenTelemetry to trace requests across the entire microservices architecture.

## 3. Incident Response

*   **Alerting**: Prometheus Alertmanager is configured to send notifications (via Slack, Email, or PagerDuty) for critical events, such as high error rates, DLQ buildup, or resource exhaustion.
*   **Runbooks**: Documented procedures for responding to common incidents, such as database failovers, API rate limit breaches, or security alerts.
