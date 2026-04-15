# API Documentation

## Base URL
- Development: `https://localhost:5001/api`

## Endpoint
### `POST /api/pdf/crop`

Processes a PDF based on selected marketplace crop profile and returns a cropped PDF.

#### Request
- Content-Type: `multipart/form-data`
- Fields:
  - `file` (required): PDF file
  - `platform` (required): `meesho` | `flipkart` | `amazon`

#### Success Response
- `200 OK`
- Content-Type: `application/pdf`
- Body: processed PDF stream

#### Error Response
- `400 Bad Request`
- Invalid file, missing file, or invalid platform.
