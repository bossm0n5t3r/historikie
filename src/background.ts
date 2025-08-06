// Background service worker for Historikie extension

// Install event - set up initial state
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Historikie extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      maxHistoryItems: 10000,
      searchTimeRange: 30, // days
      enableFavicons: true
    });
  }
});

// Handle extension icon click (optional - popup is already configured in manifest)
chrome.action.onClicked.addListener((tab) => {
  // This won't be called if popup is set in manifest, but keeping for completeness
  console.log('Extension icon clicked on tab:', tab.url);
});

// Handle keyboard shortcuts (if we add any in the future)
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  
  switch (command) {
    case 'open-history-search':
      // Open the popup programmatically if needed
      chrome.action.openPopup();
      break;
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  switch (message.type) {
    case 'GET_HISTORY':
      handleGetHistory(message.query, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'OPEN_URL':
      handleOpenUrl(message.url, sendResponse);
      return true;
      
    default:
      console.warn('Unknown message type:', message.type);
  }
});

// Handle history search requests
async function handleGetHistory(query: string, sendResponse: (response: any) => void) {
  try {
    const settings = await chrome.storage.sync.get({
      maxHistoryItems: 10000,
      searchTimeRange: 30
    });
    
    const startTime = Date.now() - (settings.searchTimeRange * 24 * 60 * 60 * 1000);
    
    const historyItems = await chrome.history.search({
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
      error: error.message
    });
  }
}

// Handle URL opening requests
async function handleOpenUrl(url: string, sendResponse: (response: any) => void) {
  try {
    const tab = await chrome.tabs.create({ url });
    sendResponse({
      success: true,
      tabId: tab.id
    });
  } catch (error) {
    console.error('Failed to open URL:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Handle tab updates to potentially update history cache
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could implement history cache invalidation here if needed
    console.log('Tab updated:', tab.url);
  }
});

// Export for TypeScript (won't affect runtime)
export {};