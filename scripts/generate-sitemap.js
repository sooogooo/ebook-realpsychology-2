#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

const DOMAIN = 'https://medical-aesthetics-psychology.com'; // Replace with your domain
const OUTPUT_DIR = path.join(__dirname, '../dist');
const WEBSITE_DIR = path.join(__dirname, '../website');

// Function to get all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (path.extname(file) === '.html') {
      const relativePath = path.relative(WEBSITE_DIR, filePath);
      fileList.push(relativePath);
    }
  });

  return fileList;
}

// Function to get file modification time
function getLastModified(filePath) {
  try {
    const fullPath = path.join(WEBSITE_DIR, filePath);
    const stats = fs.statSync(fullPath);
    return stats.mtime.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

// Generate priority based on URL depth and importance
function getPriority(url) {
  if (url === 'index.html' || url === '') return 1.0;
  if (url.startsWith('00-') || url.startsWith('01-')) return 0.9;
  if (url.startsWith('0') && !url.startsWith('10-')) return 0.8;
  if (url.startsWith('10-')) return 0.8;
  if (url.includes('research')) return 0.7;
  return 0.6;
}

// Generate change frequency based on file type
function getChangeFreq(url) {
  if (url === 'index.html') return 'weekly';
  if (url.includes('research')) return 'monthly';
  return 'monthly';
}

async function generateSitemap() {
  try {
    console.log('🗺️  Generating sitemap...');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Get all HTML files
    const htmlFiles = getHtmlFiles(WEBSITE_DIR);

    // Create sitemap stream
    const sitemap = new SitemapStream({
      hostname: DOMAIN,
      xmlns: {
        news: false,
        xhtml: true,
        image: true,
        video: false
      }
    });

    // Write sitemap entries
    const writeStream = fs.createWriteStream(path.join(OUTPUT_DIR, 'sitemap.xml'));
    sitemap.pipe(writeStream);

    // Add each HTML file to sitemap
    for (const file of htmlFiles) {
      const url = file.replace(/\.html$/, '');
      const fullUrl = url === 'index' ? '' : url;

      sitemap.write({
        url: fullUrl,
        changefreq: getChangeFreq(file),
        priority: getPriority(file),
        lastmod: getLastModified(file),
        img: []
      });
    }

    // Add additional important URLs (like assessment tools, etc.)
    const additionalUrls = [
      {
        url: 'psychological-assessment',
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      },
      {
        url: 'technology-timeline',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: 'cultural-comparison',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      }
    ];

    additionalUrls.forEach(entry => {
      sitemap.write(entry);
    });

    // Close the stream
    sitemap.end();

    // Wait for stream to finish
    await streamToPromise(sitemap);

    // Create gzipped version
    const sitemapXml = fs.readFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'));
    const gzip = createGzip();
    const compressed = fs.createWriteStream(path.join(OUTPUT_DIR, 'sitemap.xml.gz'));
    gzip.pipe(compressed);
    gzip.end(sitemapXml);

    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 XML: ${path.join(OUTPUT_DIR, 'sitemap.xml')}`);
    console.log(`🗜️  Gzipped: ${path.join(OUTPUT_DIR, 'sitemap.xml.gz')}`);
    console.log(`📄 Total URLs: ${htmlFiles.length + additionalUrls.length}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${DOMAIN}/sitemap.xml
Sitemap: ${DOMAIN}/sitemap.xml.gz

# Crawl-delay for good bots
Crawl-delay: 1

# Disallow temp directories
Disallow: /tmp/
Disallow: /cache/
Disallow: /.well-known/

# Allow important assets
Allow: /assets/css/
Allow: /assets/js/
Allow: /assets/svg/
Allow: /assets/images/
Allow: /assets/fonts/

`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robotsTxt);
  console.log('🤖 Robots.txt generated successfully!');
}

// Run if called directly
if (require.main === module) {
  generateSitemap()
    .then(() => generateRobotsTxt())
    .then(() => {
      console.log('🎉 All SEO files generated successfully!');
    })
    .catch(console.error);
}

module.exports = { generateSitemap, generateRobotsTxt };