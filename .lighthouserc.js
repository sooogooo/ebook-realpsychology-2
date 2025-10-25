module.exports = {
  ci: {
    collect: {
      url: [
        'https://medical-aesthetics-psychology.com',
        'https://medical-aesthetics-psychology.com/psychological-assessment.html',
        'https://medical-aesthetics-psychology.com/technology-timeline.html',
        'https://medical-aesthetics-psychology.com/01-multidimensional-perspectives.html'
      ],
      startServerCommand: 'npm run serve:production',
      startServerReadyPattern: 'Available on:',
      startServerReadyTimeout: 30000,
      urlDiscovery: false,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        budgetPath: './lighthouse-budgets.json',
        onlyAudits: [
          'categories:performance',
          'categories:accessibility',
          'categories:best-practices',
          'categories:seo'
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'installable-manifest': ['off'],
        'works-offline': ['off'],
        'service-worker': ['off']
      }
    },
    upload: {
      target: 'temporary-public-storage',
      serverBaseUrl: 'https://lhci-runner.appspot.com'
    }
  }
};