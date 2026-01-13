# Text Justification API

This project implements a REST API that justifies text to a fixed width of 80 characters per line, with authentication and daily usage limits, as part of a backend technical assessment.

The API is built with NestJS (TypeScript), containerized with Docker, and tested with Jest.

# Features: 
- Text justification (80 characters per line)
- Paragraph handling (empty lines preserved)
- Token-based auth
- Daily quota limiting (80k words per token)
- Robust HTTP error handling 
- Unit and e2e tests
- Dockerized and deployed with Railway

# Technical Choices & Justifications:
## Backend Framework: NestJS (TypeScript)
- Enforces a clean, modular architecture
- Built-in support for guards, dependency injection, and testing
- I love this framework
- I dumped Fastify since I discovered NestJS
- I don't like unopiniated frameworks anymore
## Authentication: Token-Based Auth
- A /token endpoint generates a unique token per email
- Tokens are attached to subsequent requests via Authorization: Bearer <token>
- In this context (technical assessment), it's more than enough
### Why not JWT?
Because tokens are opaque, do not encode data, and no persistence was required. This keeps the system minimal and focused.
## Rate Limiting: Fixed Window Counter
- Limit: 80,000 words per token per 24h
- Window starts on first usage
- Stored in memory per token
### Why fixed window?
- Simple to reason about
- Easy to implement correctly
I read about other approaches (sliding window, token bucket) but I chose to go with fixed window to keep complexity low.
## Storage: In-Memory Maps
Used to store:
- Email -> Token
- Token -> Email
- Token -> Usage (word count + window start)
### ❌ Trade-off
- Data resets on restart
- Not suitable for horizontal scaling
### ✅ Why acceptable
- No persistance requirement was specified
## The Text Justification Algorithm
- No external libraries used (as required)
- Greedy line filling and space distribution (we process each line by itself, we don't care about the rest while the limit of 80 characters hasn't been hit)
- Last line left-aligned
- Paragraphs preserved (empty lines split content)
- Raw text/plain input (can be multi-paragraph)
## API Endpoints
### 🔑 POST /token
Generates (or returns) a token for a given email.
<img width="1327" height="718" alt="Capture d&#39;écran 2026-01-13 175510" src="https://github.com/user-attachments/assets/93fc9dd3-5345-4cae-a12b-4d6bd1c06089" />

#### Request
``POST /token
Content-Type: application/json
{
  "email": "user@example.com"
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

## ⚠️ Limitations
- In-memory storage (tokens & quotas reset on restart)
These limitations are intentional and aligned with the scope of the exercice.
