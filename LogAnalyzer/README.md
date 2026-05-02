# Log Analyzer

Developer CLI tool for analyzing log files.

This utility helps developers, QA engineers and DevOps quickly inspect logs, detect errors and analyze events in large log files.

## Features

- Log level summary (ERROR / WARN / INFO / DEBUG)
- Extract ERROR lines
- Search logs by keyword
- Show first N lines of a log file
- Analyze web/network logs (HTTP methods, status codes, slow requests)
- Show top repeated error messages
- Show error timeline
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
log-analyzer
```

## Usage

```
=== Log Analyzer ===

1) Show log level summary
2) Show ERROR lines
3) Search keyword
4) Show first N lines
5) Analyze web/network log
6) Top errors
7) Error timeline
```

When prompted, enter the path to the log file.

Example:

```
D:\logs\application.log
```

or

```
./test.log
```

## Example Log

```
2026-05-02 10:00:01 INFO Application started
2026-05-02 10:00:02 DEBUG Loading configuration
2026-05-02 10:00:03 WARN Missing optional value
2026-05-02 10:00:04 ERROR Failed to connect to database
2026-05-02 10:00:05 INFO Retry started
2026-05-02 10:00:06 ERROR Timeout while connecting
```

### Log Level Summary

```
ERROR: 2
WARN: 1
INFO: 2
DEBUG: 1
```

### Top Errors Example

```
Top errors:

3  Failed to connect to database
1  Timeout while connecting
```

### Error Timeline Example

```
Error timeline:

2026-05-02 10:00:04 | line 4 | Failed to connect to database
2026-05-02 10:00:06 | line 6 | Timeout while connecting
```

### Example Web / Network Log

```
GET /api/users 200 120ms
POST /api/login 401 87ms
GET /static/app.js 304 12ms
GET /api/report 200 1450ms
POST /api/export 500 2300ms
```

Example result:

```
Web / Network log summary:

Total requests: 5

HTTP status summary:
2xx: 2
3xx: 1
4xx: 1
5xx: 1

Methods:
GET: 3
POST: 2

Slow requests (>1000ms):
4: GET /api/report 200 1450ms
5: POST /api/export 500 2300ms
```

## Tech Stack

- TypeScript
- Node.js