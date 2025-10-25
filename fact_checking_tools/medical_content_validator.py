#!/usr/bin/env python3
"""
Medical Content Validator for Medical Aesthetics Consumer Psychology
Specialized validation for medical terminology, clinical claims, and regulatory compliance
"""

import re
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import requests
from enum import Enum

class SeverityLevel(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class ComplianceLevel(Enum):
    COMPLIANT = "compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    NON_COMPLIANT = "non_compliant"
    UNKNOWN = "unknown"

@dataclass
class ValidationIssue:
    """Data class for validation issues"""
    issue_type: str
    severity: SeverityLevel
    description: str
    location: str
    suggested_fix: str
    regulatory_reference: Optional[str] = None
    compliance_level: Optional[ComplianceLevel] = None

@dataclass
class RegulatoryStatus:
    """Data class for regulatory status"""
    product_name: str
    jurisdiction: str
    regulatory_body: str
    approval_status: str
    approval_date: Optional[datetime]
    indications: List[str]
    contraindications: List[str]
    warnings: List[str]
    compliance_level: ComplianceLevel

class MedicalTerminologyDatabase:
    """Comprehensive medical terminology database for medical aesthetics"""

    def __init__(self):
        self.load_terminology_data()

    def load_terminology_data(self):
        """Load comprehensive medical terminology data"""
        self.procedures = {
            'botulinum_toxin_type_a': {
                'standard_names': ['Botulinum toxin type A', 'OnabotulinumtoxinA', 'AbobotulinumtoxinA', 'IncobotulinumtoxinA'],
                'brand_names': ['Botox', 'Dysport', 'Xeomin', 'Jeuveau'],
                'synonyms': ['BTX-A', 'neurotoxin', 'botulinum', 'wrinkle_relaxer'],
                'mechanism': 'Neuromuscular blocking agent that prevents acetylcholine release',
                'indications': [
                    'Glabellar lines', 'Crow\'s feet', 'Forehead lines',
                    'Hyperhidrosis', 'Migraine prevention', 'Muscle spasms'
                ],
                'contraindications': [
                    'Pregnancy', 'Breastfeeding', 'Myasthenia gravis',
                    'Lambert-Eaton syndrome', 'ALS', 'Known allergy'
                ],
                'side_effects': [
                    'Injection site pain', 'Headache', 'Ptosis', 'Diplopia',
                    'Flu-like symptoms', 'Allergic reactions'
                ],
                'dosage_units': 'Units',
                'duration': '3-6 months'
            },
            'hyaluronic_acid_fillers': {
                'standard_names': ['Hyaluronic acid filler', 'HA filler', 'Cross-linked hyaluronic acid'],
                'brand_names': ['Juvederm', 'Restylane', 'Belotero', 'Voluma', 'Volbella', 'Volift'],
                'synonyms': ['Dermal filler', 'Soft tissue filler', 'HA gel', 'injectable gel'],
                'mechanism': 'Hydrophilic gel that attracts and binds water molecules',
                'indications': [
                    'Nasolabial folds', 'Marionette lines', 'Lip augmentation',
                    'Cheek augmentation', 'Tear trough', 'Jawline contouring'
                ],
                'contraindications': [
                    'Allergy to hyaluronic acid', 'Active infection',
                    'Bleeding disorders', 'Autoimmune disease'
                ],
                'side_effects': [
                    'Swelling', 'Redness', 'Bruising', 'Tenderness',
                    'Nodule formation', 'Vascular occlusion', 'Infection'
                ],
                'dosage_units': 'mL',
                'duration': '6-18 months'
            },
            'chemical_peels': {
                'standard_names': ['Chemical peel', 'Chemexfoliation', 'Dermal peeling'],
                'synonyms': ['Skin peel', 'Acid peel', 'Facial peel'],
                'types': {
                    'superficial': ['Glycolic acid', 'Lactic acid', 'Salicylic acid', 'Jessner solution'],
                    'medium': ['TCA 25-35%', 'Glycolic acid 70%'],
                    'deep': ['Phenol', 'TCA > 50%']
                },
                'indications': [
                    'Photoaging', 'Acne scars', 'Hyperpigmentation', 'Fine lines',
                    'Actinic keratosis'
                ],
                'contraindications': [
                    'Active infection', 'Recent accutane use', 'Eczema',
                    'Psoriasis', 'Pregnancy'
                ],
                'complications': [
                    'Post-inflammatory hyperpigmentation', 'Scarring',
                    'Infection', 'Erythema', 'Textural changes'
                ]
            },
            'laser_treatments': {
                'standard_names': ['Laser resurfacing', 'Laser therapy', 'Laser rejuvenation'],
                'types': {
                    'ablative': ['CO2 laser', 'Erbium:YAG laser'],
                    'non-ablative': ['Nd:YAG', 'Diode laser', 'IPL'],
                    'fractional': ['Fraxel', 'Fractional CO2', 'LaseMD']
                },
                'indications': [
                    'Wrinkles', 'Acne scars', 'Pigmentation', 'Vascular lesions',
                    'Skin tightening', 'Texture improvement'
                ],
                'contraindications': [
                    'Fitzpatrick V-VI for certain lasers', 'Recent sun exposure',
                    'Active acne', 'Herpes outbreak', 'Pregnancy'
                ],
                'complications': [
                    'Burns', 'Hyperpigmentation', 'Hypopigmentation',
                    'Scarring', 'Infection', 'Textural changes'
                ]
            }
        }

        self.complications = {
            'vascular_compromise': {
                'symptoms': ['Immediate blanching', 'Livedo reticularis', 'Pain out of proportion', 'Tissue necrosis'],
                'causes': ['Intra-arterial injection', 'Compression', 'Excessive volume'],
                'emergency_treatment': ['Hyaluronidase', 'Warm compresses', 'Massage', 'Aspirin'],
                'time_sensitivity': 'Within hours'
            },
            'infection': {
                'symptoms': ['Redness', 'Swelling', 'Warmth', 'Purulence', 'Fever'],
                'causes': ['Contamination', 'Poor technique', 'Immune compromise'],
                'treatment': ['Antibiotics', 'Warm compresses', 'Incision and drainage'],
                'prevention': ['Sterile technique', 'Proper skin prep', 'Aftercare education']
            },
            'allergic_reaction': {
                'symptoms': ['Urticaria', 'Angioedema', 'Pruritus', 'Anaphylaxis'],
                'causes': ['Product allergy', 'Preservative sensitivity'],
                'treatment': ['Antihistamines', 'Corticosteroids', 'Epinephrine (severe)'],
                'prevention': ['Allergy testing', 'Patch testing', 'Medical history review']
            },
            'nodules_and_granulomas': {
                'symptoms': ['Palpable lumps', 'Visible bumps', 'Inflammation'],
                'causes': ['Product migration', 'Biofilm', 'Foreign body reaction'],
                'treatment': ['Hyaluronidase (HA fillers)', 'Steroids', 'Excision'],
                'prevention': ['Proper injection technique', 'Appropriate depth', 'Sterile conditions']
            }
        }

        self.anatomical_terms = {
            'face': {
                'upper_third': ['Forehead', 'Temples', 'Eyebrows', 'Glabella'],
                'middle_third': ['Eyes', 'Nose', 'Cheeks', 'Nasolabial folds'],
                'lower_third': ['Mouth', 'Lips', 'Chin', 'Jawline', 'Marionette lines']
            },
            'injection_sites': {
                'high_risk': ['Glabella', 'Nasolabial folds', 'Dorsal nose', 'Angular artery'],
                'medium_risk': ['Periorbital', 'Perioral', 'Cheeks'],
                'low_risk': ['Temporal', 'Jawline', 'Chin']
            }
        }

class RegulatoryComplianceChecker:
    """Checker for regulatory compliance across different jurisdictions"""

    def __init__(self):
        self.load_regulatory_data()

    def load_regulatory_data(self):
        """Load regulatory requirements for different jurisdictions"""
        self.regulations = {
            'FDA': {
                'jurisdiction': 'United States',
                'device_classifications': {
                    'Class I': 'General controls',
                    'Class II': 'General + special controls',
                    'Class III': 'Premarket approval'
                },
                'approval_pathways': {
                    '510(k)': 'Substantial equivalence',
                    'PMA': 'Premarket approval',
                    'De Novo': 'New device classification'
                },
                'advertising_requirements': {
                    'no_false_claims': True,
                    'risk_disclosure': True,
                    'before_after_photos': 'Must be authentic',
                    'patient_testimonials': 'Must disclose compensation'
                },
                'monitoring_requirements': {
                    'MAUDE': 'Mandatory adverse event reporting',
                    'post_market_surveillance': 'Required'
                }
            },
            'NMPA': {
                'jurisdiction': 'China',
                'device_classifications': {
                    '一类': 'Low risk',
                    '二类': 'Moderate risk',
                    '三类': 'High risk'
                },
                'approval_requirements': {
                    'clinical_trial_data': 'Required for Class II/III',
                    'technical_documents': 'Comprehensive dossier',
                    'manufacturing_standards': 'GMP compliance'
                },
                'advertising_restrictions': {
                    'medical_advertising_law': 'Strict restrictions',
                    'celebrity_endorsements': 'Prohibited',
                    'efficacy_claims': 'Must be verified'
                }
            },
            'CE_Marking': {
                'jurisdiction': 'European Union',
                'device_classifications': {
                    'Class I': 'Low risk',
                    'Class IIa': 'Medium risk',
                    'Class IIb': 'Medium-high risk',
                    'Class III': 'High risk'
                },
                'conformity_assessment': {
                    'self_certification': 'Class I',
                    'notified_body': 'Class IIa/IIb/III',
                    'technical_documentation': 'Required for all classes'
                },
                'post_market_obligations': {
                    'vigilance_system': 'Required',
                    'periodic_inspection': 'Required',
                    'clinical_follow_up': 'Required for implantable devices'
                }
            }
        }

    def check_compliance(self, text: str, jurisdiction: str = 'FDA') -> List[ValidationIssue]:
        """Check text for regulatory compliance"""
        issues = []
        rules = self.regulations.get(jurisdiction, {})

        # Check for prohibited claims
        if self.has_unsubstantiated_claims(text):
            issues.append(ValidationIssue(
                issue_type='unsubstantiated_claim',
                severity=SeverityLevel.HIGH,
                description='Unsubstantiated efficacy claim found',
                location='document_content',
                suggested_fix='Add supporting evidence or modify claim',
                regulatory_reference=f'{jurisdiction} advertising guidelines',
                compliance_level=ComplianceLevel.NON_COMPLIANT
            ))

        # Check for missing risk disclosures
        if self.lacks_risk_disclosure(text):
            issues.append(ValidationIssue(
                issue_type='missing_risk_disclosure',
                severity=SeverityLevel.HIGH,
                description='Risk information not adequately disclosed',
                location='document_content',
                suggested_fix='Add comprehensive risk information',
                regulatory_reference=f'{jurisdiction} disclosure requirements',
                compliance_level=ComplianceLevel.PARTIALLY_COMPLIANT
            ))

        # Check for before/after photo compliance
        if self.mentions_photos_without_disclosure(text):
            issues.append(ValidationIssue(
                issue_type='photo_disclosure',
                severity=SeverityLevel.MEDIUM,
                description='Before/after photos mentioned without disclosure',
                location='document_content',
                suggested_fix='Add authenticity disclosure for photos',
                regulatory_reference=f'{jurisdiction} photo guidelines',
                compliance_level=ComplianceLevel.PARTIALLY_COMPLIANT
            ))

        return issues

    def has_unsubstantiated_claims(self, text: str) -> bool:
        """Check for potentially unsubstantiated claims"""
        problematic_patterns = [
            r'guaranteed.*result',
            r'permanent.*solution',
            r'no.*risk',
            r'100%.*safe',
            r'pain.*free',
            r'instant.*result'
        ]

        for pattern in problematic_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    def lacks_risk_disclosure(self, text: str) -> bool:
        """Check if risk information is missing"""
        # If benefits are mentioned but risks are not
        benefit_keywords = ['benefit', 'advantage', 'effective', 'result', 'outcome']
        risk_keywords = ['risk', 'complication', 'side effect', 'adverse', 'danger']

        has_benefits = any(keyword in text.lower() for keyword in benefit_keywords)
        has_risks = any(keyword in text.lower() for keyword in risk_keywords)

        return has_benefits and not has_risks

    def mentions_photos_without_disclosure(self, text: str) -> bool:
        """Check for photo mentions without proper disclosure"""
        photo_keywords = ['before after', 'photo', 'picture', 'image']
        disclosure_keywords = ['actual patient', 'real result', 'typical result', 'individual results']

        has_photos = any(keyword in text.lower() for keyword in photo_keywords)
        has_disclosure = any(keyword in text.lower() for keyword in disclosure_keywords)

        return has_photos and not has_disclosure

class ClinicalStudyValidator:
    """Validator for clinical study claims and methodology"""

    def __init__(self):
        self.study_design_requirements = {
            'randomized_controlled_trial': {
                'required_elements': ['randomization', 'control_group', 'blinding', 'sample_size'],
                'quality_indicators': ['concealment_allocation', 'intention_to_treat', 'power_analysis']
            },
            'cohort_study': {
                'required_elements': ['defined_cohort', 'follow_up', 'outcome_assessment'],
                'quality_indicators': ['loss_to_follow_up', 'confounding_control', 'valid_outcome_measures']
            },
            'case_control_study': {
                'required_elements': ['case_definition', 'control_selection', 'exposure_assessment'],
                'quality_indicators': ['matching_criteria', 'blind_assessment', 'confounding_adjustment']
            }
        }

    def validate_clinical_claim(self, claim_text: str) -> List[ValidationIssue]:
        """Validate clinical study claims"""
        issues = []

        # Check for study design description
        if self.mentions_study_without_design(claim_text):
            issues.append(ValidationIssue(
                issue_type='missing_study_design',
                severity=SeverityLevel.HIGH,
                description='Clinical claim without study design specification',
                location=claim_text,
                suggested_fix='Specify study type, design, and methodology',
                compliance_level=ComplianceLevel.NON_COMPLIANT
            ))

        # Check for sample size reporting
        if self.mentions_study_without_sample_size(claim_text):
            issues.append(ValidationIssue(
                issue_type='missing_sample_size',
                severity=SeverityLevel.HIGH,
                description='Clinical claim without sample size information',
                location=claim_text,
                suggested_fix='Include sample size and demographic information',
                compliance_level=ComplianceLevel.PARTIALLY_COMPLIANT
            ))

        # Check for statistical significance
        if self.makes_significance_claims_without_stats(claim_text):
            issues.append(ValidationIssue(
                issue_type='missing_statistics',
                severity=SeverityLevel.MEDIUM,
                description='Significance claim without statistical evidence',
                location=claim_text,
                suggested_fix='Include p-values, confidence intervals, or effect sizes',
                compliance_level=ComplianceLevel.PARTIALLY_COMPLIANT
            ))

        return issues

    def mentions_study_without_design(self, text: str) -> bool:
        """Check if study is mentioned without design details"""
        study_patterns = [
            r'study.*show',
            r'research.*found',
            r'clinical.*trial',
            r'investigation.*demonstrated'
        ]

        design_patterns = [
            r'randomized',
            r'controlled',
            r'double.*blind',
            r'cohort',
            r'case.*control'
        ]

        has_study_mention = any(re.search(pattern, text, re.IGNORECASE) for pattern in study_patterns)
        has_design_mention = any(re.search(pattern, text, re.IGNORECASE) for pattern in design_patterns)

        return has_study_mention and not has_design_mention

    def mentions_study_without_sample_size(self, text: str) -> bool:
        """Check if study is mentioned without sample size"""
        study_patterns = [
            r'study.*\d+\s*patient',
            r'clinical.*trial.*\d+',
            r'participants.*\d+',
            r'subjects.*\d+'
        ]

        return not any(re.search(pattern, text, re.IGNORECASE) for pattern in study_patterns)

    def makes_significance_claims_without_stats(self, text: str) -> bool:
        """Check for significance claims without statistical evidence"""
        significance_patterns = [
            r'significant',
            r'statistically',
            r'correlation',
            r'association'
        ]

        statistical_patterns = [
            r'p\s*[<≤=]\s*\d+',
            r'ci\s*[:\[]',
            r'confidence interval',
            r'odds ratio',
            r'relative risk'
        ]

        has_significance_claim = any(re.search(pattern, text, re.IGNORECASE) for pattern in significance_patterns)
        has_statistical_evidence = any(re.search(pattern, text, re.IGNORECASE) for pattern in statistical_patterns)

        return has_significance_claim and not has_statistical_evidence

class MedicalContentValidator:
    """Main medical content validation system"""

    def __init__(self):
        self.terminology_db = MedicalTerminologyDatabase()
        self.regulatory_checker = RegulatoryComplianceChecker()
        self.clinical_validator = ClinicalStudyValidator()

    def validate_document(self, text: str, jurisdiction: str = 'FDA') -> Dict:
        """Comprehensive validation of medical content"""
        validation_results = {
            'timestamp': datetime.now().isoformat(),
            'jurisdiction': jurisdiction,
            'terminology_issues': [],
            'regulatory_issues': [],
            'clinical_study_issues': [],
            'safety_warnings': [],
            'compliance_score': 0,
            'recommendations': []
        }

        # Validate medical terminology
        terminology_issues = self.validate_terminology(text)
        validation_results['terminology_issues'] = terminology_issues

        # Check regulatory compliance
        regulatory_issues = self.regulatory_checker.check_compliance(text, jurisdiction)
        validation_results['regulatory_issues'] = regulatory_issues

        # Validate clinical study claims
        clinical_issues = []
        sentences = re.split(r'[.。!！?？]', text)
        for sentence in sentences:
            if sentence.strip():
                issues = self.clinical_validator.validate_clinical_claim(sentence)
                clinical_issues.extend(issues)
        validation_results['clinical_study_issues'] = clinical_issues

        # Generate safety warnings
        safety_warnings = self.generate_safety_warnings(text)
        validation_results['safety_warnings'] = safety_warnings

        # Calculate compliance score
        all_issues = terminology_issues + regulatory_issues + clinical_issues
        validation_results['compliance_score'] = self.calculate_compliance_score(all_issues)

        # Generate recommendations
        validation_results['recommendations'] = self.generate_recommendations(validation_results)

        return validation_results

    def validate_terminology(self, text: str) -> List[ValidationIssue]:
        """Validate medical terminology usage"""
        issues = []
        text_lower = text.lower()

        # Check for non-standard terminology
        for procedure_name, procedure_data in self.terminology_db.procedures.items():
            standard_names = [name.lower() for name in procedure_data['standard_names']]
            synonyms = [syn.lower() for syn in procedure_data['synonyms']]

            for synonym in synonyms:
                if synonym in text_lower and synonym not in standard_names:
                    # Find the best standard name to suggest
                    suggested_name = procedure_data['standard_names'][0]
                    issues.append(ValidationIssue(
                        issue_type='non_standard_terminology',
                        severity=SeverityLevel.LOW,
                        description=f'Non-standard terminology: "{synonym}"',
                        location=f"Document contains '{synonym}'",
                        suggested_fix=f'Use standard term: "{suggested_name}"',
                        compliance_level=ComplianceLevel.PARTIALLY_COMPLIANT
                    ))

        # Check for incomplete safety information
        for complication_name, complication_data in self.terminology_db.complications.items():
            if any(symptom.lower() in text_lower for symptom in complication_data['symptoms']):
                if not any(keyword in text_lower for keyword in ['treatment', 'management', 'emergency', 'complication']):
                    issues.append(ValidationIssue(
                        issue_type='incomplete_safety_information',
                        severity=SeverityLevel.HIGH,
                        description=f'Complication mentioned without management information: {complication_name}',
                        location='Safety discussion',
                        suggested_fix=f'Include information about treating {complication_name}',
                        compliance_level=ComplianceLevel.PARTIALLY_COMPLIANT
                    ))

        return issues

    def generate_safety_warnings(self, text: str) -> List[Dict]:
        """Generate safety warnings based on content"""
        warnings = []
        text_lower = text.lower()

        # High-risk procedure warnings
        high_risk_indicators = [
            ('injectable', 'Review injection technique and anatomical knowledge'),
            ('laser', 'Verify laser parameters and skin type compatibility'),
            ('chemical peel', 'Confirm peel depth and aftercare protocol'),
            ('surgery', 'Ensure surgical consent and complication preparedness')
        ]

        for indicator, warning in high_risk_indicators:
            if indicator in text_lower:
                warnings.append({
                    'type': 'high_risk_procedure',
                    'indicator': indicator,
                    'warning': warning,
                    'action_required': 'Verify practitioner qualifications and emergency preparedness'
                })

        # Vascular occlusion warning
        vascular_keywords = ['filler', 'injection', 'hyaluronic acid']
        if any(keyword in text_lower for keyword in vascular_keywords):
            if 'hyaluronidase' not in text_lower:
                warnings.append({
                    'type': 'emergency_medication',
                    'indicator': 'injectable filler procedures',
                    'warning': 'Hyaluronidase availability not mentioned',
                    'action_required': 'Ensure hyaluronidase is available for vascular occlusion management'
                })

        return warnings

    def calculate_compliance_score(self, issues: List[ValidationIssue]) -> int:
        """Calculate overall compliance score (0-100)"""
        if not issues:
            return 100

        # Weight issues by severity
        severity_weights = {
            SeverityLevel.CRITICAL: 20,
            SeverityLevel.HIGH: 10,
            SeverityLevel.MEDIUM: 5,
            SeverityLevel.LOW: 2,
            SeverityLevel.INFO: 1
        }

        total_deduction = sum(severity_weights[issue.severity] for issue in issues)
        compliance_score = max(0, 100 - total_deduction)

        return compliance_score

    def generate_recommendations(self, validation_results: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []

        # Compliance score based recommendations
        score = validation_results['compliance_score']
        if score < 70:
            recommendations.append("CRITICAL: Document requires major revisions before use")
        elif score < 85:
            recommendations.append("IMPORTANT: Document requires moderate improvements")
        elif score < 95:
            recommendations.append("RECOMMENDED: Minor improvements would enhance quality")

        # Specific issue-based recommendations
        if validation_results['regulatory_issues']:
            high_priority_issues = [
                issue for issue in validation_results['regulatory_issues']
                if issue.severity in [SeverityLevel.CRITICAL, SeverityLevel.HIGH]
            ]
            if high_priority_issues:
                recommendations.append(f"URGENT: Address {len(high_priority_issues)} high-priority regulatory compliance issues")

        if validation_results['clinical_study_issues']:
            recommendations.append(f"Academic: Review and enhance {len(validation_results['clinical_study_issues'])} clinical study claims")

        if validation_results['safety_warnings']:
            recommendations.append(f"Safety: Review {len(validation_results['safety_warnings'])} safety warnings and protocols")

        # Quality improvement suggestions
        if validation_results['terminology_issues']:
            recommendations.append("Standardize medical terminology using professional guidelines")

        return recommendations

def main():
    """Command-line interface"""
    import argparse
    import sys

    parser = argparse.ArgumentParser(description='Medical Content Validator')
    parser.add_argument('input_file', help='Input text file to validate')
    parser.add_argument('--output', help='Output JSON file for results')
    parser.add_argument('--jurisdiction', default='FDA', choices=['FDA', 'NMPA', 'CE_Marking'],
                       help='Regulatory jurisdiction for compliance checking')
    parser.add_argument('--verbose', action='store_true', help='Detailed output')

    args = parser.parse_args()

    try:
        # Read input file
        with open(args.input_file, 'r', encoding='utf-8') as f:
            text = f.read()

        # Initialize validator
        validator = MedicalContentValidator()

        # Validate content
        results = validator.validate_document(text, args.jurisdiction)

        # Output results
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False, default=str)
            print(f"Validation results saved to {args.output}")
        else:
            print(json.dumps(results, indent=2, ensure_ascii=False, default=str))

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()