# API Documentation

## Base URL
- Development: `https://localhost:5001/api`

## Endpoint
### `POST /api/pdf/crop`

Processes a PDF based on selected marketplace crop profile and returns a cropped PDF.

#### Request
- Content-Type: `multipart/form-data`
- Fields:
  - `files` (optional, repeatable): One or more PDF files
  - `file` (optional): Single PDF file (legacy)
  - `platform` (required): `meesho` | `flipkart` | `amazon`
  - `keepInvoiceOnSeparatePage` (optional): `true` | `false`
  - `pickupSorting` (optional): `true` | `false` (Meesho)
  - `skuSorting` (optional): `true` | `false` (Meesho)
  - `orderNumberSorting` (optional): `true` | `false` (Meesho)
  - `returnOriginalWithInvoice` (optional): `true` | `false` (appends original PDF pages into the same merged output)
  - `labelText` (optional): string text to print on label (Meesho)

#### Success Response
- `200 OK`
- Content-Type: `application/pdf`
- Body: processed PDF stream (single merged PDF when multiple files are uploaded)

#### Error Response
- `400 Bad Request`
- Invalid file, missing file, or invalid platform.
