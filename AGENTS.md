# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

Two-service app (Angular 18 frontend + ASP.NET Core 8 backend) with no database. PDF processing is fully in-memory.

- **Backend** (`backend/`): .NET 8 Web API on `https://localhost:5000` / `http://localhost:50001`
- **Frontend** (`frontend/`): Angular 18 on `http://localhost:4200`

### Prerequisites

- **.NET SDK 8**: Installed via `dotnet-install.sh` to `~/.dotnet`. The PATH export is in `~/.bashrc`.
- **Node.js 22+**: Pre-installed via nvm.

### Running services

See `README.md` for standard commands. Quick reference:

```
# Backend
cd backend && dotnet run

# Frontend
cd frontend && npm start
```

### Gotchas

- **Self-signed HTTPS cert**: The backend uses a .NET dev certificate (`https://localhost:5000`). Chrome blocks XHR to self-signed certs by default. The Chrome flag `allow-insecure-localhost` is enabled in Local State. If browser-based end-to-end tests fail with `ERR_CERT_AUTHORITY_INVALID`, navigate to `https://localhost:5000` in Chrome first and accept the certificate, or re-enable the flag at `chrome://flags/#allow-insecure-localhost`.
- **Proxy config mismatch**: `frontend/proxy.conf.json` targets `https://localhost:63191` but the backend actually runs on port `5000`. The Angular service bypasses the proxy by using the full URL from `environment.ts` (`https://localhost:5000/api`), so this mismatch doesn't affect development.
- **No lint script**: The frontend has no `lint` npm script configured. Only `start`, `build`, and `test` are available.
- **No automated test runner configured**: `ng test` is defined but no test framework (Karma/Jest) dependencies are installed, so it will fail. Testing is via API calls (`curl`) or browser.
- **CORS**: The backend allows `http://localhost:4200` via `appsettings.json` `Cors:AllowedOrigins`.
- **API endpoint**: `POST /api/pdf/crop` accepts multipart form with `file` (PDF) and `platform` (`meesho`, `flipkart`, `amazon`). See `backend/ApiDocs.md` for full spec.
