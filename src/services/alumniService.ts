import {
  ALUMNI_CAREER_DATA,
  type CareerJourneyStep,
  type CandidateExcellenceMetric,
  type PlacementSalaryBand,
  type AlumniScholarshipInfo,
  type VerifiedAlumniProfile,
  type AlumniSectionMeta
} from '../data/alumni';

export class AlumniService {
  /**
   * Returns career journey steps (01 Discover to 06 Grow)
   */
  static getCareerJourney(): CareerJourneyStep[] {
    return ALUMNI_CAREER_DATA.careerJourney;
  }

  /**
   * Returns candidate excellence reporting metrics
   */
  static getCandidateExcellence(): {
    multiOfferMetric: CandidateExcellenceMetric;
    highestCompensationMetric: CandidateExcellenceMetric;
  } {
    return ALUMNI_CAREER_DATA.candidateExcellence;
  }

  /**
   * Returns placement performance distribution
   */
  static getPlacementPerformance(): {
    reportingCycle: string;
    salaryBands: PlacementSalaryBand[];
    minimumCompensation: string;
    highestCompensation: string;
    totalOffersEstimate: string;
    recruitingOrgsEstimate: string;
    sourceLabel: string;
    sourceUrl: string;
  } {
    return ALUMNI_CAREER_DATA.placementPerformance;
  }

  /**
   * Returns Corporate & Alumni Relations information
   */
  static getCorporateAlumniRelations() {
    return ALUMNI_CAREER_DATA.corporateAlumniRelations;
  }

  /**
   * Returns Alumni Scholarship details
   */
  static getScholarshipInfo(): AlumniScholarshipInfo {
    return ALUMNI_CAREER_DATA.scholarship;
  }

  /**
   * Returns alumni portal sections
   */
  static getAlumniSections(): AlumniSectionMeta[] {
    return ALUMNI_CAREER_DATA.alumniSections;
  }

  /**
   * Returns verified alumni profiles
   */
  static getVerifiedProfiles(): VerifiedAlumniProfile[] {
    return ALUMNI_CAREER_DATA.verifiedProfiles;
  }

  /**
   * Returns role-aware connections
   */
  static getRoleConnections() {
    return ALUMNI_CAREER_DATA.roleConnections;
  }

  /**
   * Returns the entire verified dataset
   */
  static getAlumniData() {
    return ALUMNI_CAREER_DATA;
  }
}
