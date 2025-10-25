#!/usr/bin/env python3
"""
Comprehensive Quality Scoring System for Academic Medical Content
Multi-dimensional scoring with detailed metrics and reporting
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from enum import Enum
import re

class QualityLevel(Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    ACCEPTABLE = "acceptable"
    NEEDS_IMPROVEMENT = "needs_improvement"
    UNACCEPTABLE = "unacceptable"

class EvidenceLevel(Enum):
    LEVEL_1A = "systematic_review"
    LEVEL_1B = "rct"
    LEVEL_2A = "cohort_study"
    LEVEL_2B = "case_control"
    LEVEL_3 = "case_series"
    LEVEL_4 = "expert_opinion"

@dataclass
class QualityMetric:
    """Individual quality metric with scoring"""
    name: str
    description: str
    weight: float
    score: float
    max_score: float
    details: List[str]
    improvement_suggestions: List[str]

@dataclass
class SourceAssessment:
    """Assessment of an individual source"""
    source_text: str
    source_type: str  # primary, secondary, tertiary
    credibility_score: float
    recency_score: float
    peer_reviewed: bool
    impact_factor: Optional[float]
    publication_year: int
    author_credentials: List[str]
    potential_biases: List[str]

@dataclass
class MethodologyAssessment:
    """Assessment of research methodology"""
    design_type: str
    sample_size: int
    statistical_power: Optional[float]
    control_group: bool
    randomization: bool
    blinding: str
    statistical_tests: List[str]
    limitations: List[str]
    ethical_approval: bool

class QualityScoringSystem:
    """Comprehensive quality scoring system"""

    def __init__(self):
        self.scoring_weights = {
            'source_quality': 0.25,
            'methodology_strength': 0.25,
            'evidence_hierarchy': 0.20,
            'citation_accuracy': 0.15,
            'interpretation_quality': 0.15
        }

        self.quality_thresholds = {
            QualityLevel.EXCELLENT: (90, 100),
            QualityLevel.GOOD: (80, 89),
            QualityLevel.ACCEPTABLE: (70, 79),
            QualityLevel.NEEDS_IMPROVEMENT: (60, 69),
            QualityLevel.UNACCEPTABLE: (0, 59)
        }

    def calculate_comprehensive_score(self, content_analysis: Dict) -> Dict:
        """Calculate comprehensive quality score across all dimensions"""
        results = {
            'timestamp': datetime.now().isoformat(),
            'total_score': 0.0,
            'quality_level': QualityLevel.UNACCEPTABLE,
            'component_scores': {},
            'detailed_metrics': {},
            'strengths': [],
            'weaknesses': [],
            'recommendations': [],
            'score_breakdown': {}
        }

        # Calculate each component score
        source_score = self._calculate_source_quality_score(content_analysis.get('sources', []))
        methodology_score = self._calculate_methodology_strength_score(content_analysis.get('methodology', {}))
        evidence_score = self._calculate_evidence_hierarchy_score(content_analysis.get('evidence', []))
        citation_score = self._calculate_citation_accuracy_score(content_analysis.get('citations', []))
        interpretation_score = self._calculate_interpretation_quality_score(content_analysis.get('interpretations', []))

        # Store component scores
        results['component_scores'] = {
            'source_quality': source_score,
            'methodology_strength': methodology_score,
            'evidence_hierarchy': evidence_score,
            'citation_accuracy': citation_score,
            'interpretation_quality': interpretation_score
        }

        # Calculate weighted total score
        total_score = (
            source_score * self.scoring_weights['source_quality'] +
            methodology_score * self.scoring_weights['methodology_strength'] +
            evidence_score * self.scoring_weights['evidence_hierarchy'] +
            citation_score * self.scoring_weights['citation_accuracy'] +
            interpretation_score * self.scoring_weights['interpretation_quality']
        )

        results['total_score'] = round(total_score, 1)
        results['quality_level'] = self._determine_quality_level(total_score)

        # Generate detailed analysis
        results['strengths'] = self._identify_strengths(results['component_scores'])
        results['weaknesses'] = self._identify_weaknesses(results['component_scores'])
        results['recommendations'] = self._generate_recommendations(results['component_scores'])

        return results

    def _calculate_source_quality_score(self, sources: List[Dict]) -> QualityMetric:
        """Calculate source quality score (0-25 points)"""
        if not sources:
            return QualityMetric(
                name="Source Quality",
                description="Quality and credibility of information sources",
                weight=0.25,
                score=0.0,
                max_score=25.0,
                details=["No sources provided"],
                improvement_suggestions=["Add credible academic sources to support claims"]
            )

        total_score = 0.0
        details = []
        improvement_suggestions = []

        source_assessments = []
        for i, source in enumerate(sources):
            assessment = self._assess_individual_source(source)
            source_assessments.append(assessment)
            total_score += min(25.0, self._calculate_individual_source_score(assessment))

        # Average score (capped at 25)
        final_score = min(25.0, total_score / len(sources))

        # Generate details
        primary_sources = len([s for s in source_assessments if s.source_type == 'primary'])
        peer_reviewed = len([s for s in source_assessments if s.peer_reviewed])
        recent_sources = len([s for s in source_assessments if datetime.now().year - s.publication_year <= 5])

        details.append(f"Analyzed {len(sources)} sources")
        details.append(f"Primary sources: {primary_sources} ({primary_sources/len(sources)*100:.1f}%)")
        details.append(f"Peer-reviewed sources: {peer_reviewed} ({peer_reviewed/len(sources)*100:.1f}%)")
        details.append(f"Recent sources (≤5 years): {recent_sources} ({recent_sources/len(sources)*100:.1f}%)")

        # Generate improvement suggestions
        if primary_sources / len(sources) < 0.7:
            improvement_suggestions("Increase proportion of primary research sources")

        if peer_reviewed / len(sources) < 0.8:
            improvement_suggestions("Prioritize peer-reviewed sources")

        if recent_sources / len(sources) < 0.5:
            improvement_suggestions("Include more recent publications")

        return QualityMetric(
            name="Source Quality",
            description="Quality and credibility of information sources",
            weight=0.25,
            score=final_score,
            max_score=25.0,
            details=details,
            improvement_suggestions=improvement_suggestions
        )

    def _assess_individual_source(self, source: Dict) -> SourceAssessment:
        """Assess individual source quality"""
        # Determine source type
        source_text = source.get('text', '').lower()
        if any(indicator in source_text for indicator in ['original research', 'clinical trial', 'study']):
            source_type = 'primary'
        elif any(indicator in source_text for indicator in ['review', 'meta-analysis', 'systematic review']):
            source_type = 'secondary'
        else:
            source_type = 'tertiary'

        # Assess credibility
        credibility_score = 0.0
        if source.get('peer_reviewed', False):
            credibility_score += 0.4
        if source.get('impact_factor', 0) >= 2.0:
            credibility_score += 0.3
        if source.get('author_credentials'):
            credibility_score += 0.3

        # Assess recency
        pub_year = source.get('publication_year', 1900)
        years_old = datetime.now().year - pub_year
        if years_old <= 3:
            recency_score = 1.0
        elif years_old <= 5:
            recency_score = 0.8
        elif years_old <= 10:
            recency_score = 0.6
        else:
            recency_score = 0.3

        return SourceAssessment(
            source_text=source.get('text', ''),
            source_type=source_type,
            credibility_score=credibility_score,
            recency_score=recency_score,
            peer_reviewed=source.get('peer_reviewed', False),
            impact_factor=source.get('impact_factor'),
            publication_year=pub_year,
            author_credentials=source.get('author_credentials', []),
            potential_biases=source.get('potential_biases', [])
        )

    def _calculate_individual_source_score(self, assessment: SourceAssessment) -> float:
        """Calculate score for individual source (0-25)"""
        score = 0.0

        # Source type (0-10 points)
        if assessment.source_type == 'primary':
            score += 10
        elif assessment.source_type == 'secondary':
            score += 7
        else:
            score += 4

        # Credibility (0-10 points)
        score += assessment.credibility_score * 10

        # Recency (0-5 points)
        score += assessment.recency_score * 5

        return score

    def _calculate_methodology_strength_score(self, methodology: Dict) -> QualityMetric:
        """Calculate methodology strength score (0-25 points)"""
        if not methodology:
            return QualityMetric(
                name="Methodology Strength",
                description="Strength and rigor of research methodology",
                weight=0.25,
                score=0.0,
                max_score=25.0,
                details=["No methodology information provided"],
                improvement_suggestions=["Describe research methodology in detail"]
            )

        assessment = self._assess_methodology(methodology)
        score = 0.0
        details = []
        improvement_suggestions = []

        # Research design (0-10 points)
        design_scores = {
            'randomized_controlled_trial': 10,
            'controlled_trial': 8,
            'cohort_study': 6,
            'case_control': 5,
            'case_series': 3,
            'expert_opinion': 2,
            'observational': 4
        }
        design_score = design_scores.get(assessment.design_type.lower(), 2)
        score += design_score
        details.append(f"Research design: {assessment.design_type} ({design_score}/10 points)")

        # Sample size (0-8 points)
        if assessment.sample_size >= 500:
            sample_score = 8
        elif assessment.sample_size >= 200:
            sample_score = 6
        elif assessment.sample_size >= 100:
            sample_score = 4
        elif assessment.sample_size >= 50:
            sample_score = 2
        else:
            sample_score = 1
        score += sample_score
        details.append(f"Sample size: {assessment.sample_size} ({sample_score}/8 points)")

        # Methodological rigor (0-7 points)
        rigor_score = 0
        if assessment.control_group:
            rigor_score += 2
        if assessment.randomization:
            rigor_score += 2
        if assessment.blinding != 'none':
            rigor_score += 2
        if assessment.ethical_approval:
            rigor_score += 1
        score += rigor_score
        details.append(f"Methodological rigor: {rigor_score}/7 points")

        # Generate improvement suggestions
        if not assessment.control_group:
            improvement_suggestions("Include control group when possible")
        if not assessment.randomization and assessment.design_type != 'observational':
            improvement_suggestions("Consider randomization to reduce bias")
        if assessment.blinding == 'none':
            improvement_suggestions("Implement blinding where feasible")
        if assessment.sample_size < 100:
            improvement_suggestions("Increase sample size for better statistical power")

        return QualityMetric(
            name="Methodology Strength",
            description="Strength and rigor of research methodology",
            weight=0.25,
            score=score,
            max_score=25.0,
            details=details,
            improvement_suggestions=improvement_suggestions
        )

    def _assess_methodology(self, methodology: Dict) -> MethodologyAssessment:
        """Assess research methodology"""
        return MethodologyAssessment(
            design_type=methodology.get('design', 'observational'),
            sample_size=methodology.get('sample_size', 0),
            statistical_power=methodology.get('statistical_power'),
            control_group=methodology.get('control_group', False),
            randomization=methodology.get('randomization', False),
            blinding=methodology.get('blinding', 'none'),
            statistical_tests=methodology.get('statistical_tests', []),
            limitations=methodology.get('limitations', []),
            ethical_approval=methodology.get('ethical_approval', False)
        )

    def _calculate_evidence_hierarchy_score(self, evidence_items: List[Dict]) -> QualityMetric:
        """Calculate evidence hierarchy score (0-20 points)"""
        if not evidence_items:
            return QualityMetric(
                name="Evidence Hierarchy",
                description="Quality of evidence based on evidence hierarchy",
                weight=0.20,
                score=0.0,
                max_score=20.0,
                details=["No evidence provided"],
                improvement_suggestions=["Include higher-level evidence sources"]
            )

        total_score = 0.0
        details = []
        improvement_suggestions = []
        evidence_counts = {level: 0 for level in EvidenceLevel}

        # Score each evidence item
        for item in evidence_items:
            evidence_type = self._classify_evidence_type(item)
            evidence_counts[evidence_type] += 1

            # Score based on evidence level
            level_scores = {
                EvidenceLevel.LEVEL_1A: 20,
                EvidenceLevel.LEVEL_1B: 18,
                EvidenceLevel.LEVEL_2A: 15,
                EvidenceLevel.LEVEL_2B: 12,
                EvidenceLevel.LEVEL_3: 8,
                EvidenceLevel.LEVEL_4: 5
            }
            total_score += level_scores.get(evidence_type, 2)

        # Average score (capped at 20)
        final_score = min(20.0, total_score / len(evidence_items))

        # Generate details
        details.append(f"Analyzed {len(evidence_items)} evidence items")
        for level, count in evidence_counts.items():
            if count > 0:
                percentage = count / len(evidence_items) * 100
                details.append(f"{level.value}: {count} ({percentage:.1f}%)")

        # Generate improvement suggestions
        high_level_evidence = evidence_counts[EvidenceLevel.LEVEL_1A] + evidence_counts[EvidenceLevel.LEVEL_1B]
        if high_level_evidence / len(evidence_items) < 0.5:
            improvement_suggestions("Include more high-level evidence (RCTs, systematic reviews)")

        return QualityMetric(
            name="Evidence Hierarchy",
            description="Quality of evidence based on evidence hierarchy",
            weight=0.20,
            score=final_score,
            max_score=20.0,
            details=details,
            improvement_suggestions=improvement_suggestions
        )

    def _classify_evidence_type(self, evidence: Dict) -> EvidenceLevel:
        """Classify evidence type based on content"""
        text = evidence.get('text', '').lower()

        if 'systematic review' in text or 'meta-analysis' in text:
            return EvidenceLevel.LEVEL_1A
        elif 'randomized' in text and 'controlled' in text:
            return EvidenceLevel.LEVEL_1B
        elif 'cohort' in text:
            return EvidenceLevel.LEVEL_2A
        elif 'case control' in text:
            return EvidenceLevel.LEVEL_2B
        elif 'case series' in text or 'case report' in text:
            return EvidenceLevel.LEVEL_3
        else:
            return EvidenceLevel.LEVEL_4

    def _calculate_citation_accuracy_score(self, citations: List[Dict]) -> QualityMetric:
        """Calculate citation accuracy score (0-15 points)"""
        if not citations:
            return QualityMetric(
                name="Citation Accuracy",
                description="Accuracy and completeness of citations",
                weight=0.15,
                score=0.0,
                max_score=15.0,
                details=["No citations found"],
                improvement_suggestions=["Add proper citations to support claims"]
            )

        total_score = 0.0
        details = []
        improvement_suggestions = []

        # Check citation completeness
        complete_citations = 0
        accessible_citations = 0
        properly_formatted = 0

        for citation in citations:
            citation_score = 0

            # Completeness check (0-5 points)
            if all(field in citation for field in ['title', 'authors', 'year', 'venue']):
                complete_citations += 1
                citation_score += 5

            # Accessibility check (0-5 points)
            if citation.get('accessible', False):
                accessible_citations += 1
                citation_score += 5

            # Formatting check (0-5 points)
            if citation.get('properly_formatted', False):
                properly_formatted += 1
                citation_score += 5

            total_score += citation_score

        # Average score (capped at 15)
        final_score = min(15.0, total_score / len(citations))

        # Generate details
        details.append(f"Analyzed {len(citations)} citations")
        details.append(f"Complete citations: {complete_citations} ({complete_citations/len(citations)*100:.1f}%)")
        details.append(f"Accessible citations: {accessible_citations} ({accessible_citations/len(citations)*100:.1f}%)")
        details.append(f"Properly formatted: {properly_formatted} ({properly_formatted/len(citations)*100:.1f}%)")

        # Generate improvement suggestions
        if complete_citations / len(citations) < 0.9:
            improvement_suggestions("Ensure all citations have complete information")
        if accessible_citations / len(citations) < 0.8:
            improvement_suggestions("Verify that all citations are accessible")
        if properly_formatted / len(citations) < 0.9:
            improvement_suggestions("Standardize citation formatting")

        return QualityMetric(
            name="Citation Accuracy",
            description="Accuracy and completeness of citations",
            weight=0.15,
            score=final_score,
            max_score=15.0,
            details=details,
            improvement_suggestions=improvement_suggestions
        )

    def _calculate_interpretation_quality_score(self, interpretations: List[Dict]) -> QualityMetric:
        """Calculate interpretation quality score (0-15 points)"""
        if not interpretations:
            return QualityMetric(
                name="Interpretation Quality",
                description="Accuracy and appropriateness of interpretations",
                weight=0.15,
                score=0.0,
                max_score=15.0,
                details=["No interpretations found"],
                improvement_suggestions=["Add thoughtful interpretations of findings"]
            )

        total_score = 0.0
        details = []
        improvement_suggestions = []

        accurate_interpretations = 0
        nuanced_interpretations = 0
            context_aware_interpretations = 0

        for interpretation in interpretations:
            interpretation_score = 0

            # Accuracy check (0-5 points)
            if interpretation.get('accurate', False):
                accurate_interpretations += 1
                interpretation_score += 5

            # Nuance check (0-5 points)
            if interpretation.get('nuanced', False):
                nuanced_interpretations += 1
                interpretation_score += 5

            # Context awareness check (0-5 points)
            if interpretation.get('context_aware', False):
                context_aware_interpretations += 1
                interpretation_score += 5

            total_score += interpretation_score

        # Average score (capped at 15)
        final_score = min(15.0, total_score / len(interpretations))

        # Generate details
        details.append(f"Analyzed {len(interpretations)} interpretations")
        details.append(f"Accurate: {accurate_interpretations} ({accurate_interpretations/len(interpretations)*100:.1f}%)")
        details.append(f"Nuanced: {nuanced_interpretations} ({nuanced_interpretations/len(interpretations)*100:.1f}%)")
        details.append(f"Context-aware: {context_aware_interpretations} ({context_aware_interpretations/len(interpretations)*100:.1f}%)")

        # Generate improvement suggestions
        if accurate_interpretations / len(interpretations) < 0.9:
            improvement_suggestions("Ensure all interpretations accurately reflect the evidence")
        if nuanced_interpretations / len(interpretations) < 0.7:
            improvement_suggestions("Add more nuanced interpretations that acknowledge limitations")
        if context_aware_interpretations / len(interpretations) < 0.8:
            improvement_suggestions("Consider broader context in interpretations")

        return QualityMetric(
            name="Interpretation Quality",
            description="Accuracy and appropriateness of interpretations",
            weight=0.15,
            score=final_score,
            max_score=15.0,
            details=details,
            improvement_suggestions=improvement_suggestions
        )

    def _determine_quality_level(self, score: float) -> QualityLevel:
        """Determine quality level based on score"""
        for level, (min_score, max_score) in self.quality_thresholds.items():
            if min_score <= score <= max_score:
                return level
        return QualityLevel.UNACCEPTABLE

    def _identify_strengths(self, component_scores: Dict[str, QualityMetric]) -> List[str]:
        """Identify strengths in the content"""
        strengths = []

        for name, metric in component_scores.items():
            if metric.score >= metric.max_score * 0.9:  # 90% or higher
                strengths.append(f"Excellent {metric.name.lower()} ({metric.score}/{metric.max_score})")
            elif metric.score >= metric.max_score * 0.8:  # 80-89%
                strengths.append(f"Strong {metric.name.lower()} ({metric.score}/{metric.max_score})")

        return strengths

    def _identify_weaknesses(self, component_scores: Dict[str, QualityMetric]) -> List[str]:
        """Identify weaknesses in the content"""
        weaknesses = []

        for name, metric in component_scores.items():
            if metric.score < metric.max_score * 0.6:  # Below 60%
                weaknesses.append(f"Poor {metric.name.lower()} ({metric.score}/{metric.max_score})")
            elif metric.score < metric.max_score * 0.8:  # 60-79%
                weaknesses.append(f"Needs improvement in {metric.name.lower()} ({metric.score}/{metric.max_score})")

        return weaknesses

    def _generate_recommendations(self, component_scores: Dict[str, QualityMetric]) -> List[str]:
        """Generate specific recommendations for improvement"""
        recommendations = []

        for name, metric in component_scores.items():
            recommendations.extend(metric.improvement_suggestions)

        # Remove duplicates while preserving order
        seen = set()
        unique_recommendations = []
        for rec in recommendations:
            if rec not in seen:
                seen.add(rec)
                unique_recommendations.append(rec)

        return unique_recommendations

class QualityReporter:
    """Generate detailed quality reports"""

    def __init__(self, scoring_system: QualityScoringSystem):
        self.scoring_system = scoring_system

    def generate_comprehensive_report(self, content_analysis: Dict, output_format: str = 'json') -> str:
        """Generate comprehensive quality report"""
        results = self.scoring_system.calculate_comprehensive_score(content_analysis)

        if output_format.lower() == 'json':
            return json.dumps(self._prepare_json_report(results), indent=2, ensure_ascii=False)
        elif output_format.lower() == 'markdown':
            return self._generate_markdown_report(results)
        else:
            return self._generate_text_report(results)

    def _prepare_json_report(self, results: Dict) -> Dict:
        """Prepare detailed JSON report"""
        report = {
            'summary': {
                'total_score': results['total_score'],
                'quality_level': results['quality_level'].value,
                'assessment_date': results['timestamp']
            },
            'component_analysis': {},
            'strengths': results['strengths'],
            'weaknesses': results['weaknesses'],
            'recommendations': results['recommendations']
        }

        # Add detailed component analysis
        for name, metric in results['component_scores'].items():
            report['component_analysis'][name] = {
                'score': metric.score,
                'max_score': metric.max_score,
                'percentage': round(metric.score / metric.max_score * 100, 1),
                'description': metric.description,
                'details': metric.details,
                'improvement_suggestions': metric.improvement_suggestions
            }

        return report

    def _generate_markdown_report(self, results: Dict) -> str:
        """Generate markdown format report"""
        report = []

        # Header
        report.append("# Academic Quality Assessment Report")
        report.append("")
        report.append(f"**Date:** {results['timestamp']}")
        report.append(f"**Total Score:** {results['total_score']}/100")
        report.append(f"**Quality Level:** {results['quality_level'].value.title()}")
        report.append("")

        # Executive Summary
        report.append("## Executive Summary")
        report.append("")
        if results['strengths']:
            report.append("### Strengths")
            for strength in results['strengths']:
                report.append(f"- ✅ {strength}")
            report.append("")

        if results['weaknesses']:
            report.append("### Areas for Improvement")
            for weakness in results['weaknesses']:
                report.append(f"- ⚠️ {weakness}")
            report.append("")

        # Component Analysis
        report.append("## Detailed Component Analysis")
        report.append("")

        for name, metric in results['component_scores'].items():
            percentage = round(metric.score / metric.max_score * 100, 1)
            report.append(f"### {metric.name}")
            report.append(f"**Score:** {metric.score}/{metric.max_score} ({percentage}%)")
            report.append(f"**Description:** {metric.description}")
            report.append("")

            if metric.details:
                report.append("**Details:**")
                for detail in metric.details:
                    report.append(f"- {detail}")
                report.append("")

            if metric.improvement_suggestions:
                report.append("**Improvement Suggestions:**")
                for suggestion in metric.improvement_suggestions:
                    report.append(f"- {suggestion}")
                report.append("")

        # Recommendations
        if results['recommendations']:
            report.append("## Overall Recommendations")
            report.append("")
            for i, rec in enumerate(results['recommendations'], 1):
                report.append(f"{i}. {rec}")
            report.append("")

        return "\n".join(report)

    def _generate_text_report(self, results: Dict) -> str:
        """Generate plain text format report"""
        lines = []

        lines.append("ACADEMIC QUALITY ASSESSMENT REPORT")
        lines.append("=" * 50)
        lines.append(f"Date: {results['timestamp']}")
        lines.append(f"Total Score: {results['total_score']}/100")
        lines.append(f"Quality Level: {results['quality_level'].value.title()}")
        lines.append("")

        if results['strengths']:
            lines.append("STRENGTHS:")
            for strength in results['strengths']:
                lines.append(f"  ✓ {strength}")
            lines.append("")

        if results['weaknesses']:
            lines.append("AREAS FOR IMPROVEMENT:")
            for weakness in results['weaknesses']:
                lines.append(f"  ⚠ {weakness}")
            lines.append("")

        lines.append("COMPONENT SCORES:")
        for name, metric in results['component_scores'].items():
            percentage = round(metric.score / metric.max_score * 100, 1)
            lines.append(f"  {metric.name}: {metric.score}/{metric.max_score} ({percentage}%)")

        if results['recommendations']:
            lines.append("")
            lines.append("RECOMMENDATIONS:")
            for i, rec in enumerate(results['recommendations'], 1):
                lines.append(f"  {i}. {rec}")

        return "\n".join(lines)

def main():
    """Command-line interface"""
    import argparse
    import sys

    parser = argparse.ArgumentParser(description='Quality Scoring System')
    parser.add_argument('input_file', help='Input JSON file with content analysis')
    parser.add_argument('--output', help='Output report file')
    parser.add_argument('--format', choices=['json', 'markdown', 'text'], default='markdown',
                       help='Output format')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    try:
        # Read input analysis
        with open(args.input_file, 'r', encoding='utf-8') as f:
            content_analysis = json.load(f)

        # Initialize system
        scoring_system = QualityScoringSystem()
        reporter = QualityReporter(scoring_system)

        # Generate report
        report = reporter.generate_comprehensive_report(content_analysis, args.format)

        # Output results
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"Quality report saved to {args.output}")
        else:
            print(report)

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()