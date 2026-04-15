# eComCropper - E-commerce Label Cropper SaaS

Production-ready stateless SaaS-style application for cropping marketplace shipping labels from PDF files.

## Tech Stack

- **Frontend**: Angular 18 (standalone components)
- **Backend**: ASP.NET Core Web API (.NET 8)
- **PDF Processing**: iText7
- **Storage**: In-memory processing only (no DB)

## Project Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # shared navbar/footer
│   │   │   ├── pages/              # Home, Tool, About, Privacy, Contact
│   │   │   └── services/           # API integration service
│   │   ├── environments/           # env specific config
│   │   └── index.html              # SEO meta tags
│   └── angular.json
├── backend/
│   ├── Controllers/                # HTTP API endpoints
│   ├── Services/                   # PDF crop business logic
│   ├── Helpers/                    # crop rectangle helper rules
│   ├── Models/                     # request models
│   ├── ApiDocs.md                  # endpoint docs
│   └── Program.cs                  # app bootstrap and CORS
└── README.md
```

## Features

### Frontend
- Responsive SaaS-style UI
- Pages: Home, Tool, About, Privacy, Contact
- PDF upload via picker + drag and drop
- Platform tabs: Meesho, Flipkart, Amazon
- Upload progress bar and processing state
- Auto download via `URL.createObjectURL()`
- Retry on failure and user-friendly validation errors
- SEO-friendly static content sections (How to use, Benefits)

### Backend
- `POST /api/pdf/crop` endpoint
- Accepts multipart upload (`file`, `platform`)
- In-memory PDF crop + resize (4x6 target)
- Placeholder platform crop profiles:
  - Meesho: center area
  - Flipkart: top-focused area
  - Amazon: full content with padding
- CORS via config
- Large upload limits configured (50 MB)
- Swagger enabled in development

## Setup

### Prerequisites
- Node.js 20+
- Angular CLI 18+
- .NET SDK 8+

### 1) Run Backend

```bash
cd backend
dotnet restore
dotnet run
```

Default URLs:
- `https://localhost:5001`
- `http://localhost:5000`

### 2) Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:4200` and calls backend `http://localhost:5000/api` in development.

## Deployment Readiness

### Angular Production Build

```bash
cd frontend
npm run build
```

Artifacts are generated in `frontend/dist/ecom-cropper-frontend`.

### .NET Publish

```bash
cd backend
dotnet publish -c Release -o out
```

Use environment-specific `appsettings.{Environment}.json` for CORS and runtime behavior.

## API Documentation

Detailed API specs are available in:
- `backend/ApiDocs.md`

## Notes for Future SaaS Evolution

- Add queued processing for very large PDFs
- Add optional template calibration UI per courier
- Add usage analytics and billing tiers
- Replace placeholder crop ratios with ML/vision-based detection
