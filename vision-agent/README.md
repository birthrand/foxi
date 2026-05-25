# Foxi Vision Agent

Voice-only AI language teacher for Foxi. Uses [Vision Agents](https://visionagents.ai/) with **OpenAI Realtime** and **Stream Edge** transport.

## Environment

Reuses credentials from the repo root `.env`:

- `STREAM_API_KEY`
- `STREAM_API_SECRET`
- `OPENAI_API_KEY`

Optional local overrides in `vision-agent/.env`.

## Setup

```bash
cd vision-agent
uv sync
```

## Run (console — joins a new demo call)

```bash
uv run python -m foxi_teacher.main run
```

## Run (HTTP server — for Expo API proxy)

```bash
uv run python -m foxi_teacher.main serve --host 0.0.0.0 --port 8000
```

The Expo app proxies agent start/stop through `/api/agent/start` and `/api/agent/stop`. Set this in the **repo root** `.env` (server-side only, never `EXPO_PUBLIC_`):

```bash
VISION_AGENT_URL=http://127.0.0.1:8000
```

Start a session:

```http
POST /calls/{callId}/sessions
Content-Type: application/json

{ "call_type": "audio_room", "lessonCustom": { "...": "from Stream call custom" } }
```

Stop a session:

```http
DELETE /calls/{callId}/sessions/{sessionId}
```

Health:

```http
GET /health
GET /ready
```

## Behavior

- **Voice only** — OpenAI Realtime with `send_video=False`; no video processors.
- **English tutor** — always speaks English and teaches the selected language through English.
- **Lesson context** — reads `lessonTitle`, `lessonGoal`, `languageCode`, and optional `aiTeacherPrompt` from Stream call `custom` data when present.
