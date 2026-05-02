# JSON Debugger

Developer CLI tool for validating, inspecting and debugging JSON.

This utility helps developers, QA engineers and integration engineers quickly analyze JSON data during API development, testing and debugging.

## Features

- Validate JSON
- Pretty format JSON
- Minify JSON
- Detect JSON errors with line and column
- Show JSON structure
- Show JSON paths
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

Run anywhere:

```bash
json-debugger
```

## Usage

```
=== JSON Debugger ===

1) Validate JSON
2) Pretty format JSON
3) Minify JSON
4) Show JSON structure
5) Show JSON paths
```

Paste JSON when prompted.

Finish multiline input with:

```
END
```

## Example

Input JSON:

```json
{
  "user": "katka",
  "roles": ["admin", "editor"],
  "profile": {
    "age": 30,
    "active": true
  }
}
```

### JSON structure

```
user: string
roles: array
  0: string
  1: string
profile: object
  age: number
  active: boolean
```

### JSON paths

```
$.user: string
$.roles[0]: string
$.roles[1]: string
$.profile.age: number
$.profile.active: boolean
```

## JSON error example

Input:

```json
{
  "user": "katka"
  "active": true
}
```

Output:

```
Invalid JSON

Unexpected string in JSON at position 20

Line: 3
Column: 3

  "active": true
  ^
```

## Tech Stack

- TypeScript
- Node.js