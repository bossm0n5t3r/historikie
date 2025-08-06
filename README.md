# Historikie - Chrome History Search Extension

A beautiful Chrome extension built with TypeScript that allows you to search your browser history through a clean,
modern popup interface.

## Features

- 🔍 **Fast History Search**: Search through your Chrome history with real-time filtering
- 🎨 **Beautiful UI**: Clean, modern interface
- ⚡ **Instant Results**: Debounced search with immediate feedback
- 🕒 **Time Display**: Shows when you last visited each page
- 🌐 **Favicon Support**: Displays website favicons for easy recognition
- ⌨️ **Keyboard Navigation**: Press Enter to open the first result
- 📱 **Responsive Design**: Works perfectly in the Chrome extension popup

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
- **Styling**: Embedded CSS with modern design principles
- **Chrome APIs**: Uses `chrome.history` and `chrome.tabs` APIs
- **Build System**: TypeScript compiler with manual file copying

### File Structure

```
dist/
├── manifest.json       # Chrome extension manifest
├── popup.html         # Extension popup interface
├── popup.js          # Compiled popup functionality
├── background.js     # Compiled background service worker
└── icons/
    └── icon.svg      # Extension icon
```

### Permissions

The extension requires these Chrome permissions:

- `history`: To read your browsing history
- `storage`: To store user preferences (future feature)

## Development

### Prerequisites

- Node.js (>= 18.20.8 for full Astro support, or >= 18.18.0 for manual build)
- pnpm package manager

### Scripts

- `pnpm build`: Full build with Astro (requires newer Node.js)
- `pnpm build:extension`: TypeScript compilation only
- `pnpm package`: Create a zip file for distribution
- `pnpm clean`: Remove dist directory

### Customization

You can customize the extension by modifying:

- **Styling**: Edit the CSS in `src/popup.html`
- **Search Logic**: Modify `src/popup.ts`
- **Background Behavior**: Edit `src/background.ts`
- **Permissions**: Update `public/manifest.json`

## Privacy

Historikie only accesses your local Chrome history and does not send any data to external servers. All processing
happens locally on your machine.

## License

MIT License - feel free to modify and distribute.
