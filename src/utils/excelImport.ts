import * as XLSX from 'xlsx';
import type { Student, EligibilityStatus, PlacementOverallStatus } from '../data/platform/types';
import { RVU_OFFICIAL_SCHOOLS } from '../data/schools';

export interface ValidatedImportRow {
  rowNumber: number;
  raw: Record<string, any>;
  studentId: string;
  name: string;
  email: string;
  school: string;
  programme: string;
  batch: string;
  graduationYear: number;
  cgpa: number;
  activeBacklogs: number;
  eligibilityStatus: EligibilityStatus;
  placementStatus: PlacementOverallStatus;
  status: 'NEW' | 'UPDATE' | 'WARNING' | 'ERROR';
  errors: string[];
  warnings: string[];
  transformedStudent?: Partial<Student>;
}

export interface ParseExcelResult {
  fileName: string;
  fileSize: string;
  totalRows: number;
  validCount: number;
  updateCount: number;
  newCount: number;
  warningCount: number;
  errorCount: number;
  rows: ValidatedImportRow[];
}

// 1. Downloadable Excel Template Generator
export function generateExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Master Data Headers & Sample Records
  const headers = [
    'Student ID',
    'University Register Number',
    'Full Name',
    'Email',
    'Phone',
    'School',
    'Programme',
    'Specialization',
    'Batch',
    'Academic Year',
    'Graduation Year',
    'Semester',
    'CGPA',
    'Backlogs',
    'Placement Eligibility',
    'Placement Status',
    'Resume Status',
    'Skills',
    'LinkedIn URL',
    'GitHub URL',
    'Portfolio URL',
    'Internship Status',
    'Internship Company',
    'Internship Duration',
    'Offer Status',
    'Offer Company',
    'Offer Package',
    'Joining Status',
    'Remarks'
  ];

  const sampleRows = [
    [
      'RVU2023CSE501',
      '2023BCSE501',
      'Aarav Sharma',
      'aarav.s@rvu.edu.in',
      '+91 98860 11111',
      'School of Computer Science and Engineering',
      'B.Tech (Hons.) Computer Science & Engineering',
      'Artificial Intelligence',
      '2023–2027',
      '3rd Year (Semester VI)',
      2027,
      6,
      8.65,
      0,
      'Eligible',
      'Participating',
      'Uploaded',
      'React, Python, TypeScript, Docker',
      'https://linkedin.com/in/aarav-sharma-demo',
      'https://github.com/aarav-demo',
      'https://aarav.dev',
      'Ongoing',
      'Tech Corp',
      '3 Months',
      'None',
      '',
      '',
      '',
      'Verified via Academic Council'
    ],
    [
      'RVU2023BBA502',
      '2023BBBA502',
      'Neha Kulkarni',
      'neha.k@rvu.edu.in',
      '+91 98860 22222',
      'School of Business',
      'BBA (Hons.)',
      'Finance & Corporate Valuation',
      '2023–2027',
      '3rd Year (Semester VI)',
      2027,
      6,
      8.92,
      0,
      'Eligible',
      'Participating',
      'Uploaded',
      'Financial Modeling, Excel, Valuation',
      'https://linkedin.com/in/neha-k-demo',
      '',
      '',
      'Completed',
      'Global Advisory',
      '2 Months',
      'None',
      '',
      '',
      '',
      'Dean List Honors'
    ]
  ];

  const dataSheet = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  
  // Set column widths
  dataSheet['!cols'] = headers.map(() => ({ wch: 24 }));
  XLSX.utils.book_append_sheet(wb, dataSheet, 'Student_Master');

  // Sheet 2: Official Instructions & Data Validations
  const instructions = [
    ['RV UNIVERSITY PLACEMENT COMMAND CENTER'],
    ['STUDENT MASTER DATA IMPORT GUIDELINES & SPECIFICATIONS'],
    [''],
    ['Field Name', 'Mandatory / Optional', 'Accepted Values / Format', 'Instructions & Verification Rules'],
    ['Student ID', 'MANDATORY', 'Format: RVU[Year][SchoolCode][Roll]', 'Must be strictly unique across university records (e.g. RVU2023CSE042).'],
    ['University Register Number', 'MANDATORY', 'Alphanumeric ID', 'Official institutional registration number.'],
    ['Full Name', 'MANDATORY', 'Alphabetical text', 'Student legal name as per university transcripts.'],
    ['Email', 'MANDATORY', 'student.name@rvu.edu.in', 'Must be a valid official @rvu.edu.in email address.'],
    ['Phone', 'OPTIONAL', '+91 98860 00000', '10-digit mobile phone number.'],
    ['School', 'MANDATORY', 'Official School Name', 'Must match one of the 9 official RVU schools: School of Computer Science and Engineering, School of Design and Innovation, School of Business, School of Economics and Public Policy, School of Liberal Arts and Sciences, School of Law, School of Film, Media and Creative Arts, School for Continuing Education & Professional Studies, School of Allied and Healthcare Professions.'],
    ['Programme', 'MANDATORY', 'Programme title', 'Official academic programme name (e.g. B.Tech (Hons.), B.Des. (Hons.), BBA (Hons.)).'],
    ['Batch', 'MANDATORY', 'e.g. 2023–2027', 'Academic admission and graduation bracket.'],
    ['Graduation Year', 'MANDATORY', '4-digit year (e.g. 2027)', 'Target completion year for placement drive matching.'],
    ['CGPA', 'MANDATORY', '0.00 to 10.00', 'Cumulative Grade Point Average across completed semesters.'],
    ['Backlogs', 'MANDATORY', 'Integer (e.g. 0)', 'Number of active/pending backlog subjects.'],
    ['Placement Eligibility', 'MANDATORY', 'Eligible | Not Eligible | Under Review', 'Central Placement Office institutional clearance.'],
    ['Placement Status', 'MANDATORY', 'Not Started | Eligible | Participating | Selected | Placed | Not Placed', 'Current operational recruitment status.'],
    ['Skills', 'OPTIONAL', 'Comma-separated keywords', 'Key competencies e.g. "React, JavaScript, Python, Git"'],
    [''],
    ['DUPLICATE HANDLING POLICY:'],
    ['When an existing Student ID is detected during import, the default action is "Add New + Update Existing".'],
    ['Existing application history, interview slots, and verified placement offers will remain securely linked.'],
    [''],
    ['Tagline: "Go, change the world"']
  ];

  const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
  instructionSheet['!cols'] = [{ wch: 30 }, { wch: 22 }, { wch: 35 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, instructionSheet, 'Instructions');

  // Trigger browser download
  XLSX.writeFile(wb, 'RVU_Student_Placement_Import_Template.xlsx');
}

// 2. Parse and Validate Excel File
export async function parseAndValidateExcel(
  file: File,
  existingStudents: Student[]
): Promise<ParseExcelResult> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Use the first sheet or sheet named 'Student_Master'
  const sheetName = workbook.SheetNames.includes('Student_Master') ? 'Student_Master' : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const existingMap = new Map(existingStudents.map(s => [s.id.toUpperCase(), s]));
  const seenIdsInBatch = new Set<string>();

  const validSchools = new Set(RVU_OFFICIAL_SCHOOLS.map(s => s.name.toLowerCase()));

  const validatedRows: ValidatedImportRow[] = [];
  let validCount = 0;
  let updateCount = 0;
  let newCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // Excel row number (1-indexed + header)

    // Normalize keys (trim whitespace and handle potential capitalization differences)
    const getVal = (keyName: string) => {
      const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === keyName.trim().toLowerCase());
      return foundKey ? String(row[foundKey]).trim() : '';
    };

    const studentId = getVal('Student ID');
    const registerNum = getVal('University Register Number') || getVal('Register Number');
    const name = getVal('Full Name') || getVal('Name');
    const email = getVal('Email');
    const phone = getVal('Phone');
    const school = getVal('School');
    const programme = getVal('Programme');
    const specialization = getVal('Specialization');
    const batch = getVal('Batch') || '2023–2027';
    const graduationYearStr = getVal('Graduation Year') || '2027';
    const cgpaStr = getVal('CGPA');
    const backlogsStr = getVal('Backlogs') || '0';
    const eligibilityVal = getVal('Placement Eligibility') || 'Eligible';
    const statusVal = getVal('Placement Status') || 'Eligible';
    const skillsStr = getVal('Skills');

    const errors: string[] = [];
    const warnings: string[] = [];

    // --- RULE VALIDATIONS ---

    // 1. Mandatory Student ID
    if (!studentId) {
      errors.push('Student ID is required.');
    } else if (seenIdsInBatch.has(studentId.toUpperCase())) {
      errors.push(`Duplicate Student ID "${studentId}" found multiple times within this import file.`);
    } else {
      seenIdsInBatch.add(studentId.toUpperCase());
    }

    // 2. Mandatory Full Name
    if (!name) {
      errors.push('Full Name is required.');
    }

    // 3. Email Validation
    if (!email) {
      errors.push('Email is required.');
    } else if (!email.includes('@')) {
      errors.push('Email address is invalid.');
    } else if (!email.endsWith('@rvu.edu.in')) {
      warnings.push('Email is not an official @rvu.edu.in institutional domain.');
    }

    // 4. Mandatory School & Official Validation
    if (!school) {
      errors.push('School is required.');
    } else if (!validSchools.has(school.toLowerCase())) {
      // Check partial match
      const matched = RVU_OFFICIAL_SCHOOLS.find(s => 
        school.toLowerCase().includes(s.shortName.toLowerCase()) || 
        s.name.toLowerCase().includes(school.toLowerCase())
      );
      if (matched) {
        warnings.push(`School name "${school}" mapped to official title: "${matched.name}".`);
      } else {
        errors.push(`Unknown school "${school}". Must match one of the 9 official RVU schools.`);
      }
    }

    // 5. Mandatory Programme
    if (!programme) {
      errors.push('Programme is required.');
    }

    // 6. CGPA numeric validation
    const cgpa = parseFloat(cgpaStr);
    if (!cgpaStr) {
      errors.push('CGPA is required.');
    } else if (isNaN(cgpa) || cgpa < 0 || cgpa > 10.0) {
      errors.push(`CGPA "${cgpaStr}" is invalid. Must be a numeric value between 0.00 and 10.00.`);
    }

    // 7. Backlogs validation
    const backlogs = parseInt(backlogsStr, 10);
    if (isNaN(backlogs) || backlogs < 0) {
      errors.push(`Backlogs count "${backlogsStr}" is invalid.`);
    }

    // 8. Graduation Year validation
    const gradYear = parseInt(graduationYearStr, 10);
    if (isNaN(gradYear) || gradYear < 2024 || gradYear > 2035) {
      errors.push(`Graduation year "${graduationYearStr}" is invalid.`);
    }

    // 9. Eligibility normalization
    let eligibilityStatus: EligibilityStatus = 'ELIGIBLE';
    const normElig = eligibilityVal.toLowerCase();
    if (normElig.includes('not')) {
      eligibilityStatus = 'NOT_ELIGIBLE';
    } else if (normElig.includes('review')) {
      eligibilityStatus = 'UNDER_REVIEW';
    } else if (normElig.includes('elig')) {
      eligibilityStatus = 'ELIGIBLE';
    } else {
      warnings.push(`Eligibility value "${eligibilityVal}" normalized to Eligible.`);
    }

    // 10. Placement Status normalization
    let placementStatus: PlacementOverallStatus = 'ELIGIBLE';
    const normStat = statusVal.toLowerCase();
    if (normStat.includes('placed')) {
      placementStatus = 'PLACED';
    } else if (normStat.includes('selected')) {
      placementStatus = 'SELECTED';
    } else if (normStat.includes('partic')) {
      placementStatus = 'PARTICIPATING';
    } else if (normStat.includes('not start')) {
      placementStatus = 'NOT_STARTED';
    } else if (normStat.includes('not plac')) {
      placementStatus = 'NOT_PLACED';
    } else {
      placementStatus = 'ELIGIBLE';
    }

    // Determine row classification (NEW vs UPDATE vs ERROR)
    const isExisting = studentId ? existingMap.has(studentId.toUpperCase()) : false;
    let rowStatus: 'NEW' | 'UPDATE' | 'WARNING' | 'ERROR' = 'NEW';

    if (errors.length > 0) {
      rowStatus = 'ERROR';
      errorCount++;
    } else if (warnings.length > 0) {
      rowStatus = 'WARNING';
      warningCount++;
      if (isExisting) updateCount++; else newCount++;
    } else if (isExisting) {
      rowStatus = 'UPDATE';
      updateCount++;
    } else {
      rowStatus = 'NEW';
      newCount++;
    }

    if (errors.length === 0) {
      validCount++;
    }

    // Transformed student model
    const skillsList = skillsStr
      ? skillsStr.split(',').map((s: string, idx: number) => ({
          id: `sk-imp-${idx}`,
          name: s.trim(),
          level: 'Intermediate' as const,
          category: 'Core Technical' as const,
          isVerified: true
        }))
      : [];

    const transformedStudent: Partial<Student> = {
      id: studentId,
      universityRegisterNumber: registerNum || `2023${studentId.replace(/\D/g, '')}`,
      name,
      email,
      phone,
      school,
      programme,
      specialization,
      batch,
      graduationYear: gradYear,
      cgpa: isNaN(cgpa) ? 7.5 : cgpa,
      activeBacklogs: isNaN(backlogs) ? 0 : backlogs,
      eligibilityStatus,
      placementStatus,
      skills: skillsList.length > 0 ? skillsList : undefined
    };

    validatedRows.push({
      rowNumber,
      raw: row,
      studentId,
      name,
      email,
      school,
      programme,
      batch,
      graduationYear: gradYear,
      cgpa: isNaN(cgpa) ? 0 : cgpa,
      activeBacklogs: isNaN(backlogs) ? 0 : backlogs,
      eligibilityStatus,
      placementStatus,
      status: rowStatus,
      errors,
      warnings,
      transformedStudent
    });
  });

  return {
    fileName: file.name,
    fileSize: `${(file.size / 1024).toFixed(1)} KB`,
    totalRows: rawRows.length,
    validCount,
    updateCount,
    newCount,
    warningCount,
    errorCount,
    rows: validatedRows
  };
}
