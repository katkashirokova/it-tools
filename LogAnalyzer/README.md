# Log Analyzer

Developer CLI tool for analyzing log files.

This utility helps developers, QA engineers and DevOps quickly inspect logs, detect errors and search for specific events in large log files.

## Features

- Log level summary (ERROR / WARN / INFO / DEBUG)
- Extract ERROR lines
- Search logs by keyword
- Show first N lines of a log file
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

## Tech Stack

- TypeScript
- Node.js