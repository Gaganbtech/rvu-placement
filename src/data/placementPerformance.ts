export interface SalaryTier {
  range: string;
  offerCountLabel: string;
  countApprox: number;
  description: string;
}

export const VERIFIED_PLACEMENT_PERFORMANCE = {
  reportingPeriod: '2025–26',
  sourceLabel: 'Source: RV University official placement information, 2025–26',
  eligibleStudents: 1608,
  totalOffersDisplay: '400+',
  totalOffersDetailed: 'Approximately 425 offers',
  recruitingOrgsDisplay: '250+',
  recruitingOrgsDescription: '250+ recruiting organizations participating during the 2025–26 reporting period',
  highestPackageDisplay: '₹43.5 LPA',
  highestPackageCompany: 'Aviatrix',
  additionalKeyOffer: {
    compensation: '₹33 LPA',
    company: 'Aviatrix'
  },
  multipleOffersPercent: 'Approximately 25%',
  multipleOffersDescription: 'Approximately 25% of placed students secured multiple employment offers',
  minimumCompensationDisplay: 'Approximately ₹4 LPA',
  
  salaryDistribution: [
    {
      range: '₹20–33 LPA',
      offerCountLabel: '~20 offers',
      countApprox: 20,
      description: 'Elite technology, algorithmic engineering & quantitative roles'
    },
    {
      range: '₹10–20 LPA',
      offerCountLabel: '~40–50 offers',
      countApprox: 45,
      description: 'Product innovation, consulting & enterprise engineering tracks'
    },
    {
      range: 'Below ₹10 LPA',
      offerCountLabel: '~80–90 offers',
      countApprox: 85,
      description: 'Core software, business analytics & multidisciplinary graduate positions'
    }
  ] as SalaryTier[]
};
