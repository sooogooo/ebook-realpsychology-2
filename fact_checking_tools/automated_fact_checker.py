#!/usr/bin/env python3
"""
Automated Fact-Checking System for Medical Aesthetics Consumer Psychology
Author: Academic Quality Assurance Team
Date: 2025-10-26

This module provides automated fact-checking capabilities for academic content,
including research paper verification, citation validation, and quality scoring.
"""

import requests
import json
import re
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import logging
from urllib.parse import quote
import time
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class FactCheckResult:
    """Data class for fact-checking results"""
    claim: str
    is_valid: bool
    confidence_score: float
    verification_sources: List[str]
    methodology_notes: str
    quality_issues: List[str]
    recommendations: List[str]

@dataclass
class CitationVerification:
    """Data class for citation verification results"""
    citation: str
    doi: Optional[str]
    is_accessible: bool
    journal_impact_factor: float
    peer_review_status: bool
    publication_date: datetime
    author_credentials: List[str]
    quality_score: float

class AcademicDatabaseClient:
    """Client for various academic databases"""

    def __init__(self, config: Dict):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Academic Fact-Checker 1.0',
            'Accept': 'application/json'
        })

    def verify_pubmed_paper(self, pmid: str) -> Dict:
        """Verify research paper in PubMed database"""
        try:
            # PubMed EFetch API
            base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

            # Get basic info
            summary_url = f"{base_url}esummary.fcgi"
            summary_params = {
                'db': 'pubmed',
                'id': pmid,
                'retmode': 'json'
            }

            summary_response = self.session.get(summary_url, params=summary_params)
            summary_data = summary_response.json()

            if not summary_data.get('result', {}).get(pmid):
                return {'valid': False, 'error': 'PMID not found'}

            # Get detailed information
            fetch_url = f"{base_url}efetch.fcgi"
            fetch_params = {
                'db': 'pubmed',
                'id': pmid,
                'retmode': 'xml'
            }

            fetch_response = self.session.get(fetch_url, params=fetch_params)

            return {
                'valid': True,
                'summary': summary_data['result'][pmid],
                'details': fetch_response.text
            }

        except Exception as e:
            logger.error(f"Error verifying PubMed paper {pmid}: {str(e)}")
            return {'valid': False, 'error': str(e)}

    def verify_doi(self, doi: str) -> Dict:
        """Verify DOI and get metadata via CrossRef API"""
        try:
            url = f"https://api.crossref.org/works/{quote(doi)}"
            response = self.session.get(url)

            if response.status_code == 404:
                return {'valid': False, 'error': 'DOI not found'}

            data = response.json()
            message = data.get('message', {})

            return {
                'valid': True,
                'title': message.get('title', [''])[0],
                'authors': message.get('author', []),
                'published_date': message.get('published-print', {}).get('date-parts', [[None]])[0][0],
                'journal': message.get('short-container-title', [''])[0],
                'type': message.get('type', ''),
                'references_count': len(message.get('reference', [])),
                'is_referenced_by_count': message.get('is-referenced-by-count', 0)
            }

        except Exception as e:
            logger.error(f"Error verifying DOI {doi}: {str(e)}")
            return {'valid': False, 'error': str(e)}

class MedicalTerminologyValidator:
    """Specialized validator for medical aesthetics terminology"""

    def __init__(self):
        self.load_medical_database()

    def load_medical_database(self):
        """Load medical terminology database"""
        self.medical_terms = {
            'procedures': {
                'botulinum_toxin': {
                    'synonyms': ['botox', 'btx', 'neurotoxin', 'botulinum', 'dysport', 'xeomin'],
                    'indications': ['wrinkle_reduction', 'muscle_spasm', 'hyperhidrosis', 'migraine'],
                    'contraindications': ['pregnancy', 'breastfeeding', 'neuromuscular_disorders'],
                    'fda_status': 'approved'
                },
                'hyaluronic_acid': {
                    'synonyms': ['ha', 'hyaluronan', 'hyaluronate', 'dermal_filler', 'juvederm', 'restylane'],
                    'indications': ['volume_restoration', 'wrinkle_filling', 'lip_augmentation'],
                    'contraindications': ['allergy_history', 'active_infection', 'bleeding_disorders'],
                    'fda_status': 'approved'
                },
                'laser_resurfacing': {
                    'synonyms': ['laser_peel', 'laser_skin_rejuvenation', 'ablative_laser', 'co2_laser'],
                    'indications': ['scar_revision', 'wrinkle_reduction', 'skin_tightening'],
                    'contraindications': ['recent_accutane', 'active_acne', 'skin_cancer_history'],
                    'fda_status': 'cleared'
                }
            },
            'complications': {
                'vascular_compromise': {
                    'symptoms': ['blanching', 'pain', 'necrosis'],
                    'emergency_treatment': 'hyaluronidase_injection'
                },
                'infection': {
                    'symptoms': ['redness', 'swelling', 'fever', 'pus'],
                    'treatment': 'antibiotics'
                }
            }
        }

    def validate_terminology(self, text: str) -> List[Dict]:
        """Validate medical terminology in given text"""
        issues = []
        text_lower = text.lower()

        for category, terms in self.medical_terms.items():
            for term_name, term_data in terms.items():
                # Check for proper terminology usage
                for synonym in term_data.get('synonyms', []):
                    if synonym in text_lower and synonym != term_name:
                        issues.append({
                            'type': 'terminology',
                            'issue': 'Non-standard terminology',
                            'found': synonym,
                            'recommended': term_name,
                            'severity': 'minor',
                            'description': f"Consider using standard terminology '{term_name}' instead of '{synonym}'"
                        })

        return issues

class StatisticalClaimValidator:
    """Validator for statistical claims and data"""

    def __init__(self):
        self.statistical_patterns = [
            r'(\d+(?:\.\d+)?)%\s*(?:of\s*|\s*-\s*)',
            r'(?:significant|statistically significant)',
            r'(?:p\s*=\s*[<≤=]\s*\d+(?:\.\d+)?)',
            r'(?:confidence interval|ci)\s*[:\[]\s*[\d.\-]+',
            r'(?:odds ratio|or)\s*[:\[]\s*[\d.\-]+',
            r'(?:relative risk|rr)\s*[:\[]\s*[\d.\-]+'
        ]

    def extract_statistical_claims(self, text: str) -> List[Dict]:
        """Extract statistical claims from text"""
        claims = []

        for pattern in self.statistical_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                claims.append({
                    'claim': match.group(0),
                    'context': text[max(0, match.start()-100):match.end()+100],
                    'position': match.start(),
                    'type': self.identify_claim_type(match.group(0))
                })

        return claims

    def identify_claim_type(self, claim: str) -> str:
        """Identify the type of statistical claim"""
        claim_lower = claim.lower()

        if '%' in claim:
            return 'percentage'
        elif 'significant' in claim_lower:
            return 'significance'
        elif claim_lower.startswith('p'):
            return 'p_value'
        elif 'confidence interval' in claim_lower or 'ci' in claim_lower:
            return 'confidence_interval'
        elif 'odds ratio' in claim_lower or 'or' in claim_lower:
            return 'odds_ratio'
        elif 'relative risk' in claim_lower or 'rr' in claim_lower:
            return 'relative_risk'
        else:
            return 'other'

    def validate_percentage_claim(self, claim: str, context: str) -> Dict:
        """Validate percentage claims for reasonableness"""
        try:
            # Extract percentage value
            percentage_match = re.search(r'(\d+(?:\.\d+)?)%', claim)
            if not percentage_match:
                return {'valid': False, 'error': 'Cannot parse percentage'}

            percentage = float(percentage_match.group(1))

            # Basic reasonableness checks
            if percentage < 0 or percentage > 100:
                return {
                    'valid': False,
                    'error': f'Percentage {percentage}% is outside valid range [0,100]'
                }

            # Context-specific checks
            if 'mortality' in context.lower() and percentage > 50:
                return {
                    'valid': False,
                    'error': f'Mortality rate of {percentage}% seems unusually high'
                }

            if 'satisfaction' in context.lower() and percentage > 99:
                return {
                    'valid': True,
                    'warning': f'Satisfaction rate of {percentage}% seems unusually high, verify data source'
                }

            return {
                'valid': True,
                'score': min(100, abs(percentage - 50) * 2)  # Higher score for claims closer to 50%
            }

        except Exception as e:
            return {'valid': False, 'error': str(e)}

class QualityScoringSystem:
    """Comprehensive quality scoring for academic content"""

    def __init__(self):
        self.weights = {
            'source_quality': 0.25,
            'methodology_strength': 0.25,
            'evidence_hierarchy': 0.20,
            'citation_accuracy': 0.15,
            'interpretation_quality': 0.15
        }

    def calculate_quality_score(self, content_analysis: Dict) -> Dict:
        """Calculate overall quality score"""
        component_scores = {}

        # Source Quality (0-25 points)
        component_scores['source_quality'] = self._evaluate_source_quality(
            content_analysis.get('sources', [])
        )

        # Methodology Strength (0-25 points)
        component_scores['methodology_strength'] = self._evaluate_methodology(
            content_analysis.get('methodology', {})
        )

        # Evidence Hierarchy (0-20 points)
        component_scores['evidence_hierarchy'] = self._evaluate_evidence_level(
            content_analysis.get('evidence', [])
        )

        # Citation Accuracy (0-15 points)
        component_scores['citation_accuracy'] = self._evaluate_citations(
            content_analysis.get('citations', [])
        )

        # Interpretation Quality (0-15 points)
        component_scores['interpretation_quality'] = self._evaluate_interpretations(
            content_analysis.get('interpretations', [])
        )

        # Calculate weighted total
        total_score = sum(
            score * self.weights[category]
            for category, score in component_scores.items()
        )

        # Determine quality level
        quality_level = self._determine_quality_level(total_score)

        return {
            'total_score': round(total_score, 1),
            'component_scores': component_scores,
            'quality_level': quality_level,
            'recommendations': self._generate_recommendations(component_scores)
        }

    def _evaluate_source_quality(self, sources: List[Dict]) -> float:
        """Evaluate source quality (0-25 points)"""
        if not sources:
            return 0.0

        total_score = 0
        for source in sources:
            score = 0

            # Primary vs secondary (0-10)
            if source.get('is_primary', False):
                score += 10
            elif source.get('is_secondary', False):
                score += 6
            else:
                score += 3

            # Source credibility (0-10)
            impact_factor = source.get('impact_factor', 0)
            if impact_factor >= 5:
                score += 10
            elif impact_factor >= 3:
                score += 8
            elif impact_factor >= 1:
                score += 6
            else:
                score += 3

            # Recency (0-5)
            pub_year = source.get('publication_year', 1900)
            years_old = datetime.now().year - pub_year
            if years_old <= 2:
                score += 5
            elif years_old <= 5:
                score += 4
            elif years_old <= 10:
                score += 2
            else:
                score += 1

            total_score += min(score, 25)  # Cap at 25 per source

        return min(25, total_score / len(sources))

    def _evaluate_methodology(self, methodology: Dict) -> float:
        """Evaluate research methodology (0-25 points)"""
        score = 0

        # Research design (0-10)
        design = methodology.get('design', '').lower()
        if 'randomized' in design and 'controlled' in design:
            score += 10
        elif 'controlled' in design or 'randomized' in design:
            score += 8
        elif 'prospective' in design or 'cohort' in design:
            score += 6
        elif 'case-control' in design or 'cross-sectional' in design:
            score += 4
        else:
            score += 2

        # Sample size (0-8)
        sample_size = methodology.get('sample_size', 0)
        if sample_size >= 500:
            score += 8
        elif sample_size >= 200:
            score += 6
        elif sample_size >= 100:
            score += 4
        elif sample_size >= 50:
            score += 2
        else:
            score += 1

        # Statistical analysis (0-7)
        if methodology.get('statistical_test'):
            score += 4
        if methodology.get('confidence_intervals'):
            score += 2
        if methodology.get('power_analysis'):
            score += 1

        return min(25, score)

    def _determine_quality_level(self, score: float) -> str:
        """Determine quality level based on score"""
        if score >= 90:
            return 'excellent'
        elif score >= 80:
            return 'good'
        elif score >= 70:
            return 'acceptable'
        elif score >= 60:
            return 'needs_improvement'
        else:
            return 'unacceptable'

class AutomatedFactChecker:
    """Main fact-checking system coordinator"""

    def __init__(self, config_path: str = None):
        self.config = self.load_config(config_path)
        self.db_client = AcademicDatabaseClient(self.config)
        self.medical_validator = MedicalTerminologyValidator()
        self.stats_validator = StatisticalClaimValidator()
        self.quality_scorer = QualityScoringSystem()

    def load_config(self, config_path: str) -> Dict:
        """Load configuration from file or use defaults"""
        default_config = {
            'api_keys': {},
            'rate_limits': {
                'pubmed': 3,  # requests per second
                'crossref': 1,
                'google_scholar': 1
            },
            'quality_thresholds': {
                'minimum_score': 70,
                'excellent_score': 90
            }
        }

        if config_path:
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                default_config.update(user_config)
            except FileNotFoundError:
                logger.warning(f"Config file {config_path} not found, using defaults")

        return default_config

    def check_document(self, text: str, document_type: str = 'academic_paper') -> Dict:
        """Main fact-checking function for entire document"""
        results = {
            'document_type': document_type,
            'timestamp': datetime.now().isoformat(),
            'fact_checks': [],
            'citation_checks': [],
            'medical_terminology_checks': [],
            'statistical_claims': [],
            'quality_score': None,
            'recommendations': []
        }

        # Extract and verify citations
        citations = self.extract_citations(text)
        for citation in citations:
            check_result = self.verify_citation(citation)
            results['citation_checks'].append(check_result)

        # Check medical terminology
        medical_issues = self.medical_validator.validate_terminology(text)
        results['medical_terminology_checks'] = medical_issues

        # Extract and verify statistical claims
        stat_claims = self.stats_validator.extract_statistical_claims(text)
        for claim in stat_claims:
            validation_result = self.validate_statistical_claim(claim)
            results['statistical_claims'].append(validation_result)

        # Extract factual claims (simplified for demo)
        factual_claims = self.extract_factual_claims(text)
        for claim in factual_claims:
            check_result = self.verify_factual_claim(claim)
            results['fact_checks'].append(check_result)

        # Calculate overall quality score
        content_analysis = self.prepare_content_analysis(results)
        quality_result = self.quality_scorer.calculate_quality_score(content_analysis)
        results['quality_score'] = quality_result

        # Generate recommendations
        results['recommendations'] = self.generate_recommendations(results)

        return results

    def extract_citations(self, text: str) -> List[str]:
        """Extract citations from text"""
        citation_patterns = [
            r'\((\d{4})\)',  # (2023)
            r'\[(\d+)\]',    # [1]
            r'(?:doi|DOI):\s*(10\.\d+/[^\s]+)',  # DOI: 10.xxxx/xxxxx
            r'(?:PMID|pmid):\s*(\d+)',  # PMID: 12345678
        ]

        citations = []
        for pattern in citation_patterns:
            matches = re.findall(pattern, text)
            citations.extend(matches)

        return list(set(citations))  # Remove duplicates

    def verify_citation(self, citation: str) -> Dict:
        """Verify a single citation"""
        result = {
            'citation': citation,
            'valid': False,
            'metadata': {},
            'quality_score': 0
        }

        # Try DOI verification
        if citation.startswith('10.'):
            verification = self.db_client.verify_doi(citation)
            result.update(verification)

        # Try PMID verification
        elif citation.isdigit() and len(citation) >= 6:
            verification = self.db_client.verify_pubmed_paper(citation)
            result.update(verification)

        return result

    def extract_factual_claims(self, text: str) -> List[str]:
        """Extract factual claims from text (simplified)"""
        # This is a simplified implementation
        # In practice, would use more sophisticated NLP
        claim_patterns = [
            r'研究表明[^.。]*',
            r'发现[^.。]*',
            r'证实[^.。]*',
            r'超过\d+%[^.。]*',
            r'约\d+%[^.。]*'
        ]

        claims = []
        for pattern in claim_patterns:
            matches = re.findall(pattern, text)
            claims.extend(matches)

        return claims

    def verify_factual_claim(self, claim: str) -> FactCheckResult:
        """Verify a factual claim"""
        # Simplified verification process
        # In practice, would search academic databases

        verification_sources = []
        quality_issues = []
        recommendations = []

        # Basic heuristics for claim validation
        if any(keyword in claim.lower() for keyword in ['研究表明', '发现', '证实']):
            if not re.search(r'\(\d{4}\)|\[|\d+|doi', claim):
                quality_issues.append("Claim lacks citation")
                recommendations.append("Add citation to support this claim")

        confidence_score = 70.0  # Base confidence
        is_valid = len(quality_issues) == 0

        return FactCheckResult(
            claim=claim,
            is_valid=is_valid,
            confidence_score=confidence_score,
            verification_sources=verification_sources,
            methodology_notes="Automated verification",
            quality_issues=quality_issues,
            recommendations=recommendations
        )

    def validate_statistical_claim(self, claim: Dict) -> Dict:
        """Validate a statistical claim"""
        claim_type = claim['type']
        claim_text = claim['claim']
        context = claim['context']

        result = {
            'claim': claim_text,
            'type': claim_type,
            'valid': False,
            'confidence': 0.0,
            'issues': [],
            'recommendations': []
        }

        if claim_type == 'percentage':
            validation = self.stats_validator.validate_percentage_claim(claim_text, context)
            result.update(validation)

        elif claim_type == 'p_value':
            # Validate p-value format and reasonableness
            p_match = re.search(r'p\s*[<≤=]\s*0?\.?\d+', claim_text)
            if p_match:
                result['valid'] = True
                result['confidence'] = 80.0
            else:
                result['issues'].append("Invalid p-value format")
                result['recommendations'].append("Use proper p-value format (e.g., p < 0.05)")

        return result

    def prepare_content_analysis(self, results: Dict) -> Dict:
        """Prepare content analysis for quality scoring"""
        return {
            'sources': [
                {
                    'is_primary': True,  # Simplified
                    'impact_factor': 2.5,
                    'publication_year': 2023
                }
                for _ in results['citation_checks'] if _.get('valid')
            ],
            'methodology': {
                'design': 'observational',  # Simplified
                'sample_size': 100
            },
            'evidence': ['observational'] * len(results['fact_checks']),
            'citations': results['citation_checks'],
            'interpretations': results['fact_checks']
        }

    def generate_recommendations(self, results: Dict) -> List[str]:
        """Generate overall recommendations"""
        recommendations = []

        # Quality score based recommendations
        quality_score = results.get('quality_score', {}).get('total_score', 0)
        if quality_score < 70:
            recommendations.append("Document needs significant improvements before publication")
        elif quality_score < 80:
            recommendations.append("Document requires moderate improvements")
        elif quality_score < 90:
            recommendations.append("Minor improvements recommended")

        # Specific issue recommendations
        invalid_citations = len([c for c in results['citation_checks'] if not c.get('valid', False)])
        if invalid_citations > 0:
            recommendations.append(f"Fix {invalid_citations} invalid citations")

        medical_issues = len(results['medical_terminology_checks'])
        if medical_issues > 0:
            recommendations.append(f"Review {medical_issues} medical terminology issues")

        stat_issues = len([s for s in results['statistical_claims'] if not s.get('valid', False)])
        if stat_issues > 0:
            recommendations.append(f"Verify {stat_issues} statistical claims")

        return recommendations

def main():
    """Main function for command-line usage"""
    import argparse
    import sys

    parser = argparse.ArgumentParser(description='Automated Fact-Checking System')
    parser.add_argument('input_file', help='Input document file')
    parser.add_argument('--output', help='Output JSON file for results')
    parser.add_argument('--config', help='Configuration file')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        # Read input document
        with open(args.input_file, 'r', encoding='utf-8') as f:
            text = f.read()

        # Initialize fact checker
        fact_checker = AutomatedFactChecker(args.config)

        # Process document
        results = fact_checker.check_document(text)

        # Output results
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False, default=str)
            print(f"Results saved to {args.output}")
        else:
            print(json.dumps(results, indent=2, ensure_ascii=False, default=str))

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()