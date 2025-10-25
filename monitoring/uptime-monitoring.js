// Uptime and Availability Monitoring for Medical Aesthetics Psychology Website
// Monitors website availability, performance, and external dependencies

class UptimeMonitor {
  constructor(config = {}) {
    this.config = {
      // Monitoring endpoints
      endpoints: config.endpoints || [
        {
          name: 'Main Website',
          url: 'https://medical-aesthetics-psychology.com',
          method: 'GET',
          expectedStatus: 200,
          timeout: 10000,
          critical: true
        },
        {
          name: 'API Health Check',
          url: 'https://medical-aesthetics-psychology.com/api/health',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000,
          critical: true
        },
        {
          name: 'CSS Assets',
          url: 'https://medical-aesthetics-psychology.com/assets/css/main.css',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000,
          critical: false
        },
        {
          name: 'JavaScript Assets',
          url: 'https://medical-aesthetics-psychology.com/assets/js/main.js',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000,
          critical: false
        }
      ],

      // External services to monitor
      externalServices: config.externalServices || [
        {
          name: 'Google Fonts',
          url: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
          timeout: 5000
        },
        {
          name: 'Google Analytics',
          url: 'https://www.google-analytics.com/analytics.js',
          timeout: 5000
        },
        {
          name: 'CDN Check',
          url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
          timeout: 5000
        }
      ],

      // Monitoring intervals (in milliseconds)
      checkInterval: config.checkInterval || 60000, // 1 minute
      criticalCheckInterval: config.criticalCheckInterval || 30000, // 30 seconds
      externalCheckInterval: config.externalCheckInterval || 300000, // 5 minutes

      // Notification settings
      notificationThreshold: config.notificationThreshold || 2, // Number of consecutive failures before alerting
      alertCooldown: config.alertCooldown || 300000, // 5 minutes between alerts

      // Performance thresholds
      responseTimeThreshold: config.responseTimeThreshold || 2000, // 2 seconds
      performanceAlertThreshold: config.performanceAlertThreshold || 5000, // 5 seconds

      // API endpoints for notifications
      alertWebhook: config.alertWebhook || '/api/alerts',
      healthEndpoint: config.healthEndpoint || '/api/health/monitoring',

      // Logging
      enableLogging: config.enableLogging !== false,
      debugMode: config.debugMode || false
    };

    this.status = {
      endpoints: new Map(),
      externalServices: new Map(),
      lastCheck: null,
      monitoringActive: false
    };

    this.failureCounts = new Map();
    this.lastAlertTimes = new Map();
    this.metrics = {
      totalChecks: 0,
      successfulChecks: 0,
      failedChecks: 0,
      averageResponseTime: 0,
      uptime: 100
    };

    this.initializeStatus();
  }

  // Initialize status for all endpoints
  initializeStatus() {
    this.config.endpoints.forEach(endpoint => {
      this.status.endpoints.set(endpoint.name, {
        status: 'unknown',
        lastCheck: null,
        lastSuccess: null,
        lastFailure: null,
        responseTime: null,
        consecutiveFailures: 0,
        uptime: 0
      });

      this.failureCounts.set(endpoint.name, 0);
      this.lastAlertTimes.set(endpoint.name, 0);
    });

    this.config.externalServices.forEach(service => {
      this.status.externalServices.set(service.name, {
        status: 'unknown',
        lastCheck: null,
        lastSuccess: null,
        lastFailure: null,
        responseTime: null,
        availability: 0
      });
    });
  }

  // Start monitoring
  start() {
    if (this.status.monitoringActive) {
      this.log('Monitoring is already active');
      return;
    }

    this.log('Starting uptime monitoring');
    this.status.monitoringActive = true;
    this.status.lastCheck = new Date();

    // Start monitoring main endpoints
    this.startEndpointMonitoring();

    // Start monitoring external services
    this.startExternalServiceMonitoring();

    // Start metrics calculation
    this.startMetricsCalculation();
  }

  // Stop monitoring
  stop() {
    this.log('Stopping uptime monitoring');
    this.status.monitoringActive = false;

    // Clear all intervals
    if (this.endpointInterval) {
      clearInterval(this.endpointInterval);
    }

    if (this.externalInterval) {
      clearInterval(this.externalInterval);
    }

    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  // Start monitoring main endpoints
  startEndpointMonitoring() {
    // Perform initial check
    this.checkAllEndpoints();

    // Set up regular checks
    this.endpointInterval = setInterval(() => {
      this.checkAllEndpoints();
    }, this.config.checkInterval);

    // Set up critical endpoint checks
    const criticalEndpoints = this.config.endpoints.filter(ep => ep.critical);
    if (criticalEndpoints.length > 0) {
      setInterval(() => {
        this.checkCriticalEndpoints();
      }, this.config.criticalCheckInterval);
    }
  }

  // Start monitoring external services
  startExternalServiceMonitoring() {
    this.checkAllExternalServices();

    this.externalInterval = setInterval(() => {
      this.checkAllExternalServices();
    }, this.config.externalCheckInterval);
  }

  // Check all endpoints
  async checkAllEndpoints() {
    const checks = this.config.endpoints.map(endpoint => this.checkEndpoint(endpoint));
    const results = await Promise.allSettled(checks);

    this.processEndpointResults(results);
    this.updateMetrics();
  }

  // Check critical endpoints only
  async checkCriticalEndpoints() {
    const criticalEndpoints = this.config.endpoints.filter(ep => ep.critical);
    const checks = criticalEndpoints.map(endpoint => this.checkEndpoint(endpoint));
    const results = await Promise.allSettled(checks);

    this.processCriticalResults(results);
  }

  // Check all external services
  async checkAllExternalServices() {
    const checks = this.config.externalServices.map(service => this.checkExternalService(service));
    await Promise.allSettled(checks);
  }

  // Check a single endpoint
  async checkEndpoint(endpoint) {
    const startTime = Date.now();
    const endpointStatus = this.status.endpoints.get(endpoint.name);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout);

      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Uptime-Monitor/1.0'
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      const success = response.status === endpoint.expectedStatus;
      const status = success ? 'up' : 'down';

      this.updateEndpointStatus(endpoint.name, {
        status,
        lastCheck: new Date(),
        lastSuccess: success ? new Date() : endpointStatus.lastSuccess,
        lastFailure: !success ? new Date() : endpointStatus.lastFailure,
        responseTime,
        consecutiveFailures: success ? 0 : endpointStatus.consecutiveFailures + 1,
        uptime: success ? endpointStatus.uptime : 0
      });

      if (success) {
        this.log(`✅ ${endpoint.name} - ${responseTime}ms`);
        return { success: true, responseTime, status: response.status };
      } else {
        this.log(`❌ ${endpoint.name} - Status ${response.status}`);
        return { success: false, error: `HTTP ${response.status}` };
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;

      this.updateEndpointStatus(endpoint.name, {
        status: 'down',
        lastCheck: new Date(),
        lastFailure: new Date(),
        responseTime,
        consecutiveFailures: endpointStatus.consecutiveFailures + 1,
        uptime: 0
      });

      this.log(`❌ ${endpoint.name} - ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Check external service
  async checkExternalService(service) {
    const startTime = Date.now();
    const serviceStatus = this.status.externalServices.get(service.name);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), service.timeout);

      const response = await fetch(service.url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Uptime-Monitor/1.0'
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      const available = response.ok;
      const status = available ? 'available' : 'unavailable';

      this.updateExternalServiceStatus(service.name, {
        status,
        lastCheck: new Date(),
        lastSuccess: available ? new Date() : serviceStatus.lastSuccess,
        lastFailure: !available ? new Date() : serviceStatus.lastFailure,
        responseTime,
        availability: available ? 100 : 0
      });

      this.log(`${available ? '✅' : '⚠️'} External: ${service.name} - ${responseTime}ms`);

    } catch (error) {
      this.updateExternalServiceStatus(service.name, {
        status: 'unavailable',
        lastCheck: new Date(),
        lastFailure: new Date(),
        availability: 0
      });

      this.log(`⚠️ External: ${service.name} - ${error.message}`);
    }
  }

  // Update endpoint status
  updateEndpointStatus(name, updates) {
    const current = this.status.endpoints.get(name);
    this.status.endpoints.set(name, { ...current, ...updates });

    // Check if alert is needed
    if (updates.consecutiveFailures >= this.config.notificationThreshold) {
      const lastAlertTime = this.lastAlertTimes.get(name) || 0;
      const now = Date.now();

      if (now - lastAlertTime > this.config.alertCooldown) {
        this.sendAlert(name, updates);
        this.lastAlertTimes.set(name, now);
      }
    }

    // Check performance alerts
    if (updates.responseTime > this.config.performanceAlertThreshold) {
      this.sendPerformanceAlert(name, updates);
    }
  }

  // Update external service status
  updateExternalServiceStatus(name, updates) {
    const current = this.status.externalServices.get(name);
    this.status.externalServices.set(name, { ...current, ...updates });
  }

  // Process endpoint results
  processEndpointResults(results) {
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const endpoint = this.config.endpoints[index];
        this.log(`Failed to check ${endpoint.name}:`, result.reason);
      }
    });
  }

  // Process critical results
  processCriticalResults(results) {
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const endpoint = this.config.endpoints[index];
        this.sendCriticalAlert(endpoint, result.reason);
      }
    });
  }

  // Send alert for endpoint failure
  async sendAlert(endpointName, status) {
    const endpoint = this.config.endpoints.find(ep => ep.name === endpointName);
    const endpointStatus = this.status.endpoints.get(endpointName);

    try {
      await fetch(this.config.alertWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'endpoint_failure',
          severity: endpoint?.critical ? 'critical' : 'warning',
          endpoint: endpointName,
          url: endpoint?.url,
          consecutiveFailures: status.consecutiveFailures,
          lastFailure: status.lastFailure,
          timestamp: new Date().toISOString()
        })
      });

      this.log(`🚨 Alert sent for ${endpointName} - ${status.consecutiveFailures} consecutive failures`);

    } catch (error) {
      this.logError('Failed to send alert:', error);
    }
  }

  // Send critical alert
  async sendCriticalAlert(endpoint, error) {
    try {
      await fetch(this.config.alertWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'critical_failure',
          severity: 'critical',
          endpoint: endpoint.name,
          url: endpoint.url,
          error: error.message || 'Unknown error',
          timestamp: new Date().toISOString()
        })
      });

      this.log(`🚨 Critical alert sent for ${endpoint.name}`);

    } catch (alertError) {
      this.logError('Failed to send critical alert:', alertError);
    }
  }

  // Send performance alert
  async sendPerformanceAlert(endpointName, status) {
    try {
      await fetch(this.config.alertWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'performance_alert',
          severity: 'warning',
          endpoint: endpointName,
          responseTime: status.responseTime,
          threshold: this.config.performanceAlertThreshold,
          timestamp: new Date().toISOString()
        })
      });

      this.log(`⚡ Performance alert sent for ${endpointName} - ${status.responseTime}ms`);

    } catch (error) {
      this.logError('Failed to send performance alert:', error);
    }
  }

  // Update overall metrics
  updateMetrics() {
    const endpointStatuses = Array.from(this.status.endpoints.values());
    const totalEndpoints = endpointStatuses.length;
    const upEndpoints = endpointStatuses.filter(es => es.status === 'up').length;

    this.metrics.totalChecks++;
    this.metrics.failedChecks = endpointStatuses.filter(es => es.status === 'down').length;
    this.metrics.successfulChecks = this.metrics.totalChecks - this.metrics.failedChecks;
    this.metrics.uptime = totalEndpoints > 0 ? (upEndpoints / totalEndpoints) * 100 : 0;

    const responseTimes = endpointStatuses
      .map(es => es.responseTime)
      .filter(rt => rt !== null);

    if (responseTimes.length > 0) {
      this.metrics.averageResponseTime = responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length;
    }

    this.log(`Metrics updated: ${this.metrics.uptime.toFixed(1)}% uptime, ${this.metrics.averageResponseTime.toFixed(0)}ms avg response time`);
  }

  // Start metrics calculation
  startMetricsCalculation() {
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
      this.publishHealthStatus();
    }, 60000); // Every minute
  }

  // Publish health status
  async publishHealthStatus() {
    const healthData = {
      timestamp: new Date().toISOString(),
      monitoring: {
        active: this.status.monitoringActive,
        lastCheck: this.status.lastCheck
      },
      metrics: this.metrics,
      endpoints: Object.fromEntries(this.status.endpoints),
      externalServices: Object.fromEntries(this.status.externalServices)
    };

    try {
      await fetch(this.config.healthEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(healthData)
      });

    } catch (error) {
      this.logError('Failed to publish health status:', error);
    }
  }

  // Get current status
  getStatus() {
    return {
      monitoring: {
        active: this.status.monitoringActive,
        lastCheck: this.status.lastCheck
      },
      metrics: this.metrics,
      endpoints: Object.fromEntries(this.status.endpoints),
      externalServices: Object.fromEntries(this.status.externalServices)
    };
  }

  // Get detailed health report
  getHealthReport() {
    const report = {
      summary: {
        overallStatus: this.metrics.uptime >= 99 ? 'healthy' : this.metrics.uptime >= 95 ? 'degraded' : 'unhealthy',
        uptime: this.metrics.uptime,
        averageResponseTime: this.metrics.averageResponseTime,
        totalEndpoints: this.config.endpoints.length,
        upEndpoints: Array.from(this.status.endpoints.values()).filter(es => es.status === 'up').length
      },
      endpoints: Array.from(this.status.endpoints.entries()).map(([name, status]) => ({
        name,
        status: status.status,
        lastCheck: status.lastCheck,
        lastSuccess: status.lastSuccess,
        lastFailure: status.lastFailure,
        responseTime: status.responseTime,
        consecutiveFailures: status.consecutiveFailures,
        uptime: status.uptime
      })),
      externalServices: Array.from(this.status.externalServices.entries()).map(([name, status]) => ({
        name,
        status: status.status,
        availability: status.availability,
        responseTime: status.responseTime
      })),
      timestamp: new Date().toISOString()
    };

    return report;
  }

  // Utility: Log message
  log(...args) {
    if (this.config.enableLogging) {
      console.log(`[Uptime Monitor]`, ...args);
    }
  }

  // Utility: Log error
  logError(...args) {
    if (this.config.enableLogging) {
      console.error(`[Uptime Monitor]`, ...args);
    }
  }
}

// Create and configure the uptime monitor
const uptimeMonitor = new UptimeMonitor({
  debugMode: process.env.NODE_ENV === 'development',
  enableLogging: true,
  checkInterval: 60000, // 1 minute for development
  criticalCheckInterval: 30000, // 30 seconds
  externalCheckInterval: 300000 // 5 minutes
});

// Auto-start monitoring in production
if (process.env.NODE_ENV === 'production') {
  uptimeMonitor.start();
}

// Export for use in other modules
export { UptimeMonitor, uptimeMonitor };