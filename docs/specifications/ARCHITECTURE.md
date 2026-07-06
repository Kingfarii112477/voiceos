# VoiceOS: Master Architecture Document

## 1. Executive Summary
VoiceOS is a production-ready, open-source Voice AI Agent platform. It orchestrates 15 modular agents through n8n, deployable via Docker Compose at $0 software cost. The system supports 10+ industry verticals through configuration-only switching.

## 2. Business & Process Analysis
### 2.1 Current State: Manual Business Communication
*   Manual call handling leads to missed leads and high labor costs.
*   Lack of 24/7 availability and unified memory across channels.
### 2.2 Future State: VoiceOS Automation
`Inbound Call → STT → AI Engine → Memory/CRM/KB → TTS → Response`
*   Includes integrated Analytics, Handoff, and Self-Improvement loops.

## 3. 15-Module Mapping
| Module | Business Process | Data Contract |
| :--- | :--- | :--- |
| M1 Call Gateway | Receive/route calls | LiveKit webhook |
| M2 Speech Recognition | Audio to text | Whisper API |
| M3 AI Conversation Engine | Generate responses | Ollama (Llama 3.1) |
| M4 Memory System | Recall interactions | Redis/PostgreSQL |
| M5 CRM | Track leads/deals | PostgreSQL |
| M6 Knowledge Base | Factual Q&A | Qdrant RAG |
| M7 Appointment Scheduler | Bookings | PostgreSQL |
| M8 Email Automation | Transactional emails | SMTP |
| M9 Messaging Automation | Omnichannel | WhatsApp/Telegram/SMS |
| M10 Research Agent | Web search | SearXNG |
| M11 Analytics | Track KPIs | Grafana/Prometheus |
| M12 Human Handoff | Escalation | Dashboard/Mobile |
| M13 Self-Improvement | Continuous learning | Reflection Agent |
| M14 Security | Auth/Audit | JWT/RLS |
| M15 Configuration Layer | Industry settings | PostgreSQL config |

## 4. Platform Strategy
*   **Workflow Engine**: n8n self-hosted CE.
*   **LLM Runtime**: Ollama (Llama 3.1 8B/70B).
*   **STT/TTS**: faster-whisper / Piper (FastAPI wrappers).
*   **Vector DB**: Qdrant.
*   **Structured DB**: PostgreSQL.
*   **Monitoring**: Grafana + Prometheus.
*   **Frontend**: Next.js 14 / Flutter.
