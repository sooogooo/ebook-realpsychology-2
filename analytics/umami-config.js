// Umami Analytics Configuration for Medical Aesthetics Psychology Website
// Open-source, privacy-focused web analytics

class UmamiAnalytics {
  constructor(config = {}) {
    this.config = {
      // Umami configuration
      websiteId: config.websiteId || 'your-website-id',
      srcUrl: config.srcUrl || 'https://analytics.umami.is/script.js',
      domains: config.domains || ['medical-aesthetics-psychology.com', 'localhost'],

      // Event tracking
      autoTrack: config.autoTrack !== false,
      trackOutboundLinks: config.trackOutboundLinks !== false,
      trackDownloads: config.trackDownloads !== false,
      trackSearch: config.trackSearch !== false,

      // Custom events
      customEvents: {
        // Academic interactions
        'assessment_start': 'Assessment Started',
        'assessment_complete': 'Assessment Completed',
        'chapter_view': 'Chapter View',
        'illustration_view': 'Illustration View',
        'tool_usage': 'Tool Usage',

        // User engagement
        'scroll_depth': 'Scroll Depth',
        'search_query': 'Search Query',
        'share_action': 'Share Action',
        'bookmark_add': 'Bookmark Added',

        // Performance events
        'performance_score': 'Performance Score',
        'error_occurred': 'Error Occurred'
      },

      // Page properties
      pageProperties: {
        content_type: 'Academic Content',
        subject: 'Medical Aesthetics Psychology',
        language: 'zh-CN'
      },

      // Debug mode
      debugMode: config.debugMode || process.env.NODE_ENV === 'development'
    };

    this.isLoaded = false;
    this.eventQueue = [];
  }

  // Initialize Umami
  async init() {
    try {
      // Check if umami is already loaded
      if (window.umami) {
        this.isLoaded = true;
        this.processEventQueue();
        this.setupAutoTracking();
        return;
      }

      // Load Umami script
      await this.loadUmamiScript();

      // Wait for Umami to be ready
      await this.waitForUmami();

      this.isLoaded = true;
      this.processEventQueue();
      this.setupAutoTracking();

      this.log('Umami analytics initialized');

    } catch (error) {
      this.logError('Failed to initialize Umami:', error);
    }
  }

  // Load Umami script
  loadUmamiScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.config.srcUrl;
      script.async = true;
      script.setAttribute('data-website-id', this.config.websiteId);
      script.setAttribute('data-domains', this.config.domains.join(','));

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Umami script'));

      document.head.appendChild(script);
    });
  }

  // Wait for Umami to be ready
  waitForUmami(timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkUmami = () => {
        if (window.umami) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Umami not available after timeout'));
        } else {
          setTimeout(checkUmami, 100);
        }
      };

      checkUmami();
    });
  }

  // Process queued events
  processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      this.trackEvent(event.name, event.data, event.properties);
    }
  }

  // Setup automatic tracking
  setupAutoTracking() {
    if (!this.config.autoTrack) return;

    // Track page views (handled by Umami automatically)
    this.trackPageView();

    // Track outbound links
    if (this.config.trackOutboundLinks) {
      this.setupOutboundLinkTracking();
    }

    // Track downloads
    if (this.config.trackDownloads) {
      this.setupDownloadTracking();
    }

    // Track search
    if (this.config.trackSearch) {
      this.setupSearchTracking();
    }

    // Track scroll depth
    this.setupScrollTracking();

    // Track user interactions
    this.setupInteractionTracking();
  }

  // Track current page view with custom properties
  trackPageView(customProperties = {}) {
    const properties = {
      ...this.config.pageProperties,
      ...customProperties,
      url: window.location.pathname,
      title: document.title,
      referrer: document.referrer
    };

    // Page views are tracked automatically by Umami
    this.log('Page view tracked:', properties);
  }

  // Track custom event
  trackEvent(eventName, data = {}, properties = {}) {
    const event = {
      name: eventName,
      data: {
        ...properties,
        ...data,
        url: window.location.pathname,
        timestamp: Date.now()
      }
    };

    if (!this.isLoaded) {
      this.eventQueue.push(event);
      return;
    }

    try {
      if (window.umami && window.umami.trackEvent) {
        window.umami.trackEvent(eventName, event.data);
        this.log('Event tracked:', eventName, event.data);
      }
    } catch (error) {
      this.logError('Failed to track event:', error);
    }
  }

  // Track assessment interactions
  trackAssessment(type, action, score = null, data = {}) {
    this.trackEvent('assessment_action', {
      assessment_type: type,
      action: action,
      score: score,
      ...data
    });
  }

  // Track chapter interactions
  trackChapter(chapterId, action, data = {}) {
    this.trackEvent('chapter_interaction', {
      chapter_id: chapterId,
      action: action, // 'view', 'bookmark', 'share', 'download'
      ...data
    });
  }

  // Track tool usage
  trackTool(toolName, action, data = {}) {
    this.trackEvent('tool_usage', {
      tool_name: toolName,
      action: action, // 'open', 'use', 'close', 'share'
      ...data
    });
  }

  // Track search behavior
  trackSearch(query, resultsCount = null, data = {}) {
    this.trackEvent('search_behavior', {
      query: query,
      results_count: resultsCount,
      ...data
    });
  }

  // Track scroll depth
  trackScrollDepth(depth) {
    this.trackEvent('scroll_depth', {
      depth: depth, // percentage (0-100)
      page_height: document.documentElement.scrollHeight,
      viewport_height: window.innerHeight
    });
  }

  // Track user engagement time
  trackEngagementTime(duration) {
    this.trackEvent('engagement_time', {
      duration: duration, // in seconds
      page: window.location.pathname
    });
  }

  // Track performance metrics
  trackPerformance(metrics) {
    this.trackEvent('performance_metrics', {
      lcp: metrics.lcp,
      fid: metrics.fid,
      cls: metrics.cls,
      fcp: metrics.fcp,
      ttfb: metrics.ttfb
    });
  }

  // Track errors
  trackError(errorType, errorMessage, context = {}) {
    this.trackEvent('error_tracking', {
      error_type: errorType,
      error_message: errorMessage,
      context: context
    });
  }

  // Setup outbound link tracking
  setupOutboundLinkTracking() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Check if it's an outbound link
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        this.trackEvent('outbound_link_click', {
          url: href,
          link_text: link.textContent.trim(),
          target: link.getAttribute('target') || '_self'
        });
      }
    });
  }

  // Setup download tracking
  setupDownloadTracking() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Check if it's a download
      const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.epub'];
      const isDownload = downloadExtensions.some(ext => href.toLowerCase().endsWith(ext)) ||
                        link.hasAttribute('download');

      if (isDownload) {
        this.trackEvent('file_download', {
          file_url: href,
          file_name: href.split('/').pop(),
          file_type: href.split('.').pop()
        });
      }
    });
  }

  // Setup search tracking
  setupSearchTracking() {
    // Track search form submissions
    const searchForms = document.querySelectorAll('form[action*="search"], form[role="search"]');
    searchForms.forEach(form => {
      form.addEventListener('submit', (event) => {
        const input = form.querySelector('input[type="search"], input[name*="search"], input[name*="q"]');
        if (input) {
          this.trackSearch(input.value);
        }
      });
    });

    // Track search input interactions
    const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[name*="q"]');
    searchInputs.forEach(input => {
      let searchTimeout;

      input.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (input.value.length >= 3) {
            this.trackEvent('search_input', {
              query: input.value,
              input_length: input.value.length
            });
          }
        }, 500);
      });
    });
  }

  // Setup scroll tracking
  setupScrollTracking() {
    const scrollDepths = [25, 50, 75, 90, 100];
    const trackedDepth = new Set();

    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      );

      scrollDepths.forEach(depth => {
        if (scrollDepth >= depth && !trackedDepth.has(depth)) {
          trackedDepth.add(depth);
          this.trackScrollDepth(depth);
        }
      });
    });
  }

  // Setup interaction tracking
  setupInteractionTracking() {
    // Track illustration views
    const illustrations = document.querySelectorAll('img[data-illustration], svg[data-illustration]');
    illustrations.forEach(illustration => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('illustration_view', {
              illustration_id: illustration.getAttribute('data-illustration') || illustration.src,
              illustration_type: illustration.tagName.toLowerCase()
            });
          }
        });
      });

      observer.observe(illustration);
    });

    // Track PDF views
    const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
    pdfLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('pdf_view', {
          pdf_url: link.href,
          pdf_title: link.textContent.trim()
        });
      });
    });

    // Track bookmark actions
    const bookmarkButtons = document.querySelectorAll('[data-action="bookmark"]');
    bookmarkButtons.forEach(button => {
      button.addEventListener('click', () => {
        const pageId = button.getAttribute('data-page-id') || window.location.pathname;
        this.trackEvent('bookmark_action', {
          page_id: pageId,
          action: button.getAttribute('data-bookmark-state') || 'toggle'
        });
      });
    });
  }

  // Get current page URL
  getCurrentPage() {
    return {
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    };
  }

  // Get user agent information
  getUserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  // Utility: Log message
  log(...args) {
    if (this.config.debugMode) {
      console.log('[Umami Analytics]', ...args);
    }
  }

  // Utility: Log error
  logError(...args) {
    if (this.config.debugMode) {
      console.error('[Umami Analytics]', ...args);
    }
  }
}

// Initialize Umami Analytics
const umamiAnalytics = new UmamiAnalytics({
  debugMode: process.env.NODE_ENV === 'development',
  autoTrack: true,
  trackOutboundLinks: true,
  trackDownloads: true,
  trackSearch: true
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => umamiAnalytics.init());
} else {
  umamiAnalytics.init();
}

// Export for use in other modules
export { UmamiAnalytics, umamiAnalytics };