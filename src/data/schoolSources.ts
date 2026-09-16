export interface SchoolSourceMap {
  schoolId: string;
  officialWebsite: string;
  sourceLabel: string;
  lastVerified: string;
  pages: {
    overview: string;
    programmes?: string;
    faculty?: string;
    research?: string;
    admissions?: string;
    events?: string;
    contact?: string;
  };
}

export const RVU_OFFICIAL_SOURCE_MAP: Record<string, SchoolSourceMap> = {
  'socse': {
    schoolId: 'socse',
    officialWebsite: 'https://socse.rvu.edu.in',
    sourceLabel: 'RV University Official Portal (socse.rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-computer-science-and-engineering/',
      programmes: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#programmes',
      faculty: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#faculty',
      research: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#research',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'sodi': {
    schoolId: 'sodi',
    officialWebsite: 'https://rvu.edu.in/school-of-design-and-innovation/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-design-and-innovation/',
      programmes: 'https://rvu.edu.in/school-of-design-and-innovation/#programmes',
      faculty: 'https://rvu.edu.in/school-of-design-and-innovation/#faculty',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'sob': {
    schoolId: 'sob',
    officialWebsite: 'https://rvu.edu.in/school-of-business/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-business/',
      programmes: 'https://rvu.edu.in/school-of-business/#programmes',
      faculty: 'https://rvu.edu.in/school-of-business/#faculty',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'sosepp': {
    schoolId: 'sosepp',
    officialWebsite: 'https://rvu.edu.in/school-of-economics-and-public-policy/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-economics-and-public-policy/',
      programmes: 'https://rvu.edu.in/school-of-economics-and-public-policy/#programmes',
      faculty: 'https://rvu.edu.in/school-of-economics-and-public-policy/#faculty',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'solas': {
    schoolId: 'solas',
    officialWebsite: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/',
      programmes: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/#programmes',
      faculty: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/#faculty',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'sol': {
    schoolId: 'sol',
    officialWebsite: 'https://rvu.edu.in/school-of-law/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-law/',
      programmes: 'https://rvu.edu.in/school-of-law/#programmes',
      faculty: 'https://rvu.edu.in/school-of-law/#faculty',
      research: 'https://rvu.edu.in/school-of-law/#research',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'sofmca': {
    schoolId: 'sofmca',
    officialWebsite: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/',
      programmes: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#programmes',
      faculty: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#faculty',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'sceps': {
    schoolId: 'sceps',
    officialWebsite: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/',
      programmes: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/#programmes',
      faculty: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/#leadership',
      admissions: 'https://admissions.rvu.edu.in'
    }
  },
  'soahp': {
    schoolId: 'soahp',
    officialWebsite: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    lastVerified: '2026-09-16',
    pages: {
      overview: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/',
      programmes: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/#programmes',
      faculty: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/#faculty',
      admissions: 'https://admissions.rvu.edu.in'
    }
  }
};
