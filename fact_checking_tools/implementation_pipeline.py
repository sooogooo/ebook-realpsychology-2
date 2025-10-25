#!/usr/bin/env python3
"""
Implementation Pipeline for Academic Fact-Checking System
Automated workflow for processing documents through complete fact-checking pipeline
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from pathlib import Path
import threading
import queue
import time

from automated_fact_checker import AutomatedFactChecker, FactCheckResult
from medical_content_validator import MedicalContentValidator
from quality_scoring_system import QualityScoringSystem, QualityReporter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('fact_checking_pipeline.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class PipelineConfig:
    """Configuration for the fact-checking pipeline"""
    input_directory: str
    output_directory: str
    temp_directory: str
    config_file: Optional[str] = None
    jurisdiction: str = 'FDA'
    parallel_processing: int = 3
    retry_attempts: int = 3
    api_rate_limit_delay: float = 1.0
    quality_threshold: float = 70.0
    generate_reports: bool = True
    archive_processed: bool = True

@dataclass
class ProcessingResult:
    """Result of processing a single document"""
    file_path: str
    status: str  # 'success', 'error', 'needs_review'
    timestamp: datetime
    processing_time: float
    fact_check_results: Optional[Dict] = None
    medical_validation_results: Optional[Dict] = None
    quality_score: Optional[float] = None
    error_message: Optional[str] = None
    recommendations: List[str] = None

class DocumentProcessor:
    """Process individual documents through the fact-checking pipeline"""

    def __init__(self, config: PipelineConfig):
        self.config = config
        self.fact_checker = AutomatedFactChecker(config.config_file)
        self.medical_validator = MedicalContentValidator()
        self.quality_scorer = QualityScoringSystem()
        self.quality_reporter = QualityReporter(self.quality_scorer)

    async def process_document(self, file_path: str) -> ProcessingResult:
        """Process a single document through the complete pipeline"""
        start_time = time.time()
        result = ProcessingResult(
            file_path=file_path,
            status='processing',
            timestamp=datetime.now(),
            processing_time=0.0,
            recommendations=[]
        )

        try:
            logger.info(f"Processing document: {file_path}")

            # Step 1: Read document
            text = await self._read_document(file_path)
            logger.info(f"Document read successfully: {len(text)} characters")

            # Step 2: Automated fact-checking
            logger.info("Starting automated fact-checking...")
            fact_check_results = await self._perform_fact_checking(text)
            result.fact_check_results = fact_check_results
            logger.info("Fact-checking completed")

            # Step 3: Medical content validation
            logger.info("Starting medical content validation...")
            medical_validation_results = await self._validate_medical_content(text)
            result.medical_validation_results = medical_validation_results
            logger.info("Medical validation completed")

            # Step 4: Quality scoring
            logger.info("Calculating quality score...")
            quality_score = await self._calculate_quality_score(
                fact_check_results, medical_validation_results
            )
            result.quality_score = quality_score
            logger.info(f"Quality score calculated: {quality_score}")

            # Step 5: Generate recommendations
            result.recommendations = self._generate_recommendations(result)

            # Determine status
            if quality_score >= self.config.quality_threshold:
                result.status = 'success'
            else:
                result.status = 'needs_review'

            result.processing_time = time.time() - start_time
            logger.info(f"Document processing completed in {result.processing_time:.2f} seconds")

        except Exception as e:
            logger.error(f"Error processing document {file_path}: {str(e)}")
            result.status = 'error'
            result.error_message = str(e)
            result.processing_time = time.time() - start_time

        return result

    async def _read_document(self, file_path: str) -> str:
        """Read document content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='gbk') as f:
                return f.read()

    async def _perform_fact_checking(self, text: str) -> Dict:
        """Perform automated fact-checking"""
        return self.fact_checker.check_document(text)

    async def _validate_medical_content(self, text: str) -> Dict:
        """Validate medical content"""
        return self.medical_validator.validate_document(text, self.config.jurisdiction)

    async def _calculate_quality_score(self, fact_results: Dict, medical_results: Dict) -> float:
        """Calculate comprehensive quality score"""
        # Prepare content analysis for quality scoring
        content_analysis = self._prepare_content_analysis(fact_results, medical_results)

        quality_results = self.quality_scorer.calculate_comprehensive_score(content_analysis)
        return quality_results['total_score']

    def _prepare_content_analysis(self, fact_results: Dict, medical_results: Dict) -> Dict:
        """Prepare content analysis data for quality scoring"""
        return {
            'sources': [
                {
                    'text': citation.get('citation', ''),
                    'peer_reviewed': citation.get('valid', False),
                    'impact_factor': 2.5,  # Default value
                    'publication_year': 2023,
                    'author_credentials': ['MD', 'PhD'],
                    'potential_biases': []
                }
                for citation in fact_results.get('citation_checks', [])
                if citation.get('valid', False)
            ],
            'methodology': {
                'design': 'observational',  # Simplified
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

    def _generate_recommendations(self, result: ProcessingResult) -> List[str]:
        """Generate comprehensive recommendations"""
        recommendations = []

        # Quality score recommendations
        if result.quality_score and result.quality_score < self.config.quality_threshold:
            recommendations.append(
                f"Quality score ({result.quality_score}) is below threshold ({self.config.quality_threshold}). "
                "Significant improvements needed."
            )

        # Medical validation recommendations
        if result.medical_validation_results:
            recommendations.extend(result.medical_validation_results.get('recommendations', []))

        # Fact-checking recommendations
        if result.fact_check_results:
            recommendations.extend(result.fact_check_results.get('recommendations', []))

        return recommendations

class PipelineManager:
    """Manage the overall fact-checking pipeline"""

    def __init__(self, config: PipelineConfig):
        self.config = config
        self.processor = DocumentProcessor(config)
        self.results: List[ProcessingResult] = []
        self.processing_queue = queue.Queue()
        self.setup_directories()

    def setup_directories(self):
        """Create necessary directories"""
        Path(self.config.output_directory).mkdir(parents=True, exist_ok=True)
        Path(self.config.temp_directory).mkdir(parents=True, exist_ok=True)
        Path(os.path.join(self.config.output_directory, 'reports')).mkdir(exist_ok=True)
        Path(os.path.join(self.config.output_directory, 'archive')).mkdir(exist_ok=True)

    async def run_pipeline(self, file_pattern: str = "*.md") -> Dict:
        """Run the complete fact-checking pipeline"""
        logger.info("Starting fact-checking pipeline")
        start_time = time.time()

        try:
            # Step 1: Discover files
            files_to_process = self._discover_files(file_pattern)
            logger.info(f"Found {len(files_to_process)} files to process")

            # Step 2: Process files
            if self.config.parallel_processing > 1:
                results = await self._process_files_parallel(files_to_process)
            else:
                results = await self._process_files_sequential(files_to_process)

            # Step 3: Generate reports
            if self.config.generate_reports:
                await self._generate_reports(results)

            # Step 4: Archive processed files
            if self.config.archive_processed:
                await self._archive_processed_files(results)

            # Step 5: Generate summary
            summary = self._generate_summary(results, time.time() - start_time)

            logger.info(f"Pipeline completed successfully in {time.time() - start_time:.2f} seconds")
            return summary

        except Exception as e:
            logger.error(f"Pipeline failed: {str(e)}")
            raise

    def _discover_files(self, pattern: str) -> List[str]:
        """Discover files to process"""
        input_path = Path(self.config.input_directory)
        files = list(input_path.glob(pattern))
        return [str(f) for f in files if f.is_file()]

    async def _process_files_sequential(self, files: List[str]) -> List[ProcessingResult]:
        """Process files sequentially"""
        results = []
        for file_path in files:
            result = await self.processor.process_document(file_path)
            results.append(result)

            # Save intermediate results
            await self._save_intermediate_result(result)

            # Rate limiting
            await asyncio.sleep(self.config.api_rate_limit_delay)

        return results

    async def _process_files_parallel(self, files: List[str]) -> List[ProcessingResult]:
        """Process files in parallel"""
        semaphore = asyncio.Semaphore(self.config.parallel_processing)

        async def process_with_semaphore(file_path: str) -> ProcessingResult:
            async with semaphore:
                result = await self.processor.process_document(file_path)
                await self._save_intermediate_result(result)
                await asyncio.sleep(self.config.api_rate_limit_delay)
                return result

        tasks = [process_with_semaphore(file_path) for file_path in files]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Handle exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append(ProcessingResult(
                    file_path=files[i],
                    status='error',
                    timestamp=datetime.now(),
                    processing_time=0.0,
                    error_message=str(result)
                ))
            else:
                processed_results.append(result)

        return processed_results

    async def _save_intermediate_result(self, result: ProcessingResult):
        """Save intermediate processing result"""
        filename = Path(result.file_path).stem + '_result.json'
        output_path = os.path.join(self.config.temp_directory, filename)

        result_data = asdict(result)
        result_data['timestamp'] = result.timestamp.isoformat()

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result_data, f, indent=2, ensure_ascii=False, default=str)

    async def _generate_reports(self, results: List[ProcessingResult]):
        """Generate comprehensive reports"""
        logger.info("Generating reports...")

        # Individual reports
        for result in results:
            await self._generate_individual_report(result)

        # Summary report
        await self._generate_summary_report(results)

        # Quality dashboard
        await self._generate_quality_dashboard(results)

    async def _generate_individual_report(self, result: ProcessingResult):
        """Generate report for individual document"""
        if not result.fact_check_results:
            return

        filename = Path(result.file_path).stem + '_report.md'
        output_path = os.path.join(self.config.output_directory, 'reports', filename)

        # Prepare content analysis for quality reporting
        content_analysis = self._processor._prepare_content_analysis(
            result.fact_check_results,
            result.medical_validation_results or {}
        )

        # Generate quality report
        report = self._processor.quality_reporter.generate_comprehensive_report(
            content_analysis, 'markdown'
        )

        # Add processing information
        header = f"""# {Path(result.file_path).name}

**Processing Date:** {result.timestamp.strftime('%Y-%m-%d %H:%M:%S')}
**Processing Time:** {result.processing_time:.2f} seconds
**Status:** {result.status.upper()}
**Quality Score:** {result.quality_score or 'N/A'}

---

"""

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(header + report)

    async def _generate_summary_report(self, results: List[ProcessingResult]):
        """Generate summary report for all documents"""
        filename = f'pipeline_summary_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md'
        output_path = os.path.join(self.config.output_directory, filename)

        # Calculate statistics
        total_files = len(results)
        successful = len([r for r in results if r.status == 'success'])
        needs_review = len([r for r in results if r.status == 'needs_review'])
        errors = len([r for r in results if r.status == 'error'])

        quality_scores = [r.quality_score for r in results if r.quality_score is not None]
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0

        report = f"""# Fact-Checking Pipeline Summary Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Configuration:** Jurisdiction = {self.config.jurisdiction}, Quality Threshold = {self.config.quality_threshold}

## Processing Statistics

- **Total Files Processed:** {total_files}
- **Successful:** {successful} ({successful/total_files*100:.1f}%)
- **Needs Review:** {needs_review} ({needs_review/total_files*100:.1f}%)
- **Errors:** {errors} ({errors/total_files*100:.1f}%)

## Quality Metrics

- **Average Quality Score:** {avg_quality:.1f}
- **Highest Score:** {max(quality_scores) if quality_scores else 'N/A'}
- **Lowest Score:** {min(quality_scores) if quality_scores else 'N/A'}
- **Files Above Threshold:** {len([s for s in quality_scores if s >= self.config.quality_threshold])}/{len(quality_scores)}

## File-by-File Results

| File | Status | Quality Score | Processing Time |
|------|--------|---------------|-----------------|
"""

        for result in results:
            filename = Path(result.file_path).name
            score = f"{result.quality_score:.1f}" if result.quality_score else "N/A"
            time_str = f"{result.processing_time:.2f}s"
            status_icon = "✅" if result.status == 'success' else "⚠️" if result.status == 'needs_review' else "❌"
            report += f"| {filename} | {status_icon} {result.status} | {score} | {time_str} |\n"

        # Add recommendations section
        all_recommendations = []
        for result in results:
            all_recommendations.extend(result.recommendations or [])

        if all_recommendations:
            report += "\n## Common Recommendations\n\n"
            # Count frequency of recommendations
            from collections import Counter
            rec_counts = Counter(all_recommendations)
            for rec, count in rec_counts.most_common(10):
                report += f"- {rec} ({count} files)\n"

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)

        logger.info(f"Summary report generated: {output_path}")

    async def _generate_quality_dashboard(self, results: List[ProcessingResult]):
        """Generate quality dashboard data"""
        dashboard_data = {
            'timestamp': datetime.now().isoformat(),
            'total_files': len(results),
            'quality_distribution': {},
            'file_details': [],
            'recommendations_summary': {}
        }

        # Quality distribution
        quality_ranges = [
            ('90-100 (Excellent)', 90, 100),
            ('80-89 (Good)', 80, 89),
            ('70-79 (Acceptable)', 70, 79),
            ('60-69 (Needs Improvement)', 60, 69),
            ('Below 60 (Unacceptable)', 0, 59)
        ]

        for label, min_score, max_score in quality_ranges:
            count = len([
                r for r in results
                if r.quality_score and min_score <= r.quality_score <= max_score
            ])
            dashboard_data['quality_distribution'][label] = count

        # File details
        for result in results:
            dashboard_data['file_details'].append({
                'file': Path(result.file_path).name,
                'status': result.status,
                'quality_score': result.quality_score,
                'processing_time': result.processing_time,
                'recommendations_count': len(result.recommendations or [])
            })

        # Recommendations summary
        all_recommendations = []
        for result in results:
            all_recommendations.extend(result.recommendations or [])

        from collections import Counter
        rec_counts = Counter(all_recommendations)
        dashboard_data['recommendations_summary'] = dict(rec_counts.most_common(20))

        # Save dashboard data
        dashboard_path = os.path.join(
            self.config.output_directory,
            f'quality_dashboard_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        )

        with open(dashboard_path, 'w', encoding='utf-8') as f:
            json.dump(dashboard_data, f, indent=2, ensure_ascii=False, default=str)

        logger.info(f"Quality dashboard generated: {dashboard_path}")

    async def _archive_processed_files(self, results: List[ProcessingResult]):
        """Archive successfully processed files"""
        archive_dir = os.path.join(self.config.output_directory, 'archive')

        for result in results:
            if result.status in ['success', 'needs_review']:
                try:
                    src_path = result.file_path
                    dst_path = os.path.join(archive_dir, Path(result.file_path).name)
                    os.rename(src_path, dst_path)
                    logger.info(f"Archived processed file: {src_path}")
                except Exception as e:
                    logger.warning(f"Failed to archive file {result.file_path}: {str(e)}")

    def _generate_summary(self, results: List[ProcessingResult], total_time: float) -> Dict:
        """Generate pipeline execution summary"""
        total_files = len(results)
        successful = len([r for r in results if r.status == 'success'])
        needs_review = len([r for r in results if r.status == 'needs_review'])
        errors = len([r for r in results if r.status == 'error'])

        quality_scores = [r.quality_score for r in results if r.quality_score is not None]

        return {
            'execution_time': total_time,
            'files_processed': total_files,
            'successful_files': successful,
            'files_need_review': needs_review,
            'error_files': errors,
            'average_quality_score': sum(quality_scores) / len(quality_scores) if quality_scores else 0,
            'min_quality_score': min(quality_scores) if quality_scores else None,
            'max_quality_score': max(quality_scores) if quality_scores else None,
            'pipeline_status': 'completed' if errors == 0 else 'completed_with_errors'
        }

class PipelineCLI:
    """Command-line interface for the pipeline"""

    def __init__(self):
        self.parser = self._setup_argument_parser()

    def _setup_argument_parser(self):
        """Setup command-line argument parser"""
        import argparse
        parser = argparse.ArgumentParser(description='Academic Fact-Checking Pipeline')

        parser.add_argument('input_dir', help='Input directory containing documents to process')
        parser.add_argument('output_dir', help='Output directory for results and reports')

        parser.add_argument('--config', help='Configuration file path')
        parser.add_argument('--temp-dir', help='Temporary directory for processing')
        parser.add_argument('--jurisdiction', default='FDA', choices=['FDA', 'NMPA', 'CE_Marking'],
                           help='Regulatory jurisdiction')
        parser.add_argument('--parallel', type=int, default=3,
                           help='Number of parallel processes')
        parser.add_argument('--quality-threshold', type=float, default=70.0,
                           help='Quality score threshold')
        parser.add_argument('--pattern', default='*.md',
                           help='File pattern to match (default: *.md)')
        parser.add_argument('--no-reports', action='store_true',
                           help='Skip report generation')
        parser.add_argument('--no-archive', action='store_true',
                           help='Skip file archiving')
        parser.add_argument('--verbose', action='store_true',
                           help='Verbose logging')

        return parser

    async def run(self, args):
        """Run the pipeline with provided arguments"""
        # Setup logging
        if args.verbose:
            logging.getLogger().setLevel(logging.DEBUG)

        # Create configuration
        config = PipelineConfig(
            input_directory=args.input_dir,
            output_directory=args.output_dir,
            temp_directory=args.temp_dir or os.path.join(args.output_dir, 'temp'),
            config_file=args.config,
            jurisdiction=args.jurisdiction,
            parallel_processing=args.parallel,
            quality_threshold=args.quality_threshold,
            generate_reports=not args.no_reports,
            archive_processed=not args.no_archive
        )

        # Run pipeline
        manager = PipelineManager(config)
        results = await manager.run_pipeline(args.pattern)

        # Print summary
        print("\nPipeline Execution Summary:")
        print(f"  Total Files: {results['files_processed']}")
        print(f"  Successful: {results['successful_files']}")
        print(f"  Need Review: {results['files_need_review']}")
        print(f"  Errors: {results['error_files']}")
        print(f"  Average Quality Score: {results['average_quality_score']:.1f}")
        print(f"  Execution Time: {results['execution_time']:.2f} seconds")

def main():
    """Main entry point"""
    cli = PipelineCLI()
    args = cli.parser.parse_args()

    try:
        asyncio.run(cli.run(args))
    except KeyboardInterrupt:
        print("\nPipeline interrupted by user")
    except Exception as e:
        print(f"Pipeline failed: {str(e)}")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())