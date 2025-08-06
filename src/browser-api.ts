// Cross-browser API compatibility layer
// This module provides a unified interface for Chrome and Firefox extension APIs

// Detect the browser environment
const isFirefox = typeof browser !== 'undefined';
const isChrome = typeof chrome !== 'undefined';

// Use the appropriate API namespace
const browserAPI = isFirefox ? browser : chrome;

// Promisify Chrome APIs for consistency with Firefox's promise-based APIs
function promisify<T extends any[], R>(
  fn: (...args: [...T, (result: R) => void]) => void
): (...args: T) => Promise<R> {
  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      fn(...args, (result: R) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Unified API interface
export const unifiedAPI = {
  // Runtime APIs
  runtime: {
    onInstalled: browserAPI.runtime.onInstalled,
    onMessage: browserAPI.runtime.onMessage,
    lastError: browserAPI.runtime.lastError,
  },

  // Storage APIs
  storage: {
    sync: {
      get: isFirefox
        ? browserAPI.storage.sync.get.bind(browserAPI.storage.sync)
        : promisify(browserAPI.storage.sync.get.bind(browserAPI.storage.sync)),
      set: isFirefox
        ? browserAPI.storage.sync.set.bind(browserAPI.storage.sync)
        : promisify(browserAPI.storage.sync.set.bind(browserAPI.storage.sync)),
    },
  },

  // History APIs
  history: {
    search: isFirefox
      ? browserAPI.history.search.bind(browserAPI.history)
      : promisify(browserAPI.history.search.bind(browserAPI.history)),
  },

  // Tabs APIs
  tabs: {
    create: isFirefox
      ? browserAPI.tabs.create.bind(browserAPI.tabs)
      : promisify(browserAPI.tabs.create.bind(browserAPI.tabs)),
    onUpdated: browserAPI.tabs.onUpdated,
  },

  // Action/BrowserAction APIs (Chrome V3 vs Firefox V2)
  action: {
    onClicked: isFirefox
      ? browserAPI.browserAction?.onClicked || browserAPI.action?.onClicked
      : browserAPI.action?.onClicked,
    openPopup: isFirefox
      ? () => Promise.resolve() // Firefox doesn't support programmatic popup opening
      : browserAPI.action?.openPopup
        ? promisify(browserAPI.action.openPopup.bind(browserAPI.action))
        : () => Promise.resolve(),
  },

  // Commands APIs
  commands: {
    onCommand: browserAPI.commands?.onCommand,
  },
};

// Type definitions for better TypeScript support
export interface HistoryItem {
  id?: string;
  url?: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
  typedCount?: number;
}

export interface Tab {
  id?: number;
  url?: string;
  title?: string;
}

export interface StorageItems {
  [key: string]: any;
}

// Export browser detection utilities
export const browserInfo = {
  isFirefox,
  isChrome,
  name: isFirefox ? 'firefox' : isChrome ? 'chrome' : 'unknown',
};
