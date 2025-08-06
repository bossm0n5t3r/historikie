// Background service worker for Historikie extension
import { unifiedAPI } from './browser-api';

// Install event - set up the initial state
unifiedAPI.runtime.onInstalled.addListener(async (details) => {
  console.log('Historikie extension installed:', details.reason);

  if (details.reason === 'install') {
    // Set default settings on the first installation
    await unifiedAPI.storage.sync.set({
      maxHistoryItems: 10000,
      searchTimeRange: 30, // days
      enableFavicons: true
    });
  }
});

// Handle extension icon click (optional - popup is already configured in the manifest)
if (unifiedAPI.action.onClicked) {
  unifiedAPI.action.onClicked.addListener((tab) => {
    // This won't be called if the popup is set in manifest, but keeping for completeness
    console.log('Extension icon clicked on tab:', tab.url);
  });
}

// Handle keyboard shortcuts (if we'll add any in the future)
if (unifiedAPI.commands.onCommand) {
  unifiedAPI.commands.onCommand.addListener(async (command) => {
    console.log('Command received:', command);

    switch (command) {
      case 'open-history-search':
        // Open the popup programmatically if needed
        await unifiedAPI.action.openPopup({});
        break;
    }
  });
}

// Handle messages from popup or content scripts
unifiedAPI.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('Message received:', message);

  switch (message.type) {
    case 'GET_HISTORY':
      await handleGetHistory(message.query, sendResponse);
      return true; // Keep the message channel open for async response

    case 'OPEN_URL':
      await handleOpenUrl(message.url, sendResponse);
      return true;

    default:
      console.warn('Unknown message type:', message.type);
  }
});

// Handle history search requests
async function handleGetHistory(query: string, sendResponse: (response: any) => void) {
  try {
    const settings = await unifiedAPI.storage.sync.get({
      maxHistoryItems: 10000,
      searchTimeRange: 30
    });

    const startTime = Date.now() - (settings.searchTimeRange * 24 * 60 * 60 * 1000);

    const historyItems = await unifiedAPI.history.search({
      text: query || '',
      maxResults: settings.maxHistoryItems,
      startTime: startTime
    });

    sendResponse({
      success: true,
      data: historyItems
    });
  } catch (error) {
    console.error('Failed to search history:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}

// Handle URL opening requests
async function handleOpenUrl(url: string, sendResponse: (response: any) => void) {
  try {
    const tab = await unifiedAPI.tabs.create({ url });
    sendResponse({
      success: true,
      tabId: tab.id
    });
  } catch (error) {
    console.error('Failed to open URL:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}

// Handle tab updates to potentially update the history cache
unifiedAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could implement history cache invalidation here if needed
    console.log('Tab updated:', tab.url);
  }
});

// Export for TypeScript (won't affect runtime)
export {};
