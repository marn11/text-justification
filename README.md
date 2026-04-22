# justifier

`justifier` is a full-stack text justification project built around a NestJS API and a Next.js frontend. The backend exposes a token endpoint plus a protected `text/plain` justification endpoint, and the frontend wraps that flow in a calm, light-only UI designed to feel polished during a technical review.

## What it does

- Requests a reusable bearer token from `POST /api/token`
- Sends raw text to `POST /api/justify`
- Preserves paragraph breaks
- Returns text justified to 80 characters per line
- Enforces a rolling 24-hour quota of 80,000 words per token

## Frontend

The frontend lives in [`frontend`](./frontend) and is built with Next.js App Router.

- Light mode only
- Minimalist editorial UI
- OKLCH color system with strong contrast
- Sans serif typography and restrained spacing
- Three routes: overview, token flow, and justification workspace

### Screens

#### Home

![justifier home](frontend/docs/screenshots/home.png)

#### Token

![justifier token page](frontend/docs/screenshots/token.png)

#### Workspace

![justifier workspace](frontend/docs/screenshots/workspace.png)

### Frontend commands

```bash
cd frontend
npm install
npm run dev
```

Optional environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Frontend verification

```bash
cd frontend
npm run lint
npm run build
npm run test:e2e
npm run screenshots
```

The screenshot command writes the README assets to [`frontend/docs/screenshots`](./frontend/docs/screenshots).

## Backend

The backend lives in [`backend`](./backend) and is built with NestJS.

### API routes

#### `POST /api/token`

Request body:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "token": "uuid-token"
}
```

#### `POST /api/justify`

Headers:

```text
Authorization: Bearer <token>
Content-Type: text/plain
```

Body:

```text
Raw text to justify
```

Responses:

- `200` justified text
- `400` missing or empty text
- `401` missing or invalid token
- `402` daily quota exceeded

### Backend commands

```bash
cd backend
npm install
npm run start:dev
```

Swagger docs are exposed at `http://localhost:3001/api/docs`.

## Testing

Backend coverage includes unit and e2e tests.

```bash
cd backend
npm test
npm run test:e2e
```

Frontend coverage includes linting, production build validation, Playwright e2e checks, and screenshot generation.

## Notes

- Tokens and quotas are stored in memory, so they reset when the backend restarts.
- The quota window is fixed to 24 hours from first usage for a given token.
- The frontend tests mock API responses so UI verification stays fast and repeatable.
}``
#### Response
``{
    "token" : "uuid-token"
}``
### 📄 POST /justify
Jusifies the input text.
<img width="1333" height="755" alt="Capture d&#39;écran 2026-01-13 175522" src="https://github.com/user-attachments/assets/579f8666-a94d-4bb7-a2a0-4ba50e79069b" />
<img width="1331" height="756" alt="Capture d&#39;écran 2026-01-13 175608" src="https://github.com/user-attachments/assets/92c95b72-05d7-42a2-9032-4bcf3f564a62" />
#### Headers
``Authorization: Bearer <token>
Content-Type: text/plain``
#### Body
``Raw text to justify``
#### Responses
- ``200 OK`` → justified text
- ``401 Unauthorized`` → missing or invalid token
- ``402 Payment Required`` → daily quota exceeded
- ``400 Bad Request`` → empty body
## 🧪 Testing
This project includes:
- Unit tests (services, guards)
- End-to-End tests (happy path, quota exceeded, unauthorized)
Coverage is generated via:
`` npm run test:cov``
## Docker
### Build
``docker build -t text-justifier-api .``
### Run
``docker run -p 3000:3000 text-justifier-api``
### Additional info
I did a multi stage build, which helped make the final image much smaller than the build image.
<img width="989" height="155" alt="Capture d&#39;écran 2026-01-13 143001" src="https://github.com/user-attachments/assets/f51bca9c-a816-4285-b8fd-335b2d5a3cdf" />
## 📄 Documentation
I used Swagger since it integrates seamlessly with NestJS, and they have a dedicated part in their docs about it.
<img width="1905" height="941" alt="image" src="https://github.com/user-attachments/assets/6dca94b8-1099-48a7-aaa6-7a5245fada04" />

## ⚠️ Limitations
- In-memory storage (tokens & quotas reset on restart)
These limitations are intentional and aligned with the scope of the exercice.
## Useful links
I loved this video from Theo about rate-limiting, I'll link it as well as the source article:
- https://youtu.be/8QyygfIloMc
- https://smudge.ai/blog/ratelimit-algorithms
