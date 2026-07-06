# VoiceOS AgentForge Self-Improvement Loop: Technical Specification

This document outlines the design and technical specifications for the AgentForge Self-Improvement Loop (M13) within the VoiceOS platform. This module is crucial for the continuous learning and evolution of the AI agents, ensuring the system becomes more robust and effective over time.

## Core Principles

*   **Continuous Learning**: The system should constantly analyze its performance and identify areas for improvement.
*   **Human-in-the-Loop (HITL)**: Critical changes and recommendations are subject to human approval to maintain quality and prevent unintended consequences.
*   **Data-Driven Optimization**: Improvements are based on quantitative analysis of failures, low-confidence interactions, and user feedback.
*   **Modularity**: The loop is designed as a distinct n8n module (M13) that interacts with other VoiceOS components.

## Architecture (M13 n8n Workflow)

### Trigger
*   **Scheduled**: Nightly at 2 AM (or configurable interval).

### Core Logic
1.  **Failure Analysis (Query DLQ)**:
    *   Query the PostgreSQL `dlq_events` table to retrieve all failed interactions since the last run.
    *   Categorize failures by module, error type, and payload content.
2.  **Low-Confidence Interaction Analysis (Query Analytics)**:
    *   Query the PostgreSQL `analytics_events` table for interactions where AI confidence scores were below a predefined threshold (e.g., from M03).
    *   Analyze the context and LLM outputs for these interactions.
3.  **Reflection Agent (Ollama)**:
    *   Feed the categorized failures and low-confidence interactions to an Ollama-hosted LLM (e.g., Llama 3.1).
    *   **Prompt**: "Analyze the following failed/low-confidence interactions from the VoiceOS. Identify patterns, root causes, and suggest concrete improvements for the system. Focus on: 
        *   Knowledge Base gaps (suggest new entries).
        *   Prompt engineering refinements for M03.
        *   Workflow logic adjustments in n8n.
        *   Potential new tools or integrations.
        *   Clustering similar failure types."
4.  **Pattern Extractor & Gap Detector (Ollama Clustering)**:
    *   The LLM identifies recurring patterns in failures and suggests potential knowledge gaps.
    *   Cross-reference identified gaps with the existing Qdrant `knowledge_base` to confirm missing information.
5.  **Recommendation Writer (Ollama)**:
    *   Based on the analysis, the LLM generates actionable recommendations.
    *   **Output Format**: Structured JSON containing `type` (KB_update, prompt_refinement, workflow_change), `description`, `suggested_content` (for KB), `module_affected`, `priority`.
6.  **Human Approval Gate (Web Dashboard)**:
    *   The generated recommendations are pushed to the PostgreSQL `improvement_reports` table.
    *   A notification is sent to the Web Dashboard (Phase 7) and Mobile App (Phase 8) for human review and approval.
    *   The dashboard provides an interface for operators to review, edit, approve, or reject recommendations.
7.  **Knowledge Updater (Qdrant Ingest / Config Update)**:
    *   Upon human approval, the system automatically applies the changes:
        *   **KB Updates**: New knowledge chunks are ingested into Qdrant `knowledge_base` and potentially into the PostgreSQL `knowledge_chunks` table.
        *   **Prompt Refinements**: Updates are made to the `config` table (M15) for M03 system prompts.
        *   **Workflow Changes**: (Requires manual n8n workflow update for complex logic changes, but simple parameter adjustments can be automated via M15).

## Data Flow

```mermaid
graph TD
    A[Scheduled Trigger (M13)] --> B{Query dlq_events & analytics_events}
    B --> C[Ollama Reflection Agent]
    C --> D{Pattern Extractor & Gap Detector}
    D --> E[Ollama Recommendation Writer]
    E --> F[Store in improvement_reports (PG)]
    F --> G[Notify Web Dashboard & Mobile App]
    G --> H{Human Review & Approval}
    H -- Approved --> I[Knowledge Updater]
    I --> J[Update Qdrant knowledge_base]
    I --> K[Update PG config (M15)]
    I --> L[Manual n8n Workflow Update (if complex)]
```

## Key Data Entities (PostgreSQL)

*   `dlq_events`: Source of failed interactions.
*   `analytics_events`: Source of low-confidence interactions.
*   `improvement_reports`: Stores generated recommendations for human review.
*   `knowledge_chunks`: Target for approved KB updates.
*   `config`: Target for approved prompt and configuration changes.

## Integration Points

*   **M03 (AI Conversation Engine)**: Provides confidence scores and interaction logs.
*   **M06 (Knowledge Base)**: Receives updated knowledge chunks.
*   **M15 (Configuration Layer)**: Receives updated system prompts and workflow parameters.
*   **Web Dashboard (Phase 7)**: Interface for human approval.
*   **Mobile App (Phase 8)**: Notifications for pending approvals.

## Risks & Mitigations

*   **Hallucinations from LLM**: The reflection and recommendation agents might generate incorrect or irrelevant suggestions. (Mitigation: Mandatory human approval gate).
*   **Over-optimization**: The system might over-optimize for specific failure modes, leading to reduced generalization. (Mitigation: Monitor overall system performance and conduct A/B testing for major changes).
*   **Data Volume**: Processing large volumes of `dlq_events` and `analytics_events` could be resource-intensive. (Mitigation: Implement efficient database queries, batch processing, and potentially use a dedicated analytics engine).
