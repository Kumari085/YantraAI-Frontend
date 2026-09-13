# AegisAI Sovereign Workbench

AegisAI Sovereign Workbench is a Vite + React frontend for an air-gapped AI operations workbench. It provides authenticated workspace conversations, agent execution visibility, document and knowledge workflows, model and tool administration, sandbox access, audit views, and administrator controls.

The frontend can run in two modes:

- **Backend mode:** REST requests go to the configured API and agent events arrive over WebSocket.
- **Simulator mode:** When the backend is unavailable, the built-in simulator provides demo authentication, agent events, telemetry, network-audit events, and artifact responses for local development.

The simulator is enabled by default so a new contributor can run and inspect the UI without a backend.

## Contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Demo accounts](#demo-accounts)
- [Application workflow](#application-workflow)
- [Project structure](#project-structure)
- [Routes](#routes)
- [State and data flow](#state-and-data-flow)
- [Service boundaries](#service-boundaries)
- [WebSocket protocol](#websocket-protocol)
- [Common development tasks](#common-development-tasks)
- [Adding a feature](#adding-a-feature)
- [Troubleshooting](#troubleshooting)
- [Security and production notes](#security-and-production-notes)

## Requirements

- Node.js 20 or newer is recommended.
- npm 10 or newer is recommended.
- A modern browser with WebSocket and `localStorage` support.
- The backend is optional for simulator mode. Backend mode expects an HTTP API and WebSocket server reachable from the browser.

## Getting started

```bash
npm install
npm run dev
```

Vite prints the local development URL, normally `http://localhost:5173`. Open `/login` to sign in. The root route redirects to the workspace after authentication.

Useful commands:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run Oxlint
```

A normal verification pass after a change is:

```bash
npm run lint
npm run build
```

## Environment configuration

Copy the example file before changing local settings:

```powershell
Copy-Item .env.example .env
```

Vite exposes only variables prefixed with `VITE_` to browser code. Restart the dev server after editing `.env`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Axios REST base URL. |
| `VITE_SANDBOX_API_BASE_URL` | `http://localhost:8001` | Sandbox service base URL. |
| `VITE_WS_URL` | `ws://localhost:8000/ws` | Agent event WebSocket URL. |
| `VITE_ENABLE_SIMULATOR_FALLBACK` | `true` | Uses local demo behavior when backend calls or WebSocket delivery are unavailable. Set to `false` to require the backend. |
| `VITE_DEFAULT_RUN_MODE` | `agent` | Initial run mode: `normal`, `agent`, or `tool`. |
| `VITE_DEFAULT_MODEL_MODE` | `auto` | Initial model selection: `auto` or `manual`. |
| `VITE_APP_ORGANIZATION` | `Sovereign Air-Gapped Facility` | Organization label displayed by the UI. |

Do not commit `.env`. It is ignored by Git; `.env.example` is the shareable configuration reference.

## Demo accounts

These accounts are implemented in `src/services/auth.api.js` and are used only when simulator fallback is enabled:

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@aegis.local` | `password123` |
| Operator | `operator@aegis.local` | `password123` |

In simulator mode, any non-empty email and password can also create a local user session. An email containing `admin` receives the administrator role. This behavior must not be treated as production authentication.

## Application workflow

1. `src/main.jsx` mounts React under `StrictMode` and imports the global stylesheet.
2. `src/App.jsx` creates the browser router and provider tree.
3. `AuthProvider` restores the token and profile from `localStorage`, then verifies the session through `/auth/me` when possible.
4. `WebSocketProvider` registers connection status and global telemetry listeners, configures the simulator bridge when enabled, and starts the WebSocket connection.
5. `WorkspaceProvider` restores the last conversation, subscribes to session events, and owns the active turn state.
6. `ProtectedRoute` blocks unauthenticated pages and checks administrator-only routes.
7. `AppLayout` provides the shared shell, including the header, sidebar, search, telemetry, and nested page outlet.
8. A workspace prompt is sent as a `user_message` envelope. Incoming heartbeat, routing, plan, tool, citation, artifact, content, and final events progressively update the UI.
9. The final event is converted into an assistant message and stored in the current conversation state.

## Project structure

```text
src/
  App.jsx                         Router and provider composition
  main.jsx                        Browser entry point
  index.css, App.css              Global and application styles
  components/
    agent/                        Plans, tools, model routes, sandbox output
    artifacts/                    Artifact cards and approval modal
    auth/                         Protected route behavior
    citations/                    Citation rendering
    common/                       Reusable loading, modal, and status UI
    layout/                       App shell, navigation, search, telemetry
    ocr/, vision/                 Specialized analysis result components
    workspace/                    Chat input, messages, attachments, notices
  context/
    AuthContext.jsx                Session, role, and department access
    WebSocketContext.jsx           Connection, telemetry, and network audit state
    WorkspaceContext.jsx           Conversations and agent execution state
  pages/                          Route-level screens
  services/
    api.js                         Shared Axios client and auth interceptor
    auth.api.js                    Authentication and demo fallback
    config.js                      Environment-backed configuration
    conversation.api.js            Conversation REST operations
    knowledge.api.js               Knowledge base operations
    models.api.js                  Model operations
    notices.storage.js             Local notice persistence
    projects.api.js                Project operations
    sandbox.api.js                 Sandbox requests
    settings.api.js                Settings operations
    tools.api.js                   Tool operations
    upload.api.js                  File uploads
    websocket.js                   WebSocket transport and envelopes
    mockData.js                    Local demo data
    mockSimulator.js               Offline agent event simulator
```

Pages are intentionally thin route-level compositions. Shared behavior belongs in a context, service, or reusable component rather than being duplicated across pages.

## Routes

### Public

- `/login` - Sign-in screen.

### Authenticated

- `/` and `/workspace` - Main conversation workspace.
- `/documents` - Document and upload workflows.
- `/knowledge-base` - Knowledge base management.
- `/models` - Model catalog and selection.
- `/tools` - Tool catalog and configuration.
- `/sandbox` - Isolated execution workspace.
- `/tasks` - Task tracking.
- `/audit-logs` - Audit history.
- `/security` - Security and air-gap status.
- `/settings` - User and application settings.
- `/notices` - User notices.

### Administrator only

- `/admin/dashboard`
- `/admin/users`
- `/admin/departments`
- `/admin/notices`
- `/admin/system-health`

Route declarations live in `src/App.jsx`. Administrator routes use `ProtectedRoute requiredRole="admin"`; `AuthContext` treats an administrator as having access to all roles.

## State and data flow

### Authentication

`AuthContext` exposes `token`, `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `hasRole`, `hasAnyRole`, and `canAccessDepartment`. The browser stores:

- `aegis_session_token`
- `aegis_user_profile`

Clear both keys when testing a fresh login. Do not put secrets or real credentials in source-controlled files.

### Workspace execution

`WorkspaceContext` owns the current session and exposes conversation state, run/model settings, attachments, generation status, plans, tools, citations, artifacts, and turn statistics. It sends prompts through `wsService.sendUserMessage()` and interprets server events through the subscription registered for the active session.

When adding a new agent event:

1. Add or confirm the envelope shape in the backend contract.
2. Handle the event in the `WorkspaceContext` session switch.
3. Store only the state needed by the UI.
4. Render that state in a focused component under `src/components/`.
5. Add simulator coverage if the feature should be demonstrable offline.

### Realtime status

`WebSocketContext` owns connection status, telemetry, and network-audit state. It exposes `isConnected`, `isConnecting`, `isOffline`, `reconnect`, and the raw service through `useWebSocket()`.

## Service boundaries

Use the existing service layer for network access:

- `api.js` creates the Axios client, adds the bearer token, and normalizes errors.
- Feature services call `apiClient` and should keep HTTP details out of page components.
- `websocket.js` owns connection lifecycle, retries, subscriptions, message queuing, and envelope formatting.
- `mockSimulator.js` mirrors the WebSocket event contract for offline work.
- `config.js` is the only place that should read the environment-backed runtime configuration.

REST requests use JSON and receive `Authorization: Bearer <token>` when a local session token exists. The client also sends `X-Client-Origin: AegisAI-Sovereign-Workbench` and `X-Airgap-Enforced: true` headers.

## WebSocket protocol

Outgoing envelopes include `type`, `session_id`, `seq`, `timestamp`, and `payload`. Important outgoing message types are:

- `user_message` - Starts a turn with prompt, mode, model, tools, and attachments.
- `session_control` - Cancels, resumes, regenerates, or branches a turn.
- `approval_action` - Approves or rejects an artifact deliverable.

The workspace currently consumes these incoming event types:

- `heartbeat`
- `model_route`
- `plan`
- `plan_update`
- `tool_step`
- `tool_step_update`
- `citation`
- `artifact`
- `message_chunk`
- `final`

Global events consumed by `WebSocketContext` are `telemetry` and `network_audit`.

The service reconnects with a bounded backoff and falls back to the simulator when enabled. The backend should preserve session IDs and event ordering so a workspace subscription receives only the events for its active conversation.

## Common development tasks

### Add a page

1. Create a page component in `src/pages/`.
2. Add its import and route in `src/App.jsx`.
3. Add navigation in `src/components/layout/Sidebar.jsx` when appropriate.
4. Wrap it in the existing layout unless it intentionally needs a different shell.
5. Run lint and build.

### Add an API integration

1. Add a focused service in `src/services/` or extend the nearest existing service.
2. Use `apiClient`; do not create a second Axios instance without a strong reason.
3. Read URLs and feature flags from `CONFIG`.
4. Keep loading and error handling visible in the owning page or context.
5. Add a simulator or mock response when local development should work without the backend.

### Add a reusable UI element

Place cross-page elements in `src/components/common/` or the nearest domain folder. Follow the existing Tailwind/CSS conventions and use `lucide-react` for interface icons already represented in the project.

### Test a clean session

In the browser console:

```js
localStorage.removeItem('aegis_session_token');
localStorage.removeItem('aegis_user_profile');
localStorage.removeItem('aegis_last_session');
location.reload();
```

## Troubleshooting

### The screen stays on login

Check the browser console and confirm that the credentials are correct. With simulator fallback enabled, use one of the demo accounts. Clear the three `aegis_*` local-storage keys when an old profile is interfering.

### The backend is unavailable

This is expected during simulator development. Confirm `VITE_ENABLE_SIMULATOR_FALLBACK=true`, restart Vite, and inspect the WebSocket status indicator. The simulator handles login, chat turns, telemetry, and network-audit updates.

### API calls use the wrong host

Vite reads environment values only at startup. Update `.env`, stop the dev server, and run `npm run dev` again. Confirm the API base includes the `/api` path expected by the backend.

### A WebSocket keeps reconnecting

Verify `VITE_WS_URL`, the backend WebSocket path, browser mixed-content rules, and the session token. In production, an HTTPS page normally requires a `wss://` endpoint.

### Build or lint fails after a change

Run the command by itself to isolate the problem, then inspect imports and JSX syntax in the changed file:

```bash
npm run lint
npm run build
```

Do not commit `dist/` or dependency directories; both are ignored by `.gitignore`.

## Security and production notes

- Simulator authentication is for development only. Production authentication must be enforced by the backend.
- Browser `localStorage` is convenient for this demo but is exposed to JavaScript. Review the token strategy before production deployment.
- Never commit `.env`, credentials, tokens, uploaded documents, generated artifacts, or private logs.
- Keep the backend responsible for authorization, department access, artifact approvals, sandbox isolation, and audit integrity. Frontend role checks improve UX but are not a security boundary.
- Use HTTPS and `wss://` in deployed environments, and configure the backend CORS and WebSocket origin policy explicitly.
- Validate upload size, file type, and content on the backend even when the frontend provides validation.
- Review the default simulator and mock data before showing the application to real users; it intentionally contains demo identities and synthetic operational telemetry.
