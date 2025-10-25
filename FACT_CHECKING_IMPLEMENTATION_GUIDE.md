# Implementation Guide for Academic Fact-Checking System

## Quick Start Implementation

### Step 1: System Setup (30 minutes)

1. **Install Dependencies**
```bash
# Navigate to fact-checking tools directory
cd fact_checking_tools/

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import requests, asyncio; print('Dependencies installed successfully')"
```

2. **Configuration Setup**
```bash
# Copy configuration template
cp config_template.json config.json

# Edit configuration with your settings
nano config.json
```

3. **Directory Structure**
```bash
# Create processing directories
mkdir -p input output temp logs archive
```

### Step 2: Test Single Document (5 minutes)

```bash
# Test with an existing chapter
python automated_fact_checker.py ../01-multidimensional-perspectives.md \
    --output test_fact_check.json \
    --config config.json \
    --verbose

# Run medical validation
python medical_content_validator.py ../01-multidimensional-perspectives.md \
    --output test_medical.json \
    --jurisdiction FDA \
    --verbose
```

### Step 3: Full Project Processing (10-30 minutes depending on size)

```bash
# Process all chapters
python implementation_pipeline.py ../ output/ \
    --config config.json \
    --jurisdiction FDA \
    --parallel 2 \
    --quality-threshold 75.0 \
    --pattern "*.md" \
    --verbose
```

## Detailed Implementation Steps

### Phase 1: Preparation and Setup

#### 1.1 Environment Preparation
```bash
# Create virtual environment (recommended)
python -m venv fact_checking_env
source fact_checking_env/bin/activate  # Linux/Mac
# fact_checking_env\Scripts\activate  # Windows

# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install python3-dev python3-pip

# Install Python packages
pip install --upgrade pip
pip install -r fact_checking_tools/requirements.txt
```

#### 1.2 API Key Setup (Optional but Recommended)

**PubMed (NCBI) API:**
1. Visit https://www.ncbi.nlm.nih.gov/account/
2. Create NCBI account
3. Generate API key in account settings
4. Add to config.json under `api_keys.pubmed`

**CrossRef API:**
1. Visit https://www.crossref.org/services/api/
2. Register for free API access
3. Add to config.json under `api_keys.crossref`

#### 1.3 Custom Configuration
```json
{
    "quality_thresholds": {
        "minimum_score": 80,  // Adjust for your standards
        "excellent_score": 95
    },
    "medical_validation": {
        "strict_compliance": true,
        "default_jurisdiction": "FDA"
    },
    "processing": {
        "parallel_processing": 4  // Adjust based on your system
    }
}
```

### Phase 2: Single Document Testing

#### 2.1 Basic Fact-Checking Test
```python
#!/usr/bin/env python3
# test_single_document.py

from automated_fact_checker import AutomatedFactChecker
import json

# Initialize checker
checker = AutomatedFactChecker('config.json')

# Read test document
with open('../01-multidimensional-perspectives.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Perform fact-checking
results = checker.check_document(text)

# Save results
with open('test_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False, default=str)

print(f"Fact-checking completed. Quality score: {results['quality_score']['total_score']}")
```

#### 2.2 Medical Validation Test
```python
#!/usr/bin/env python3
# test_medical_validation.py

from medical_content_validator import MedicalContentValidator
import json

# Initialize validator
validator = MedicalContentValidator()

# Read test document
with open('../01-multidimensional-perspectives.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Perform validation
results = validator.validate_document(text, 'FDA')

# Save results
with open('medical_validation_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False, default=str)

print(f"Medical validation completed. Compliance score: {results['compliance_score']}")
```

#### 2.3 Quality Scoring Test
```python
#!/usr/bin/env python3
# test_quality_scoring.py

from quality_scoring_system import QualityScoringSystem
import json

# Initialize scorer
scorer = QualityScoringSystem()

# Load previous results
with open('test_results.json', 'r') as f:
    fact_results = json.load(f)

with open('medical_validation_results.json', 'r') as f:
    medical_results = json.load(f)

# Prepare content analysis
content_analysis = {
    'sources': [
        {
            'text': citation.get('citation', ''),
            'peer_reviewed': citation.get('valid', False),
            'impact_factor': 2.5,
            'publication_year': 2023,
            'author_credentials': ['MD', 'PhD'],
            'potential_biases': []
        }
        for citation in fact_results.get('citation_checks', [])
        if citation.get('valid', False)
    ],
    'methodology': {
        'design': 'observational',
        'sample_size': 100,
        'control_group': False,
        'randomization': False,
        'blinding': 'none'
    },
    'evidence': [
        {'text': claim['claim']}
        for claim in fact_results.get('fact_checks', [])
        if claim.get('is_valid', False)
    ],
    'citations': fact_results.get('citation_checks', []),
    'interpretations': fact_results.get('fact_checks', [])
}

# Calculate quality score
quality_results = scorer.calculate_comprehensive_score(content_analysis)

print(f"Quality Assessment:")
print(f"  Total Score: {quality_results['total_score']}/100")
print(f"  Quality Level: {quality_results['quality_level']}")
print(f"  Strengths: {len(quality_results['strengths'])}")
print(f"  Weaknesses: {len(quality_results['weaknesses'])}")
```

### Phase 3: Full Project Processing

#### 3.1 Pipeline Execution
```bash
# Basic execution
python implementation_pipeline.py ../ output/ \
    --config config.json

# Advanced execution with custom settings
python implementation_pipeline.py ../ output/ \
    --config config.json \
    --jurisdiction FDA \
    --parallel 4 \
    --quality-threshold 80.0 \
    --pattern "*.md" \
    --verbose \
    --no-archive
```

#### 3.2 Monitoring Progress
```bash
# Monitor log file in real-time
tail -f fact_checking_pipeline.log

# Check intermediate results
ls -la temp/

# Monitor processing progress
watch -n 5 'ls -la output/reports/ | wc -l'
```

#### 3.3 Batch Processing Script
```bash
#!/bin/bash
# batch_process.sh

echo "Starting Medical Aesthetics Fact-Checking Pipeline"
echo "Timestamp: $(date)"
echo "Configuration: config.json"
echo ""

# Create backup of existing results
if [ -d "output" ]; then
    echo "Creating backup of existing results..."
    cp -r output output_backup_$(date +%Y%m%d_%H%M%S)
fi

# Run pipeline
python implementation_pipeline.py ../ output/ \
    --config config.json \
    --jurisdiction FDA \
    --parallel 3 \
    --quality-threshold 75.0 \
    --pattern "*.md" \
    --verbose

# Generate summary
echo ""
echo "Processing completed at: $(date)"
echo "Results saved in: output/"
echo "Summary report: output/pipeline_summary_*.md"
echo "Quality dashboard: output/quality_dashboard_*.json"
```

## Integration with Existing Workflows

### 1. Git Integration

#### Pre-commit Hook
```bash
# .git/hooks/pre-commit
#!/bin/bash

# Run fact-checking on changed markdown files
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep '\.md$')

if [ -n "$changed_files" ]; then
    echo "Running fact-checking on modified files..."

    for file in $changed_files; do
        echo "Checking $file..."
        python fact_checking_tools/automated_fact_checker.py "$file" --output /tmp/check_$file.json

        # Check quality score (adjust threshold as needed)
        score=$(python -c "
import json
with open('/tmp/check_$file.json', 'r') as f:
    data = json.load(f)
print(data.get('quality_score', {}).get('total_score', 0))
")

        if [ "$score" -lt 70 ]; then
            echo "ERROR: $file has quality score below threshold ($score < 70)"
            echo "Please review and improve the content before committing."
            exit 1
        fi
    done

    echo "All files passed fact-checking."
fi

exit 0
```

#### GitHub Actions Integration
```yaml
# .github/workflows/fact-check.yml
name: Academic Fact-Checking

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  fact-check:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'

    - name: Install dependencies
      run: |
        cd fact_checking_tools
        pip install -r requirements.txt

    - name: Run fact-checking pipeline
      run: |
        cd fact_checking_tools
        python implementation_pipeline.py ../ output/ \
          --config config_template.json \
          --quality-threshold 75.0 \
          --pattern "*.md"

    - name: Upload results
      uses: actions/upload-artifact@v3
      with:
        name: fact-checking-results
        path: fact_checking_tools/output/
```

### 2. Content Management System Integration

#### WordPress Plugin Example
```php
<?php
// Plugin Name: Medical Content Fact-Checker
// Description: Validates medical content before publishing

add_action('save_post', 'validate_medical_content');

function validate_medical_content($post_id) {
    // Only validate medical content
    if (get_post_type($post_id) != 'medical_article') {
        return;
    }

    // Get content
    $content = get_post_field('post_content', $post_id);

    // Call Python fact-checker
    $result = shell_exec(
        "python3 /path/to/fact_checking_tools/automated_fact_checker.py " .
        "--content '" . escapeshellarg($content) . "' " .
        "--output /tmp/check_$post_id.json"
    );

    // Parse results
    $results = json_decode(file_get_contents("/tmp/check_$post_id.json"), true);
    $quality_score = $results['quality_score']['total_score'] ?? 0;

    if ($quality_score < 75) {
        // Prevent publication
        remove_action('save_post', 'validate_medical_content');
        wp_update_post([
            'ID' => $post_id,
            'post_status' => 'draft'
        ]);
        add_action('save_post', 'validate_medical_content');

        // Add notice
        update_option('fact_check_error_' . $post_id,
            "Content quality score ($quality_score) is below required threshold (75)");
    }
}
```

## Performance Optimization

### 1. Parallel Processing Configuration

```python
# Optimize based on your system
import multiprocessing

# Determine optimal parallel processing
cpu_count = multiprocessing.cpu_count()
optimal_workers = min(cpu_count - 1, 4)  # Leave one CPU free

config = {
    "processing": {
        "parallel_processing": optimal_workers,
        "api_rate_limit_delay": 0.5,  # Reduce if rate limits allow
        "batch_size": 10  # Process in batches
    }
}
```

### 2. Caching Implementation

```python
# Add caching for API responses
import pickle
from pathlib import Path

class CachedAPIClient:
    def __init__(self, cache_dir="cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)

    def get_cached_response(self, endpoint, params):
        cache_key = f"{endpoint}_{hash(str(params))}.pkl"
        cache_file = self.cache_dir / cache_key

        if cache_file.exists():
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
        return None

    def cache_response(self, endpoint, params, response):
        cache_key = f"{endpoint}_{hash(str(params))}.pkl"
        cache_file = self.cache_dir / cache_key

        with open(cache_file, 'wb') as f:
            pickle.dump(response, f)
```

### 3. Memory Optimization

```python
# Process large files in chunks
def process_large_file(file_path, chunk_size=10000):
    """Process large files in chunks to reduce memory usage"""

    with open(file_path, 'r', encoding='utf-8') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break

            # Process chunk
            results = process_chunk(chunk)
            yield results

            # Clear memory
            del chunk
            del results
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. API Rate Limiting
```bash
# Problem: Too many API requests
# Solution: Reduce parallel processing and increase delays
python implementation_pipeline.py input output \
    --parallel 1 \
    --config config_with_delays.json
```

#### 2. Encoding Issues
```python
# Handle different text encodings
def read_file_with_encoding(file_path):
    encodings = ['utf-8', 'gbk', 'latin-1', 'cp1252']

    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            continue

    raise ValueError(f"Could not decode file {file_path}")
```

#### 3. Memory Issues
```bash
# Monitor memory usage
python -m memory_profiler implementation_pipeline.py input output

# Process files individually if memory is limited
for file in input/*.md; do
    python automated_fact_checker.py "$file" --output "output/$(basename $file .md)_results.json"
done
```

#### 4. Network Issues
```python
# Add robust error handling with retries
import time
from requests.exceptions import RequestException

def robust_api_call(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait_time = (2 ** attempt)  # Exponential backoff
            time.sleep(wait_time)
```

### Performance Monitoring

#### 1. Logging Configuration
```python
import logging

# Enhanced logging for monitoring
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('fact_checking.log'),
        logging.StreamHandler(),
        logging.handlers.RotatingFileHandler(
            'fact_checking_rotated.log', maxBytes=10*1024*1024, backupCount=5
        )
    ]
)
```

#### 2. Performance Metrics
```python
import time
import psutil
import os

def monitor_performance(func):
    """Decorator to monitor function performance"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024

        result = func(*args, **kwargs)

        end_time = time.time()
        end_memory = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024

        logging.info(f"Performance: {func.__name__} took {end_time - start_time:.2f}s, "
                    f"memory used: {end_memory - start_memory:.2f}MB")

        return result
    return wrapper
```

## Maintenance and Updates

### 1. Regular Maintenance Tasks

```bash
#!/bin/bash
# maintenance.sh

echo "Starting fact-checking system maintenance..."

# Clean temporary files
find temp/ -name "*.tmp" -mtime +7 -delete
find logs/ -name "*.log.*" -mtime +30 -delete

# Update terminology database
python -c "
from medical_content_validator import MedicalTerminologyDatabase
db = MedicalTerminologyDatabase()
print('Terminology database updated')
"

# Test system functionality
python -c "
from automated_fact_checker import AutomatedFactChecker
checker = AutomatedFactChecker('config.json')
print('System functionality test passed')
"

echo "Maintenance completed at: $(date)"
```

### 2. Update Schedule

**Weekly Tasks:**
- Review processing logs for errors
- Update terminology database
- Clean temporary files

**Monthly Tasks:**
- Update API endpoints and authentication
- Review and adjust quality thresholds
- Update regulatory compliance rules

**Quarterly Tasks:**
- Review and optimize performance
- Update system dependencies
- Analyze quality trends and patterns

### 3. Backup Strategy

```bash
#!/bin/bash
# backup_system.sh

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup configuration
cp config.json "$BACKUP_DIR/"

# Backup results
cp -r output/ "$BACKUP_DIR/results"

# Backup logs
cp -r logs/ "$BACKUP_DIR/logs"

# Create archive
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup created: ${BACKUP_DIR}.tar.gz"
```

This implementation guide provides a comprehensive roadmap for deploying and maintaining the academic fact-checking system. The system is designed to be scalable, maintainable, and adaptable to your specific requirements and workflow.