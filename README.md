# Historikie - Browser History Search Extension

A beautiful browser extension built with TypeScript that allows you to search your browser history
through a clean, modern popup interface. **Supports both Chrome and Firefox!**

|                                                                    Browser                                                                     | Install from ...                                                                                                        |
|:----------------------------------------------------------------------------------------------------------------------------------------------:|-------------------------------------------------------------------------------------------------------------------------|
|            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" width="50px">             | [Chrome Web Store](https://chromewebstore.google.com/detail/historikie-history-search/kempjjljlfnohfokeibmfehnjngbehgm) |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/500px-Firefox_logo%2C_2019.svg.png" width="50px"> | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/historikie-history-search/)                            |

## 🔍 Overview

Historikie provides a fast, keyboard-friendly way to search through your browser history. It uses a
unified API layer to provide a consistent experience across different browsers while maintaining
native performance and privacy.

## ✨ Features

- 🔍 **Fast History Search**: Search through your browser history with real-time filtering.
- 🎨 **Beautiful UI**: Clean, modern interface with light/dark theme support.
- ⚡ **Instant Results**: Debounced search with immediate feedback.
- 🕒 **Time Display**: Shows when you last visited each page.
- 🌐 **Favicon Support**: Displays website favicons for easy recognition.
- ⌨️ **Keyboard Navigation**: Press Enter to open the first result.
- 📱 **Responsive Design**: Works perfectly in browser extension popups.
- 🦊 **Cross-Browser**: Supports both Chrome and Firefox with a unified codebase.

## 🛠️ Technical Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **APIs**: WebExtensions API (with a unified wrapper in `src/browser-api.ts`)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Recommended: >= 18.0.0)
- [pnpm](https://pnpm.io/installation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bossm0n5t3r/historikie.git
   cd historikie
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run Vite in development mode:

```bash
pnpm dev
```

Note: Since this is a browser extension, `pnpm dev` starts the Vite dev server, but you still need
to load the extension in your browser for the full functionality.

### Building the Extension

Build for a specific browser:

```bash
# For Chrome
pnpm build:chrome

# For Firefox
pnpm build:firefox

# For both
pnpm build:all
```

The output will be in `dist-chrome/` and `dist-firefox/` respectively.

### Loading the Extension

#### Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist-chrome` folder from this project.

#### Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside the `dist-firefox` folder.

## 📜 Scripts

| Script                 | Description                                                        |
|------------------------|--------------------------------------------------------------------|
| `pnpm dev`             | Starts Vite dev server.                                            |
| `pnpm build`           | Default build (alias for `vite build`).                            |
| `pnpm build:chrome`    | Builds the extension for Chrome (`dist-chrome`).                   |
| `pnpm build:firefox`   | Builds the extension for Firefox (`dist-firefox`).                 |
| `pnpm build:all`       | Builds for both Chrome and Firefox.                                |
| `pnpm package`         | Packages both extensions into ZIP files.                           |
| `pnpm package:chrome`  | Builds and packages the Chrome extension.                          |
| `pnpm package:firefox` | Builds and packages the Firefox extension.                         |
| `pnpm clean`           | Removes build directories (`dist`, `dist-chrome`, `dist-firefox`). |
| `pnpm preview`         | Previews the build using Vite.                                     |

## 🌍 Environment Variables

- `TARGET_BROWSER`: Set to `chrome` (default) or `firefox` to specify the build target.

## 🧪 Tests

TODO: Add unit and integration tests. Currently, the project does not have an automated test suite.

## 📂 Project Structure

```text
.
├── dist-chrome/        # Chrome build output
├── dist-firefox/       # Firefox build output
├── public/             # Static assets
│   ├── icons/          # Extension icons
│   ├── manifest.json   # Chrome (V3) manifest
│   └── manifest-firefox.json # Firefox (V2) manifest
├── src/                # Source code
│   ├── background.ts   # Background service worker / script
│   ├── browser-api.ts  # Unified browser API wrapper
│   └── popup.ts        # Popup interface logic
├── popup.html          # Extension popup entry point
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔒 Privacy

Historikie only accesses your local browser history and **does not send any data to external servers
**. All processing happens locally on your machine.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
