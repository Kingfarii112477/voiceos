# VoiceOS: Zero-Dollar Voice Agent OS

## Quick Start Guide

This guide provides a quick overview to get your VoiceOS instance up and running. VoiceOS is an open-source, self-hosted Voice AI Agent platform designed for scalability and flexibility.

### 1. Clone and Configure

First, clone the VoiceOS repository and navigate into the project directory. Copy the example environment file and configure it with your specific settings.

```bash
git clone <repo_url>
cd voiceos
cp .env.example .env
# Edit .env with your values (e.g., database credentials, API keys)
```

### 2. Start the Stack

Launch all VoiceOS services using Docker Compose. This will bring up the database, Redis, n8n, Ollama, and custom FastAPI services.

```bash
docker-compose up -d
```

### 3. Validate Installation

Run the validation script to ensure all services are running correctly and accessible.

```bash
./scripts/validate-stack.sh
```

### 4. Pull AI Models

Download the necessary AI models (e.g., Llama 3.1 for Ollama, Whisper for STT) using the provided script.

```bash
./scripts/pull-models.sh
```

### 5. Import n8n Workflows

Access your n8n UI (typically `http://localhost:5678`) and import the provided n8n workflow JSON files. These define the core logic for all 15 VoiceOS modules.

### 6. Configure Credentials in n8n

Within the n8n UI, configure credentials for external services such as PostgreSQL, Redis, Ollama, SMTP, WhatsApp, and Telegram.

### 7. Activate Workflows

Toggle each imported n8n workflow to "Active" in the n8n UI to enable the VoiceOS functionality.

### 8. Load Industry Configuration

Load an industry-specific configuration pack (e.g., for healthcare) to tailor VoiceOS to your business needs.

```bash
./scripts/load-config.sh config-packs/healthcare.yaml
```

### 9. Access Dashboard

Open your web browser and navigate to the VoiceOS dashboard (typically `http://localhost:3001`) to monitor and manage your Voice AI agents.

---

For detailed documentation, refer to the `docs/` directory.
