#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const imageminAvif = require('imagemin-avif');

const WEBSITE_DIR = path.join(__dirname, '../website');
const OUTPUT_DIR = path.join(__dirname, '../dist/assets/images');

// Configuration
const CONFIG = {
  // JPEG optimization
  mozjpeg: {
    quality: 85,
    progressive: true
  },

  // PNG optimization
  pngquant: {
    quality: [0.8, 0.9]
  },

  // SVG optimization
  svgo: {
    plugins: [
      {
        name: 'removeDoctype',
        active: true
      },
      {
        name: 'removeXMLProcInst',
        active: true
      },
      {
        name: 'removeComments',
        active: true
      },
      {
        name: 'removeMetadata',
        active: true
      },
      {
        name: 'removeUselessDefs',
        active: true
      },
      {
        name: 'cleanupIDs',
        active: true
      },
      {
        name: 'minifyStyles',
        active: true
      },
      {
        name: 'convertPathData',
        active: true
      },
      {
        name: 'mergePaths',
        active: true
      },
      {
        name: 'removeUnusedNS',
        active: true
      },
      {
        name: 'sortAttrs',
        active: true
      },
      {
        name: 'removeEmptyAttrs',
        active: true
      },
      {
        name: 'removeEmptyContainers',
        active: true
      },
      {
        name: 'cleanupNumericValues',
        active: true
      },
      {
        name: 'removeEditorsNSData',
        active: true
      },
      {
        name: 'removeEmptyText',
        active: true
      },
      {
        name: 'removeEmptyAttrs',
        active: true
      },
      {
        name: 'removeViewBox',
        active: false
      }
    ]
  },

  // WebP generation
  webp: {
    quality: 80,
    method: 6
  },

  // AVIF generation (for modern browsers)
  avif: {
    quality: 50,
    speed: 6
  }
};

// Get all image files recursively
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else if (/\.(jpe?g|png|gif|webp|avif|svg)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Create responsive image variants
async function createResponsiveVariants(imagePath, buffer) {
  const ext = path.extname(imagePath).toLowerCase();
  const name = path.basename(imagePath, ext);
  const relativePath = path.relative(WEBSITE_DIR, imagePath);
  const outputDir = path.join(OUTPUT_DIR, path.dirname(relativePath));

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  const variants = [];

  if (/\.(jpe?g|png)$/i.test(ext)) {
    // Generate WebP version
    try {
      const webpBuffer = await imagemin.buffer(buffer, {
        plugins: [
          imageminWebp(CONFIG.webp)
        ]
      });

      const webpPath = path.join(outputDir, `${name}.webp`);
      fs.writeFileSync(webpPath, webpBuffer);
      variants.push(webpPath);
    } catch (error) {
      console.warn(`Failed to create WebP version for ${imagePath}:`, error.message);
    }

    // Generate AVIF version (for modern browsers)
    try {
      const avifBuffer = await imagemin.buffer(buffer, {
        plugins: [
          imageminAvif(CONFIG.avif)
        ]
      });

      const avifPath = path.join(outputDir, `${name}.avif`);
      fs.writeFileSync(avifPath, avifBuffer);
      variants.push(avifPath);
    } catch (error) {
      console.warn(`Failed to create AVIF version for ${imagePath}:`, error.message);
    }
  }

  return variants;
}

// Optimize a single image
async function optimizeImage(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    let plugins = [];

    // Select optimization plugins based on file type
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        plugins = [
          imageminMozjpeg(CONFIG.mozjpeg)
        ];
        break;
      case '.png':
        plugins = [
          imageminPngquant(CONFIG.pngquant)
        ];
        break;
      case '.svg':
        plugins = [
          imageminSvgo(CONFIG.svgo)
        ];
        break;
      case '.webp':
        // WebP is already compressed, just optimize slightly
        plugins = [
          imageminWebp(CONFIG.webp)
        ];
        break;
      default:
        console.log(`Skipping unsupported image format: ${imagePath}`);
        return null;
    }

    // Read and optimize image
    const buffer = fs.readFileSync(imagePath);
    const optimizedBuffer = await imagemin.buffer(buffer, { plugins });

    // Calculate compression ratio
    const originalSize = buffer.length;
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    console.log(`✅ Optimized ${imagePath}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`   Compression: ${compressionRatio}%`);

    // Create responsive variants
    const variants = await createResponsiveVariants(imagePath, optimizedBuffer);

    // Write optimized file
    const relativePath = path.relative(WEBSITE_DIR, imagePath);
    const outputPath = path.join(OUTPUT_DIR, relativePath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, optimizedBuffer);

    return {
      original: {
        path: imagePath,
        size: originalSize
      },
      optimized: {
        path: outputPath,
        size: optimizedSize
      },
      variants: variants,
      compressionRatio: parseFloat(compressionRatio)
    };

  } catch (error) {
    console.error(`❌ Failed to optimize ${imagePath}:`, error.message);
    return null;
  }
}

// Generate image optimization report
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalImages: results.length,
    successfulOptimizations: results.filter(r => r !== null).length,
    totalOriginalSize: results.reduce((sum, r) => sum + (r?.original.size || 0), 0),
    totalOptimizedSize: results.reduce((sum, r) => sum + (r?.optimized.size || 0), 0),
    details: results.map(r => ({
      file: r?.optimized.path,
      originalSize: r?.original.size || 0,
      optimizedSize: r?.optimized.size || 0,
      compressionRatio: r?.compressionRatio || 0,
      variants: r?.variants?.length || 0
    }))
  };

  const totalSaved = report.totalOriginalSize - report.totalOptimizedSize;
  const totalSavedPercent = ((totalSaved / report.totalOriginalSize) * 100).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('🖼️  IMAGE OPTIMIZATION REPORT');
  console.log('='.repeat(60));
  console.log(`Total Images Processed: ${report.totalImages}`);
  console.log(`Successful Optimizations: ${report.successfulOptimizations}`);
  console.log(`Total Original Size: ${(report.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Optimized Size: ${(report.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${totalSavedPercent}%)`);
  console.log('='.repeat(60));

  // Save detailed report
  const reportPath = path.join(__dirname, '../dist/image-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Detailed report saved to: ${reportPath}`);

  return report;
}

// Main optimization function
async function optimizeImages() {
  try {
    console.log('🚀 Starting image optimization...');

    // Get all image files
    const imageFiles = getImageFiles(WEBSITE_DIR);
    console.log(`📁 Found ${imageFiles.length} image files`);

    // Filter out already optimized files in dist directory
    const filesToOptimize = imageFiles.filter(file => {
      return !file.includes('node_modules') && !file.includes('dist');
    });

    console.log(`📋 Processing ${filesToOptimize.length} files...`);

    // Optimize images in batches to prevent memory issues
    const BATCH_SIZE = 10;
    const results = [];

    for (let i = 0; i < filesToOptimize.length; i += BATCH_SIZE) {
      const batch = filesToOptimize.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(file => optimizeImage(file));
      const batchResults = await Promise.all(batchPromises);

      results.push(...batchResults);

      // Progress indicator
      const progress = Math.min(i + BATCH_SIZE, filesToOptimize.length);
      console.log(`🔄 Progress: ${progress}/${filesToOptimize.length} files processed`);
    }

    // Generate and display report
    const report = generateReport(results);

    // Create picture element templates for responsive images
    generatePictureTemplates(results);

    console.log('\n✨ Image optimization completed successfully!');
    return report;

  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    process.exit(1);
  }
}

// Generate <picture> element templates for responsive images
function generatePictureTemplates(results) {
  const templates = results
    .filter(r => r !== null && r.variants.length > 0)
    .map(r => {
      const relativePath = path.relative(OUTPUT_DIR, r.optimized.path);
      const name = path.basename(r.optimized.path, path.extname(r.optimized.path));
      const webpVariant = r.variants.find(v => v.endsWith('.webp'));
      const avifVariant = r.variants.find(v => v.endsWith('.avif'));

      let template = `<!-- ${name} Responsive Image -->\n<picture>\n`;

      if (avifVariant) {
        const avifRelative = path.relative(OUTPUT_DIR, avifVariant);
        template += `  <source srcset="/assets/${avifRelative}" type="image/avif">\n`;
      }

      if (webpVariant) {
        const webpRelative = path.relative(OUTPUT_DIR, webpVariant);
        template += `  <source srcset="/assets/${webpRelative}" type="image/webp">\n`;
      }

      template += `  <img src="/assets/${relativePath}" alt="${name}" loading="lazy">\n`;
      template += `</picture>`;

      return template;
    });

  if (templates.length > 0) {
    const templatesPath = path.join(__dirname, '../dist/responsive-image-templates.html');
    fs.writeFileSync(templatesPath, templates.join('\n\n') + '\n');
    console.log(`🎨 Responsive image templates saved to: ${templatesPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages()
    .then(() => {
      console.log('🎉 All images optimized!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Optimization failed:', error);
      process.exit(1);
    });
}

module.exports = { optimizeImages, createResponsiveVariants };