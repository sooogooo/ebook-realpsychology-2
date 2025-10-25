// Performance Monitoring for Medical Aesthetics Psychology Website
// Uses Web Vitals and custom metrics for comprehensive monitoring

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      // Analytics endpoints
      analyticsEndpoint: config.analyticsEndpoint || '/api/analytics',
      performanceEndpoint: config.performanceEndpoint || '/api/performance',

      // Sampling rates
      performanceSampleRate: config.performanceSampleRate || 1.0,
      userSampleRate: config.userSampleRate || 0.1,

      // Thresholds for alerts
      lcpThreshold: config.lcpThreshold || 2500,
      fidThreshold: config.fidThreshold || 100,
      clsThreshold: config.clsThreshold || 0.1,
      ttfbThreshold: config.ttfbThreshold || 800,

      // Custom metrics
      trackCustomMetrics: config.trackCustomMetrics || true,
      debugMode: config.debugMode || false
    };

    this.metrics = new Map();
    this.customMetrics = [];
    this.isInitialized = false;

    this.init();
  }

  // Initialize performance monitoring
  init() {
    if (this.isInitialized) return;

    try {
      this.initCoreWebVitals();
      this.initCustomMetrics();
      this.initNetworkMonitoring();
      this.initErrorTracking();
      this.initUserBehaviorTracking();

      this.isInitialized = true;
      this.log('Performance monitoring initialized');

    } catch (error) {
      this.logError('Failed to initialize performance monitoring', error);
    }
  }

  // Initialize Core Web Vitals monitoring
  initCoreWebVitals() {
    // Largest Contentful Paint
    getCLS((metric) => {
      this.handleMetric('CLS', metric);
    });

    // First Input Delay
    getFID((metric) => {
      this.handleMetric('FID', metric);
    });

    // First Contentful Paint
    getFCP((metric) => {
      this.handleMetric('FCP', metric);
    });

    // Largest Contentful Paint
    getLCP((metric) => {
      this.handleMetric('LCP', metric);
    });

    // Time to First Byte
    getTTFB((metric) => {
      this.handleMetric('TTFB', metric);
    });
  }

  // Handle Core Web Vitals metrics
  handleMetric(name, metric) {
    this.metrics.set(name, {
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      timestamp: Date.now()
    });

    // Check if metric exceeds threshold
    if (this.shouldAlert(name, metric.value)) {
      this.sendAlert(name, metric.value);
    }

    // Send to analytics
    this.sendMetric(name, metric);
  }

  // Initialize custom metrics
  initCustomMetrics() {
    if (!this.config.trackCustomMetrics) return;

    // Page Load Time
    this.observePageLoad();

    // Resource Loading Times
    this.observeResourceLoading();

    // JavaScript Execution Time
    this.observeJavaScriptExecution();

    // Memory Usage
    this.observeMemoryUsage();

    // API Response Times
    this.observeAPIResponseTimes();
  }

  // Observe page load metrics
  observePageLoad() {
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0];

      if (navEntry) {
        this.customMetrics.push({
          name: 'domComplete',
          value: navEntry.domComplete,
          unit: 'ms'
        });

        this.customMetrics.push({
          name: 'loadEventEnd',
          value: navEntry.loadEventEnd,
          unit: 'ms'
        });

        this.customMetrics.push({
          name: 'redirectTime',
          value: navEntry.redirectEnd - navEntry.redirectStart,
          unit: 'ms'
        });

        this.customMetrics.push({
          name: 'dnsLookupTime',
          value: navEntry.domainLookupEnd - navEntry.domainLookupStart,
          unit: 'ms'
        });

        this.customMetrics.push({
          name: 'tcpConnectionTime',
          value: navEntry.connectEnd - navEntry.connectStart,
          unit: 'ms'
        });

        this.customMetrics.push({
          name: 'serverResponseTime',
          value: navEntry.responseEnd - navEntry.requestStart,
          unit: 'ms'
        });

        this.customMetrics.push({
          name: 'domProcessingTime',
          value: navEntry.domComplete - navEntry.domLoading,
          unit: 'ms'
        });
      }
    }
  }

  // Observe resource loading
  observeResourceLoading() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          if (entry.duration > 1000) { // Only log slow resources
            this.customMetrics.push({
              name: 'slowResource',
              value: entry.duration,
              unit: 'ms',
              details: {
                name: entry.name,
                type: entry.initiatorType,
                size: entry.transferSize || 0
              }
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Observe JavaScript execution
  observeJavaScriptExecution() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('js-')) {
            this.customMetrics.push({
              name: 'jsExecutionTime',
              value: entry.duration,
              unit: 'ms',
              details: {
                measure: entry.name
              }
            });
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
    }
  }

  // Observe memory usage
  observeMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;

        this.customMetrics.push({
          name: 'memoryUsage',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          details: {
            totalHeapSize: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
        });
      }, 30000); // Every 30 seconds
    }
  }

  // Observe API response times
  observeAPIResponseTimes() {
    // Override fetch to track API calls
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Track only API calls
        if (args[0].includes('/api/')) {
          this.customMetrics.push({
            name: 'apiResponseTime',
            value: duration,
            unit: 'ms',
            details: {
              url: args[0],
              status: response.status,
              success: response.ok
            }
          });
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.customMetrics.push({
          name: 'apiError',
          value: duration,
          unit: 'ms',
          details: {
            url: args[0],
            error: error.message
          }
        });

        throw error;
      }
    };
  }

  // Initialize network monitoring
  initNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = navigator.connection;

      this.sendNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });

      connection.addEventListener('change', () => {
        this.sendNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      });
    }

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.sendNetworkStatus('online');
    });

    window.addEventListener('offline', () => {
      this.sendNetworkStatus('offline');
    });
  }

  // Initialize error tracking
  initErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.sendError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.sendError({
        type: 'promise',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack
      });
    });
  }

  // Initialize user behavior tracking
  initUserBehaviorTracking() {
    // Page visibility
    document.addEventListener('visibilitychange', () => {
      this.sendUserAction({
        type: 'visibility_change',
        state: document.visibilityState
      });
    });

    // Page engagement time
    let startTime = Date.now();
    let totalEngagementTime = 0;

    const trackEngagement = () => {
      if (document.visibilityState === 'visible') {
        totalEngagementTime += Date.now() - startTime;
        startTime = Date.now();
      } else {
        startTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', trackEngagement);

    // Send engagement time on page unload
    window.addEventListener('beforeunload', () => {
      if (document.visibilityState === 'visible') {
        totalEngagementTime += Date.now() - startTime;
      }

      this.sendUserAction({
        type: 'engagement_time',
        duration: totalEngagementTime,
        unit: 'ms'
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollDepth = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      );

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }
    };

    window.addEventListener('scroll', this.throttle(trackScrollDepth, 100));

    // Send scroll depth on page unload
    window.addEventListener('beforeunload', () => {
      this.sendUserAction({
        type: 'scroll_depth',
        depth: maxScrollDepth,
        unit: 'percent'
      });
    });
  }

  // Send metric to analytics
  async sendMetric(name, metric) {
    if (Math.random() > this.config.performanceSampleRate) return;

    try {
      await fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'performance_metric',
          metric: name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logError('Failed to send metric', error);
    }
  }

  // Send custom metrics
  async sendCustomMetrics() {
    if (this.customMetrics.length === 0) return;

    try {
      await fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'custom_metrics',
          metrics: this.customMetrics,
          url: window.location.href,
          timestamp: Date.now()
        })
      });

      this.customMetrics = []; // Clear sent metrics
    } catch (error) {
      this.logError('Failed to send custom metrics', error);
    }
  }

  // Send network information
  async sendNetworkInfo(networkInfo) {
    try {
      await fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'network_info',
          data: networkInfo,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logError('Failed to send network info', error);
    }
  }

  // Send error information
  async sendError(errorInfo) {
    try {
      await fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'error',
          data: errorInfo,
          url: window.location.href,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logError('Failed to send error', error);
    }
  }

  // Send user action
  async sendUserAction(action) {
    try {
      await fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'user_action',
          action: action,
          url: window.location.href,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logError('Failed to send user action', error);
    }
  }

  // Send network status
  async sendNetworkStatus(status) {
    try {
      await fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'network_status',
          status: status,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logError('Failed to send network status', error);
    }
  }

  // Send alert for performance issues
  async sendAlert(metricName, value) {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'performance_alert',
          metric: metricName,
          value: value,
          threshold: this.getThreshold(metricName),
          url: window.location.href,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logError('Failed to send alert', error);
    }
  }

  // Check if metric should trigger alert
  shouldAlert(metricName, value) {
    return value > this.getThreshold(metricName);
  }

  // Get threshold for metric
  getThreshold(metricName) {
    const thresholds = {
      'LCP': this.config.lcpThreshold,
      'FID': this.config.fidThreshold,
      'CLS': this.config.clsThreshold,
      'TTFB': this.config.ttfbThreshold
    };

    return thresholds[metricName] || Infinity;
  }

  // Utility: Throttle function
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;

    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Utility: Log message
  log(message) {
    if (this.config.debugMode) {
      console.log(`[Performance Monitor] ${message}`);
    }
  }

  // Utility: Log error
  logError(message, error) {
    if (this.config.debugMode) {
      console.error(`[Performance Monitor] ${message}:`, error);
    }
  }

  // Get current metrics
  getMetrics() {
    return {
      coreWebVitals: Object.fromEntries(this.metrics),
      customMetrics: this.customMetrics
    };
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getMetrics();

    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      coreWebVitals: metrics.coreWebVitals,
      customMetrics: metrics.customMetrics.slice(-10), // Last 10 custom metrics
      performanceScore: this.calculatePerformanceScore(metrics.coreWebVitals)
    };
  }

  // Calculate overall performance score
  calculatePerformanceScore(coreWebVitals) {
    const weights = {
      'LCP': 0.25,
      'FID': 0.30,
      'CLS': 0.25,
      'FCP': 0.15,
      'TTFB': 0.05
    };

    const thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      const value = coreWebVitals[metric]?.value;

      if (value !== undefined) {
        const threshold = thresholds[metric];
        let score = 100;

        if (value >= threshold.poor) {
          score = 50;
        } else if (value >= threshold.good) {
          score = 75;
        }

        totalScore += score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor({
  debugMode: process.env.NODE_ENV === 'development',
  performanceSampleRate: 1.0,
  trackCustomMetrics: true
});

// Export for use in other modules
export { PerformanceMonitor, performanceMonitor };