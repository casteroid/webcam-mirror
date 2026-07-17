# Webcam Mirror

A webapp to see yourself on camera — mirrors your webcam feed in the browser with support for camera selection.

## Features

- Real-time webcam video feed with horizontal mirror (swap)
- Camera device selection when multiple cameras are available
- Persists selected camera across sessions (localStorage)

## Development

### Prerequisites

- Node.js >= 22.22.3
- npm >= 8.0.0

### Setup

```bash
npm install
```

### Run

```bash
npm start
```

Opens at `http://localhost:4200/`.

### Build

```bash
npm run build
```

Output in `dist/webcam-mirror/`.

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Deploy

```bash
npm run deploy
```

Builds with production config and `/webcam-mirror/` base href (for GitHub Pages).

## Tech Stack

| | |
|---|---|
| Framework | Angular 22 |
| Language | TypeScript 6.0 |
| Build | esbuild via `@angular-devkit/build-angular:application` |
| Tests | Karma + Jasmine |
| Linting | ESLint 9 (flat config) with angular-eslint |

## Credits

Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com).
