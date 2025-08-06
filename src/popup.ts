interface HistoryItem {
  id: string;
  url: string;
  title: string;
  lastVisitTime: number;
  visitCount: number;
  typedCount: number;
}

type Theme = 'light' | 'dark' | 'system';

class HistorySearcher {
  private searchInput: HTMLInputElement;
  private resultsContainer: HTMLElement;
  private themeToggle: HTMLButtonElement;
  private themeIcon: HTMLElement;
  private themeText: HTMLElement;
  private allHistoryItems: HistoryItem[] = [];
  private searchTimeout: number | null = null;
  private currentTheme: Theme = 'system';

  constructor() {
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.resultsContainer = document.getElementById('resultsContainer') as HTMLElement;
    this.themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
    this.themeIcon = document.getElementById('themeIcon') as HTMLElement;
    this.themeText = document.getElementById('themeText') as HTMLElement;
    
    this.init();
  }

  private async init(): Promise<void> {
    await this.initTheme();
    await this.loadHistory();
    this.setupEventListeners();
    this.displayResults(this.allHistoryItems.slice(0, 50)); // Show first 50 items initially
  }

  private async loadHistory(): Promise<void> {
    try {
      const historyItems = await chrome.history.search({
        text: '',
        maxResults: 10000,
        startTime: Date.now() - (30 * 24 * 60 * 60 * 1000) // Last 30 days
      });

      this.allHistoryItems = historyItems
        .filter(item => item.url && item.title)
        .map(item => ({
          id: item.id || '',
          url: item.url || '',
          title: item.title || '',
          lastVisitTime: item.lastVisitTime || 0,
          visitCount: item.visitCount || 0,
          typedCount: item.typedCount || 0
        }))
        .sort((a, b) => b.lastVisitTime - a.lastVisitTime);
    } catch (error) {
      console.error('Failed to load history:', error);
      this.showError('Failed to load history. Please check permissions.');
    }
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.trim();
      this.debounceSearch(query);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstResult = this.resultsContainer.querySelector('.history-item') as HTMLElement;
        if (firstResult) {
          firstResult.click();
        }
      }
    });

    // Theme toggle event listener
    this.themeToggle.addEventListener('click', () => {
      this.cycleTheme();
    });

    // Focus search input when popup opens
    this.searchInput.focus();
  }

  private debounceSearch(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.performSearch(query);
    }, 150);
  }

  private performSearch(query: string): void {
    if (!query) {
      this.displayResults(this.allHistoryItems.slice(0, 50));
      return;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const filteredItems = this.allHistoryItems.filter(item => {
      const searchableText = `${item.title} ${item.url}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });

    this.displayResults(filteredItems.slice(0, 100));
  }

  private displayResults(items: HistoryItem[]): void {
    if (items.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="no-results">
          No history items found matching your search.
        </div>
      `;
      return;
    }

    const resultsHTML = items.map(item => this.createHistoryItemHTML(item)).join('');
    this.resultsContainer.innerHTML = resultsHTML;

    // Add click listeners to all history items
    this.resultsContainer.querySelectorAll('.history-item').forEach(element => {
      element.addEventListener('click', () => {
        const url = element.getAttribute('data-url');
        if (url) {
          this.openUrl(url);
        }
      });
    });
  }

  private createHistoryItemHTML(item: HistoryItem): string {
    const favicon = this.getFaviconUrl(item.url);
    const timeAgo = this.getTimeAgo(item.lastVisitTime);
    const displayUrl = this.getDisplayUrl(item.url);

    return `
      <div class="history-item" data-url="${this.escapeHtml(item.url)}">
        <img class="favicon" src="${favicon}" alt="" onerror="this.style.display='none'">
        <div class="item-content">
          <div class="item-title">${this.escapeHtml(item.title)}</div>
          <div class="item-url">${this.escapeHtml(displayUrl)}</div>
        </div>
        <div class="item-time">${timeAgo}</div>
      </div>
    `;
  }

  private getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23f3f4f6"/></svg>';
    }
  }

  private getDisplayUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  }

  private getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private async openUrl(url: string): Promise<void> {
    try {
      await chrome.tabs.create({ url });
      window.close();
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  }

  private showError(message: string): void {
    this.resultsContainer.innerHTML = `
      <div class="no-results">
        ${this.escapeHtml(message)}
      </div>
    `;
  }

  // Theme management methods
  private async initTheme(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['theme']);
      this.currentTheme = (result.theme as Theme) || 'system';
      this.applyTheme();
      this.updateThemeToggleUI();
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      this.currentTheme = 'system';
      this.applyTheme();
      this.updateThemeToggleUI();
    }
  }

  private cycleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];
    
    this.applyTheme();
    this.updateThemeToggleUI();
    this.saveTheme();
  }

  private applyTheme(): void {
    const body = document.body;
    
    if (this.currentTheme === 'system') {
      const systemTheme = this.getSystemTheme();
      body.setAttribute('data-theme', systemTheme);
    } else {
      body.setAttribute('data-theme', this.currentTheme);
    }
  }

  private getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private async saveTheme(): Promise<void> {
    try {
      await chrome.storage.sync.set({ theme: this.currentTheme });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }

  private updateThemeToggleUI(): void {
    const themeConfig = {
      light: { icon: '☀️', text: 'Light' },
      dark: { icon: '🌙', text: 'Dark' },
      system: { icon: '💻', text: 'System' }
    };

    const config = themeConfig[this.currentTheme];
    this.themeIcon.textContent = config.icon;
    this.themeText.textContent = config.text;
  }
}

// Initialize the history searcher when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HistorySearcher();
});