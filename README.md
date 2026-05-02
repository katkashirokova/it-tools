# IT Tools

Collection of small developer utilities written in TypeScript.

These tools are designed to help developers, QA engineers and integration engineers with common debugging and data tasks.

## Tools

### Timestamp Converter

CLI tool for converting:

- Unix timestamps
- human-readable dates
- timezones

Features:

- seconds ↔ milliseconds detection
- timezone conversion
- clipboard copy support
- timezone formatting

Project location: `Timestamp/`

Run:

```bash
cd Timestamp
npm install
npm run build
npm start
```

Run as CLI tool:

```bash
timestamp
```

---

### Data Format Converter

CLI tool for converting and formatting common data formats.

Features:

- JSON pretty formatting
- JSON minification
- Base64 encode / decode
- URL encoding / decoding
- multiline input support
- clipboard copy support

Project location: `DataFormatConverter/`

Run:

```bash
cd DataFormatConverter
npm install
npm run build
npm start
```

Run as CLI tool:

```bash
data-converter
```

---

## Tech Stack

- TypeScript
- Node.js
- CLI utilities

## Planned Tools

More developer utilities are planned for this toolkit:

- CURL Parser
- JSON Debugger
- Log Analyzer
- Test Data Generator