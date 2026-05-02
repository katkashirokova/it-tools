# Test Data Generator

Developer CLI tool for generating test data.

This utility helps developers, QA engineers and integration engineers quickly generate common types of test data used in API testing, debugging and automation.

## Features

- Generate UUID
- Generate random email addresses
- Generate timestamps
- Generate test user JSON objects
- Generate API payload JSON
- Generate multiple emails
- Clipboard copy support
- Repeat operations without restarting the tool

## Build

```bash
npm install
npm run build
```

## Run

```bash
npm start
```

### Run as CLI tool

After linking locally:

```bash
npm link
```

Run anywhere:

```bash
test-data-generator
```

## Usage

```
=== Test Data Generator ===

1) Generate UUID
2) Generate email
3) Generate timestamp
4) Generate test user JSON
5) Generate API payload JSON
6) Generate multiple emails
```

## Example Outputs

### UUID

```
3c0a7e9d-72b4-4b1e-9e51-b8c1d0e7a21f
```

### Email

```
test582@example.com
```

### Timestamp

```
ISO: 2026-05-03T12:30:15.123Z
Unix timestamp: 1777801815
Milliseconds: 1777801815123
```

### Test User JSON

```json
{
  "id": "c4d5a3c8-9a11-4d59-8d42-4f9e7b8eac2e",
  "firstName": "Alex",
  "lastName": "Ivanov",
  "email": "alex534@test.com",
  "age": 32,
  "active": true,
  "createdAt": "2026-05-03T12:30:15.123Z"
}
```

### API Payload JSON

```json
{
  "requestId": "a52d3c5c-8a9f-4e4b-b9a3-ef1c2e0cda91",
  "timestamp": "2026-05-03T12:30:15.123Z",
  "user": {
    "id": "be7c39f4-1a5e-4e8f-93e5-3a6a3d9a4e7a",
    "email": "user743@mail.test"
  },
  "items": [
    {
      "id": "5f9c6e4d-0c3a-4f6b-9b7d-b0e7a4c9d1f2",
      "name": "Test item",
      "quantity": 3,
      "price": 120
    }
  ],
  "metadata": {
    "source": "test-data-generator",
    "environment": "test"
  }
}
```

## Tech Stack

- TypeScript
- Node.js