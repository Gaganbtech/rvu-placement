import {
  RVU_OFFICIAL_SCHOOLS,
  type SchoolInfo,
  type ProgrammeInfo,
  type FacultyMember,
  type ResearchCentre,
  type SchoolEvent
} from '../data/schools';

export class SchoolDataService {
  /**
   * Retrieves all verified RV University schools
   */
  static getSchools(): SchoolInfo[] {
    return RVU_OFFICIAL_SCHOOLS;
  }

  /**
   * Finds a school by its URL slug
   */
  static getSchoolBySlug(slug: string): SchoolInfo | undefined {
    return RVU_OFFICIAL_SCHOOLS.find(s => s.slug === slug || s.id === slug);
  }

  /**
   * Finds a school by its ID
   */
  static getSchoolById(id: string): SchoolInfo | undefined {
    return RVU_OFFICIAL_SCHOOLS.find(s => s.id === id);
  }

  /**
   * Retrieves all programmes for a specific school slug
   */
  static getSchoolProgrammes(schoolSlug: string): ProgrammeInfo[] {
    const school = this.getSchoolBySlug(schoolSlug);
    return school ? school.programmes : [];
  }

  /**
   * Retrieves a specific programme by school slug and programme slug
   */
  static getProgrammeBySlug(schoolSlug: string, programmeSlug: string): { school: SchoolInfo; programme: ProgrammeInfo } | undefined {
    const school = this.getSchoolBySlug(schoolSlug);
    if (!school) return undefined;
    const programme = school.programmes.find(p => p.slug === programmeSlug || p.id === programmeSlug);
    if (!programme) return undefined;
    return { school, programme };
  }

  /**
   * Retrieves all academic leadership and faculty members for a school
   */
  static getSchoolFaculty(schoolSlug: string): FacultyMember[] {
    const school = this.getSchoolBySlug(schoolSlug);
    if (!school) return [];
    return [...school.leadership, ...school.faculty];
  }

  /**
   * Retrieves research centres for a school
   */
  static getSchoolResearch(schoolSlug: string): ResearchCentre[] {
    const school = this.getSchoolBySlug(schoolSlug);
    return school?.research || [];
  }

  /**
   * Retrieves verified events for a school
   */
  static getSchoolEvents(schoolSlug: string): SchoolEvent[] {
    const school = this.getSchoolBySlug(schoolSlug);
    return school?.events || [];
  }

  /**
   * Searches and filters schools by text query and category
   */
  static searchSchools(query: string, category?: string): SchoolInfo[] {
    const cleanQuery = query.toLowerCase().trim();
    return RVU_OFFICIAL_SCHOOLS.filter(school => {
      const matchesCategory = !category || category === 'All' || school.category === category;
      if (!cleanQuery) return matchesCategory;

      const matchesText =
        school.name.toLowerCase().includes(cleanQuery) ||
        school.shortName.toLowerCase().includes(cleanQuery) ||
        school.description.toLowerCase().includes(cleanQuery) ||
        school.careerDomains.some(d => d.toLowerCase().includes(cleanQuery)) ||
        school.programmes.some(p => p.name.toLowerCase().includes(cleanQuery));

      return matchesCategory && matchesText;
    });
  }
}
