# IT Tools

Collection of small developer utilities written in TypeScript.

These tools are designed to help developers, QA engineers and integration engineers with common debugging and data tasks.

## Tools

| Tool | Description |
|-----|-------------|
| **Timestamp Converter** | Convert Unix timestamps, dates and timezones |
| **Data Format Converter** | Convert JSON, Base64 and URL encoded data |
| **CURL Parser** | Parse curl commands into readable HTTP requests |
| **JSON Debugger** | Validate, format and analyze JSON data |

---

## Timestamp Converter

CLI tool for converting timestamps and dates.

Features:

- seconds ↔ milliseconds detection  
- timezone conversion  
- clipboard copy support  

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

## Data Format Converter

CLI tool for converting common data formats.

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

## CURL Parser

CLI tool for parsing curl commands into readable HTTP requests.

Features:

- Extract HTTP method  
- Detect request URL  
- Parse headers  
- Extract request body  
- Pretty JSON body formatting  
- Generate raw HTTP request view  

Project location: `CurlParser/`

Run:

```bash
cd CurlParser
npm install
npm run build
npm start
```

Run as CLI tool:

```bash
curl-parser
```

---

## JSON Debugger

CLI tool for validating, formatting and analyzing JSON.

Features:

- Validate JSON  
- Pretty format JSON  
- Minify JSON  
- Detect JSON errors with line and column  
- Show JSON structure  
- Show JSON paths  
- multiline input support  
- clipboard copy support  

Project location: `JsonDebugger/`

Run:

```bash
cd JsonDebugger
npm install
npm run build
npm start
```

Run as CLI tool:

```bash
json-debugger
```

---

## Tech Stack

- TypeScript  
- Node.js  
- CLI utilities  

---

## Planned Tools

More developer utilities planned for this toolkit:

- Log Analyzer  
- Test Data Generator  