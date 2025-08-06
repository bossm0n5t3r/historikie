# Historikie - Browser History Search Extension

A beautiful browser extension built with TypeScript that allows you to search your browser history through a clean,
modern popup interface. **Now supports both Chrome and Firefox!**

## Features

- 🔍 **Fast History Search**: Search through your browser history with real-time filtering
- 🎨 **Beautiful UI**: Clean, modern interface with light/dark theme support
- ⚡ **Instant Results**: Debounced search with immediate feedback
- 🕒 **Time Display**: Shows when you last visited each page
- 🌐 **Favicon Support**: Displays website favicons for easy recognition
- ⌨️ **Keyboard Navigation**: Press Enter to open the first result
- 📱 **Responsive Design**: Works perfectly in browser extension popups
- 🦊 **Cross-Browser**: Supports both Chrome and Firefox with unified codebase

## Installation

### For Development/Testing

1. **Build the Extension**:
   ```bash
   pnpm install
   pnpm build:extension
   ```

2. **Load in Chrome**:

- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" (toggle in top right)
- Click "Load unpacked"
- Select the `dist` folder from this project

3. **Use the Extension**:

- Click the Historikie icon in your Chrome toolbar
- Start typing to search your history
- Click any result to open it in a new tab
- Press Enter to open the first result

### Manual Build (if pnpm build fails)

If you encounter Node.js version issues, you can build manually:

```bash
# Create dist directory
mkdir -p dist

# Compile TypeScript files
npx tsc src/popup.ts --outDir dist --target ES2020 --module ES2020 --moduleResolution node
npx tsc src/background.ts --outDir dist --target ES2020 --module ES2020 --moduleResolution node

# Copy necessary files
cp public/manifest.json dist/
cp src/popup.html dist/
cp -r public/icons dist/
```

## Usage

1. **Open the Extension**: Click the Historikie icon in your Chrome toolbar
2. **Search**: Type keywords to search through your history
3. **Navigate**: Use mouse or keyboard (Enter for first result)
4. **Open Pages**: Click any result to open it in a new tab

## Technical Details

### Architecture

- **Frontend**: TypeScript with vanilla DOM manipulation
- **Styling**: Embedded CSS with modern design principles and theme support
- **Cross-Browser APIs**: Uses unified API layer that works with both Chrome and Firefox
- **Build System**: Vite with custom plugins for multi-browser builds
- **Compatibility Layer**: Custom browser-api.ts module handles API differences

### File Structure

```
dist-chrome/                # Chrome build output
├── manifest.json          # Chrome extension manifest (Manifest V3)
├── popup.html            # Extension popup interface
├── popup.js             # Compiled popup functionality
├── background.js        # Compiled background service worker
├── browser-api.js       # Cross-browser compatibility layer
└── icons/               # Extension icons

dist-firefox/               # Firefox build output
├── manifest.json          # Firefox extension manifest (Manifest V2)
├── popup.html            # Extension popup interface
├── popup.js             # Compiled popup functionality
├── background.js        # Compiled background script
├── browser-api.js       # Cross-browser compatibility layer
└── icons/               # Extension icons
```

### Cross-Browser Compatibility

The extension uses a unified API layer (`browser-api.ts`) that handles differences between:

- **Chrome**: Uses `chrome.*` APIs with callback-based functions
- **Firefox**: Uses `browser.*` APIs with promise-based functions
- **Manifest Versions**: Chrome V3 vs Firefox V2 manifest formats
- **Background Scripts**: Service workers (Chrome) vs background scripts (Firefox)

### Permissions

The extension requires these permissions:

- `history`: To read your browsing history
- `storage`: To store user preferences and theme settings
- `tabs`: To open selected history items in new tabs

## Development

### Prerequisites

- Node.js (>= 18.20.8 for full Astro support, or >= 18.18.0 for manual build)
- pnpm package manager

### Scripts

- `pnpm build`: Default build (Chrome)
- `pnpm build:chrome`: Build for Chrome
- `pnpm build:firefox`: Build for Firefox
- `pnpm build:all`: Build for both browsers
- `pnpm package:chrome`: Create Chrome extension zip
- `pnpm package:firefox`: Create Firefox extension zip
- `pnpm package:all`: Create both extension zips
- `pnpm clean`: Remove all dist directories

### Customization

You can customize the extension by modifying:

- **Styling**: Edit the CSS in `src/popup.html`
- **Search Logic**: Modify `src/popup.ts`
- **Background Behavior**: Edit `src/background.ts`
- **Permissions**: Update `public/manifest.json`

## Privacy

Historikie only accesses your local browser history and does not send any data to external servers. All processing
happens locally on your machine. This applies to both Chrome and Firefox versions of the extension.

## License

MIT License - feel free to modify and distribute.
