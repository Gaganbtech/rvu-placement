export interface ProgrammeBreakdown {
  programmeName: string;
  eligibleCount: number;
  level: 'Undergraduate' | 'Postgraduate';
}

export interface SchoolEligibleTalent {
  schoolId: string;
  schoolName: string;
  totalEligible: number;
  programmes: ProgrammeBreakdown[];
}

export const TOTAL_ELIGIBLE_STUDENTS = 1608;

export const ELIGIBLE_STUDENTS_BREAKDOWN: SchoolEligibleTalent[] = [
  {
    schoolId: 'so-cse',
    schoolName: 'School of Computer Science & Engineering',
    totalEligible: 737,
    programmes: [
      { programmeName: 'B.Tech. (Hons.)', eligibleCount: 547, level: 'Undergraduate' },
      { programmeName: 'B.Sc. (Hons.)', eligibleCount: 172, level: 'Undergraduate' },
      { programmeName: 'M.Tech.', eligibleCount: 18, level: 'Postgraduate' }
    ]
  },
  {
    schoolId: 'so-economics-business',
    schoolName: 'School of Economics & Business',
    totalEligible: 529,
    programmes: [
      { programmeName: 'B.Sc. (Hons.) Economics', eligibleCount: 4, level: 'Undergraduate' },
      { programmeName: 'M.Sc. Economics', eligibleCount: 16, level: 'Postgraduate' },
      { programmeName: 'BBA (Hons.)', eligibleCount: 162, level: 'Undergraduate' },
      { programmeName: 'B.Com. (Hons.)', eligibleCount: 170, level: 'Undergraduate' },
      { programmeName: 'MBA', eligibleCount: 177, level: 'Postgraduate' }
    ]
  },
  {
    schoolId: 'so-design',
    schoolName: 'School of Design & Innovation',
    totalEligible: 157,
    programmes: [
      { programmeName: 'B.Des. (Hons.)', eligibleCount: 123, level: 'Undergraduate' },
      { programmeName: 'M.Des.', eligibleCount: 34, level: 'Postgraduate' }
    ]
  },
  {
    schoolId: 'so-law',
    schoolName: 'School of Law',
    totalEligible: 105,
    programmes: [
      { programmeName: 'B.Sc. (Hons.) – Criminology, Cyber Law and Forensic Sciences', eligibleCount: 70, level: 'Undergraduate' },
      { programmeName: 'LL.M.', eligibleCount: 35, level: 'Postgraduate' }
    ]
  },
  {
    schoolId: 'so-liberal-arts',
    schoolName: 'School of Liberal Arts & Sciences',
    totalEligible: 59,
    programmes: [
      { programmeName: 'B.Sc. (Hons.) – Psychology', eligibleCount: 30, level: 'Undergraduate' },
      { programmeName: 'B.Sc. (Hons.) – Environmental Science', eligibleCount: 2, level: 'Undergraduate' },
      { programmeName: 'B.A. (Hons.) – Politics and International Relations', eligibleCount: 4, level: 'Undergraduate' },
      { programmeName: 'M.Sc. – Psychology', eligibleCount: 23, level: 'Postgraduate' }
    ]
  },
  {
    schoolId: 'so-film-media',
    schoolName: 'School of Film, Media & Creative Arts',
    totalEligible: 4,
    programmes: [
      { programmeName: 'B.Sc. (Hons.) – Filmmaking', eligibleCount: 4, level: 'Undergraduate' }
    ]
  }
];
