# Data Format Converter

Developer CLI tool for converting and formatting common data formats.

This utility helps developers, QA engineers and integration engineers quickly convert and debug common data formats during development and API testing.

## Features

- JSON pretty formatting
- JSON minification
- Base64 encode / decode
- URL encoding / decoding
- Multiline input support
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

Run the tool anywhere:

```bash
data-converter
```

## Usage

```
=== Data Format Converter ===

1) JSON -> pretty JSON
2) JSON -> minified JSON
3) Text -> Base64
4) Base64 -> Text
5) Text -> URL encoded
6) URL encoded -> Text
```

Paste your input after selecting an option.

When finished, type:

```
END
```

on a new line.

## Examples

### JSON → Pretty JSON

Input

```json
{"user":"katka","roles":["admin","editor"],"active":true}
```

Output

```json
{
  "user": "katka",
  "roles": [
    "admin",
    "editor"
  ],
  "active": true
}
```

### JSON → Minified JSON

Input

```json
{
  "user": "katka",
  "roles": [
    "admin",
    "editor"
  ],
  "active": true
}
```

Output

```json
{"user":"katka","roles":["admin","editor"],"active":true}
```

### Text → Base64

Input

```
hello world
```

Output

```
aGVsbG8gd29ybGQ=
```

### Base64 → Text

Input

```
aGVsbG8gd29ybGQ=
```

Output

```
hello world
```

### URL Encoding

Input

```
hello world & test=1
```

Output

```
hello%20world%20%26%20test%3D1
```

## Tech Stack

- TypeScript
- Node.js