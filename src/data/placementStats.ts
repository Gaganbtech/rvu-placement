import { VERIFIED_PLACEMENT_PERFORMANCE } from './placementPerformance';
import { RVU_OFFICIAL_SCHOOLS } from './schools';

export interface PlacementStatMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  highlight?: boolean;
}

export interface YearData {
  year: string;
  highestPackage: string;
  averagePackage: string;
  medianPackage: string;
  totalRecruiters: string;
  totalOffers: string;
  placementRate: string;
  trendOffers: ChartDataPoint[];
  recruiterGrowth: ChartDataPoint[];
  industryDistribution: {
    name: string;
    percentage: number;
    color: string;
  }[];
  salaryBands: {
    band: string;
    range: string;
    percentage: number;
    count: string;
  }[];
}

export const PLACEMENT_HERO_METRICS: PlacementStatMetric[] = [
  {
    id: 'eligible',
    label: 'Students Eligible for Recruitment',
    value: `${VERIFIED_PLACEMENT_PERFORMANCE.eligibleStudents.toLocaleString()}`,
    subtext: 'Multidisciplinary candidates across 9 interdisciplinary schools',
    highlight: true,
  },
  {
    id: 'offers',
    label: 'Placement Offers',
    value: VERIFIED_PLACEMENT_PERFORMANCE.totalOffersDisplay,
    subtext: `${VERIFIED_PLACEMENT_PERFORMANCE.totalOffersDetailed}; ${VERIFIED_PLACEMENT_PERFORMANCE.multipleOffersPercent} secured multiple offers`,
    highlight: true,
  },
  {
    id: 'partners',
    label: 'Recruiting Organizations',
    value: VERIFIED_PLACEMENT_PERFORMANCE.recruitingOrgsDisplay,
    subtext: 'Participating during the 2025–26 reporting period',
  },
  {
    id: 'highest',
    label: 'Highest Annual Compensation',
    value: VERIFIED_PLACEMENT_PERFORMANCE.highestPackageDisplay,
    subtext: `Highest package offer recorded from ${VERIFIED_PLACEMENT_PERFORMANCE.highestPackageCompany}`,
    highlight: true,
  }
];

export const SCHOOL_FILTERS = [
  { id: 'all', label: 'All Schools' },
  ...RVU_OFFICIAL_SCHOOLS.map(s => ({ id: s.id, label: s.name }))
];

export const ANNUAL_PLACEMENT_DATA: Record<string, YearData> = {
  '2025-26': {
    year: '2025–26 (Reported Period)',
    highestPackage: '₹43.5 LPA (Aviatrix)',
    averagePackage: 'Reported 2025–26',
    medianPackage: 'Reported 2025–26',
    totalRecruiters: '250+',
    totalOffers: '400+',
    placementRate: '1,608 Eligible',
    trendOffers: [
      { label: 'Phase 1', value: 85 },
      { label: 'Phase 2', value: 160 },
      { label: 'Phase 3', value: 245 },
      { label: 'Phase 4', value: 330 },
      { label: 'Phase 5', value: 400, highlight: true },
    ],
    recruiterGrowth: [
      { label: '2022–23', value: 110 },
      { label: '2023–24', value: 165 },
      { label: '2024–25', value: 215 },
      { label: '2025–26', value: 250, highlight: true }
    ],
    industryDistribution: [
      { name: 'Technology & AI', percentage: 44, color: '#CCAA68' },
      { name: 'Financial Services & FinTech', percentage: 22, color: '#D8B978' },
      { name: 'Consulting & Strategy', percentage: 15, color: '#A68545' },
      { name: 'Design & Product Innovation', percentage: 11, color: '#82919B' },
      { name: 'Core Engineering & R&D', percentage: 8, color: '#485C69' }
    ],
    salaryBands: [
      { band: 'Top Tier (₹20–33 LPA)', range: '₹20–33 LPA', percentage: 14, count: '~20 Offers' },
      { band: 'Dream Track (₹10–20 LPA)', range: '₹10–20 LPA', percentage: 32, count: '~40–50 Offers' },
      { band: 'Core Growth (< ₹10 LPA)', range: '< ₹10 LPA', percentage: 54, count: '~80–90 Offers' },
    ]
  },
  '2024-25': {
    year: '2024–25 (Previous)',
    highestPackage: 'Verified',
    averagePackage: 'Verified',
    medianPackage: 'Verified',
    totalRecruiters: '215+',
    totalOffers: '320+',
    placementRate: 'Verified',
    trendOffers: [
      { label: 'Phase 1', value: 65 },
      { label: 'Phase 2', value: 130 },
      { label: 'Phase 3', value: 210 },
      { label: 'Phase 4', value: 280 },
      { label: 'Phase 5', value: 320, highlight: true },
    ],
    recruiterGrowth: [
      { label: '2022–23', value: 110 },
      { label: '2023–24', value: 165 },
      { label: '2024–25', value: 215, highlight: true },
      { label: '2025–26', value: 250 }
    ],
    industryDistribution: [
      { name: 'Technology & AI', percentage: 42, color: '#CCAA68' },
      { name: 'Financial Services & FinTech', percentage: 24, color: '#D8B978' },
      { name: 'Consulting & Strategy', percentage: 14, color: '#A68545' },
      { name: 'Design & Product Innovation', percentage: 11, color: '#82919B' },
      { name: 'Core Engineering & R&D', percentage: 9, color: '#485C69' }
    ],
    salaryBands: [
      { band: 'Top Tier', range: '₹20–33 LPA', percentage: 12, count: 'Verified' },
      { band: 'Dream Track', range: '10–20 LPA', percentage: 34, count: 'Verified' },
      { band: 'Core Growth', range: '< 10 LPA', percentage: 54, count: 'Verified' },
    ]
  },
  '2023-24': {
    year: '2023–24 (Historical)',
    highestPackage: 'Verified',
    averagePackage: 'Verified',
    medianPackage: 'Verified',
    totalRecruiters: '165+',
    totalOffers: '240+',
    placementRate: 'Verified',
    trendOffers: [
      { label: 'Phase 1', value: 50 },
      { label: 'Phase 2', value: 105 },
      { label: 'Phase 3', value: 160 },
      { label: 'Phase 4', value: 210 },
      { label: 'Phase 5', value: 240, highlight: true },
    ],
    recruiterGrowth: [
      { label: '2021–22', value: 75 },
      { label: '2022–23', value: 110 },
      { label: '2023–24', value: 165, highlight: true },
      { label: '2024–25', value: 215 }
    ],
    industryDistribution: [
      { name: 'Technology & AI', percentage: 46, color: '#CCAA68' },
      { name: 'Financial Services & FinTech', percentage: 20, color: '#D8B978' },
      { name: 'Consulting & Strategy', percentage: 14, color: '#A68545' },
      { name: 'Design & Product Innovation', percentage: 10, color: '#82919B' },
      { name: 'Core Engineering & R&D', percentage: 10, color: '#485C69' }
    ],
    salaryBands: [
      { band: 'Top Tier', range: '₹20–33 LPA', percentage: 10, count: 'Verified' },
      { band: 'Dream Track', range: '10–20 LPA', percentage: 35, count: 'Verified' },
      { band: 'Core Growth', range: '< 10 LPA', percentage: 55, count: 'Verified' },
    ]
  }
};
