# CURL Parser

Developer CLI tool for parsing curl commands into readable HTTP requests.

This utility helps developers and QA engineers quickly inspect curl commands and understand the underlying HTTP request structure.

## Features

- Extract HTTP method
- Detect request URL
- Parse headers
- Extract request body
- Pretty print JSON body
- Generate raw HTTP request view

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
curl-parser
```

## Usage

Paste a curl command when prompted.

Example:

```
curl -X POST https://api.test.com/login \
-H "Content-Type: application/json" \
-H "Authorization: Bearer 123" \
-d '{"user":"katka","role":"admin"}'
```

## Example Output

Parsed request:

```
Method: POST
URL: https://api.test.com/login

Headers:
Content-Type: application/json
Authorization: Bearer 123
```

Pretty JSON body:

```json
{
  "user": "katka",
  "role": "admin"
}
```

HTTP request view:

```
POST /login HTTP/1.1
Host: api.test.com
Content-Type: application/json

{"user":"katka","role":"admin"}
```

## Tech Stack

- TypeScript
- Node.js