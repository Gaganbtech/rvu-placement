import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { ValidatedImportRow } from '../../../data/platform/types';
import { generateExcelTemplate, parseAndValidateExcel } from '../../../utils/excelImport';

interface StudentImportViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const StudentImportView: React.FC<StudentImportViewProps> = ({
  store,
  onNavigate
}) => {
  // Wizard steps: 'UPLOAD' | 'REVIEW' | 'SUCCESS'
  const [currentStep, setCurrentStep] = useState<'UPLOAD' | 'REVIEW' | 'SUCCESS'>('UPLOAD');
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Duplicate strategy
  const [duplicateStrategy, setDuplicateStrategy] = useState<'UPDATE_EXISTING' | 'SKIP_EXISTING'>('UPDATE_EXISTING');

  // Parsed validation result
  const [validationRows, setValidationRows] = useState<ValidatedImportRow[]>([]);
  const [previewFilter, setPreviewFilter] = useState<'ALL' | 'NEW' | 'UPDATE' | 'WARNING' | 'ERROR'>('ALL');

  // Commit result state
  const [committedCount, setCommittedCount] = useState(0);
  const [committedBatchId, setCommittedBatchId] = useState('');

  // Handle template download
  const handleDownloadTemplate = () => {
    generateExcelTemplate();
  };

  // Process selected file
  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      alert('Please upload an Excel spreadsheet (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);

    try {
      const results = await parseAndValidateExcel(selectedFile, store.students);
      setValidationRows(results.rows);
      setCurrentStep('REVIEW');
    } catch (err: unknown) {
      console.error('Failed to parse excel file:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error parsing file: ${msg}`);
    } finally {
      setIsParsing(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Derived counts
  const totalRows = validationRows.length;
  const newRows = validationRows.filter(r => r.status === 'NEW').length;
  const updateRows = validationRows.filter(r => r.status === 'UPDATE').length;
  const warningRows = validationRows.filter(r => r.status === 'WARNING').length;
  const errorRows = validationRows.filter(r => r.status === 'ERROR').length;
  
  // Rows ready to commit
  const committableRows = validationRows.filter(r => {
    if (r.status === 'ERROR') return false;
    if (duplicateStrategy === 'SKIP_EXISTING' && r.status === 'UPDATE') return false;
    return true;
  });

  // Filtered rows for the preview table
  const displayedRows = validationRows.filter(r => {
    if (previewFilter === 'ALL') return true;
    return r.status === previewFilter;
  });

  // Execute import commit
  const handleCommitImport = () => {
    if (committableRows.length === 0) {
      alert('No valid rows available to commit.');
      return;
    }

    const studentsToCommit = committableRows.map(r => r.transformedStudent || ({} as any));
    const newCount = committableRows.filter(r => r.status === 'NEW').length;
    const updatedCount = committableRows.filter(r => r.status === 'UPDATE').length;

    const record = store.commitStudentImport(studentsToCommit, {
      fileName: file?.name || 'Students_Master.xlsx',
      totalRecords: totalRows,
      successfulRecords: committableRows.length,
      newRecordsCount: newCount,
      updatedRecordsCount: updatedCount,
      failedRecords: errorRows,
      importedBy: 'Office of CAR (Placement Admin)',
      duplicateStrategy
    });

    setCommittedCount(committableRows.length);
    setCommittedBatchId(record.batchId);
    setCurrentStep('SUCCESS');
  };

  // Reset wizard
  const handleReset = () => {
    setFile(null);
    setValidationRows([]);
    setCurrentStep('UPLOAD');
    setPreviewFilter('ALL');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Step Header / Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gold-border/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              DATA INGESTION ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Multi-Rule Validator
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Student Cohort Excel Import
          </h1>
          <p className="text-xs text-rvu-muted">
            Batch import verified academic student master spreadsheets with real-time SIS conflict detection.
          </p>
        </div>

        {/* Wizard Step Indicators */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded-full border ${currentStep === 'UPLOAD' ? 'bg-gold text-navy-dark border-gold font-bold' : 'bg-navy-card text-rvu-muted border-white/10'}`}>
            1. Upload
          </span>
          <ArrowRight className="w-3 h-3 text-rvu-subtle" />
          <span className={`px-2.5 py-1 rounded-full border ${currentStep === 'REVIEW' ? 'bg-gold text-navy-dark border-gold font-bold' : 'bg-navy-card text-rvu-muted border-white/10'}`}>
            2. Validate
          </span>
          <ArrowRight className="w-3 h-3 text-rvu-subtle" />
          <span className={`px-2.5 py-1 rounded-full border ${currentStep === 'SUCCESS' ? 'bg-emerald-500 text-navy-dark border-emerald-400 font-bold' : 'bg-navy-card text-rvu-muted border-white/10'}`}>
            3. Commit
          </span>
        </div>
      </div>

      {/* STEP 1: UPLOAD & TEMPLATE */}
      {currentStep === 'UPLOAD' && (
        <div className="space-y-6">
          
          {/* Download Official Template Banner */}
          <div className="rounded-xl bg-gradient-to-r from-[#142330] via-[#101A22] to-[#142330] border border-gold-border/50 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-gold/15 border border-gold/40 text-gold shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-display">
                  Download Official RVU Student Master Template
                </h3>
                <p className="text-xs text-rvu-muted max-w-xl">
                  Contains the exact 29 required schema columns, formatted headers, sample data, and an embedded <strong>Instructions Sheet</strong> specifying valid School names, CGPA ranges, and program codes.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-semibold shadow transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download .XLSX Template</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-gold bg-gold/10 scale-[1.01]'
                : 'border-gold-border/60 hover:border-gold bg-[#111C26]/70 hover:bg-[#111C26]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              accept=".xlsx,.xls"
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center mx-auto">
                {isParsing ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>
              
              <h3 className="text-base font-bold text-white font-display">
                {isParsing ? 'Parsing & Validating Excel...' : 'Drop your filled Excel (.xlsx, .xls) file here'}
              </h3>
              
              <p className="text-xs text-rvu-muted">
                {isParsing
                  ? 'Analyzing headers, school validations, and student records...'
                  : 'Supports Microsoft Excel (.xlsx, .xls) up to 25 MB. The system will parse all 29 fields and validate them against RVU institutional constraints immediately.'}
              </p>

              {!isParsing && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-gold-border/40 text-xs font-mono text-gold transition-colors">
                    Browse Local Files
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Import Rules Guidance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exact Header Mapping</span>
              </div>
              <p className="text-[11px] text-rvu-muted">
                Row 1 must contain the schema headers: Student ID, Roll Number, Name, Email, School, Programme, Batch, Current CGPA, Backlogs, etc.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>Duplicate Handling</span>
              </div>
              <p className="text-[11px] text-rvu-muted">
                Rows with existing Student IDs can either update current profiles or be safely skipped. The choice is selected in the review screen.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Strict School Master</span>
              </div>
              <p className="text-[11px] text-rvu-muted">
                The School name must exactly match one of the 9 official RVU schools. Consult the Instructions sheet in the template.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: REVIEW & VALIDATE */}
      {currentStep === 'REVIEW' && (
        <div className="space-y-5">
          
          {/* File & Strategy Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl bg-[#111C26] border border-gold-border/40">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-gold shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">{file?.name}</div>
                <div className="text-[10px] font-mono text-rvu-subtle">
                  {totalRows} records parsed &bull; {(file?.size ? (file.size / 1024).toFixed(1) : '0')} KB
                </div>
              </div>
            </div>

            {/* Duplicate Strategy Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-rvu-muted font-mono hidden sm:inline">Conflict Strategy:</span>
              <div className="inline-flex rounded-lg bg-[#142330] p-1 border border-gold-border/40 text-xs">
                <button
                  onClick={() => setDuplicateStrategy('UPDATE_EXISTING')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    duplicateStrategy === 'UPDATE_EXISTING'
                      ? 'bg-gold text-navy-dark font-bold shadow'
                      : 'text-rvu-muted hover:text-white'
                  }`}
                >
                  Update Existing ({updateRows})
                </button>
                <button
                  onClick={() => setDuplicateStrategy('SKIP_EXISTING')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    duplicateStrategy === 'SKIP_EXISTING'
                      ? 'bg-gold text-navy-dark font-bold shadow'
                      : 'text-rvu-muted hover:text-white'
                  }`}
                >
                  Skip Existing
                </button>
              </div>
            </div>
          </div>

          {/* Validation Metrics Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => setPreviewFilter('ALL')}
              className={`p-3 rounded-xl border text-left transition-all ${
                previewFilter === 'ALL' ? 'border-gold bg-gold/10' : 'border-gold-border/30 bg-[#111C26]'
              }`}
            >
              <div className="text-[10px] font-mono text-rvu-subtle uppercase">Total Rows</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{totalRows}</div>
            </button>

            <button
              onClick={() => setPreviewFilter('NEW')}
              className={`p-3 rounded-xl border text-left transition-all ${
                previewFilter === 'NEW' ? 'border-emerald-400 bg-emerald-500/10' : 'border-gold-border/30 bg-[#111C26]'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-300 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Valid New</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{newRows}</div>
            </button>

            <button
              onClick={() => setPreviewFilter('UPDATE')}
              className={`p-3 rounded-xl border text-left transition-all ${
                previewFilter === 'UPDATE' ? 'border-sky-400 bg-sky-500/10' : 'border-gold-border/30 bg-[#111C26]'
              }`}
            >
              <div className="text-[10px] font-mono text-sky-300 uppercase flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span>Existing</span>
              </div>
              <div className="text-xl font-bold font-mono text-sky-400 mt-0.5">{updateRows}</div>
            </button>

            <button
              onClick={() => setPreviewFilter('WARNING')}
              className={`p-3 rounded-xl border text-left transition-all ${
                previewFilter === 'WARNING' ? 'border-amber-400 bg-amber-500/10' : 'border-gold-border/30 bg-[#111C26]'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-300 uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Warnings</span>
              </div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{warningRows}</div>
            </button>

            <button
              onClick={() => setPreviewFilter('ERROR')}
              className={`p-3 rounded-xl border text-left transition-all ${
                previewFilter === 'ERROR' ? 'border-rose-500 bg-rose-500/10' : 'border-gold-border/30 bg-[#111C26]'
              }`}
            >
              <div className="text-[10px] font-mono text-rose-300 uppercase flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                <span>Errors</span>
              </div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{errorRows}</div>
            </button>
          </div>

          {/* Validation Preview Table */}
          <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
            <div className="p-3 bg-[#0D161E] border-b border-gold-border/30 flex items-center justify-between text-xs">
              <span className="font-mono text-white font-semibold">
                Parsed Rows Preview ({displayedRows.length} showing)
              </span>
              <span className="text-[11px] font-mono text-rvu-subtle">
                Ready to commit: <strong className="text-emerald-400">{committableRows.length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto max-h-96 custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[#0E1720] border-b border-gold-border/30 text-rvu-subtle font-mono text-[10px] uppercase tracking-wider z-10">
                  <tr>
                    <th className="p-2.5 w-12 text-center">Row</th>
                    <th className="p-2.5 w-24">Status</th>
                    <th className="p-2.5">Student ID & Name</th>
                    <th className="p-2.5">School & Programme</th>
                    <th className="p-2.5 text-center">CGPA / Backlogs</th>
                    <th className="p-2.5">Validation Diagnostics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {displayedRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-rvu-muted">
                        No rows in this filter category.
                      </td>
                    </tr>
                  ) : (
                    displayedRows.map((row) => {
                      return (
                        <tr
                          key={row.rowNumber}
                          className={`hover:bg-white/5 transition-colors ${
                            row.status === 'ERROR'
                              ? 'bg-rose-950/20'
                              : row.status === 'WARNING'
                              ? 'bg-amber-950/15'
                              : row.status === 'UPDATE'
                              ? 'bg-sky-950/15'
                              : ''
                          }`}
                        >
                          <td className="p-2.5 text-center text-rvu-subtle">
                            #{row.rowNumber}
                          </td>

                          <td className="p-2.5">
                            {row.status === 'NEW' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                NEW
                              </span>
                            )}
                            {row.status === 'UPDATE' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                UPDATE
                              </span>
                            )}
                            {row.status === 'WARNING' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                WARNING
                              </span>
                            )}
                            {row.status === 'ERROR' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                ERROR
                              </span>
                            )}
                          </td>

                          <td className="p-2.5">
                            <div className="font-sans font-semibold text-white">
                              {row.name || '(Missing Name)'}
                            </div>
                            <div className="text-[10px] text-rvu-subtle">
                              ID: {row.studentId || '(Missing ID)'} &bull; {row.email}
                            </div>
                          </td>

                          <td className="p-2.5">
                            <div className="font-sans text-rvu-text truncate max-w-[200px]">
                              {row.programme}
                            </div>
                            <div className="text-[10px] text-rvu-subtle truncate max-w-[200px]">
                              {row.school}
                            </div>
                          </td>

                          <td className="p-2.5 text-center">
                            <span className="font-bold text-white">{row.cgpa || 0}</span>
                            <span className="text-[10px] text-rvu-subtle block">
                              {row.activeBacklogs || 0} Backlogs
                            </span>
                          </td>

                          <td className="p-2.5 font-sans">
                            {row.errors.length > 0 && (
                              <div className="space-y-0.5 text-[11px] text-rose-400">
                                {row.errors.map((err, i) => (
                                  <div key={i} className="flex items-center gap-1">
                                    <XCircle className="w-3 h-3 shrink-0" />
                                    <span>{err}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {row.warnings.length > 0 && (
                              <div className="space-y-0.5 text-[11px] text-amber-400">
                                {row.warnings.map((warn, i) => (
                                  <div key={i} className="flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    <span>{warn}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {row.errors.length === 0 && row.warnings.length === 0 && (
                              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>All validations passed. Ready.</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#111C26] border border-gold-border/40">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-navy-card hover:bg-white/10 text-rvu-muted hover:text-white text-xs font-medium border border-gold-border/30 transition-colors"
            >
              &larr; Choose Different File
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                disabled={committableRows.length === 0}
                onClick={handleCommitImport}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-navy-dark hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold shadow-lg transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Commit {committableRows.length} Records to SIS Roster</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION */}
      {currentStep === 'SUCCESS' && (
        <div className="rounded-2xl bg-[#111C26] border border-gold-border/60 p-8 text-center max-w-xl mx-auto space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white font-display">
              Import Successfully Committed!
            </h3>
            <p className="text-xs text-rvu-muted">
              {committedCount} student records have been written into the institutional platform store and synchronized with the Placement Office.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#142330] border border-gold-border/30 text-left font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-rvu-subtle">Batch Reference ID:</span>
              <span className="text-gold font-bold">{committedBatchId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rvu-subtle">File Ingested:</span>
              <span className="text-white">{file?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rvu-subtle">Committed Rows:</span>
              <span className="text-emerald-400 font-bold">{committedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rvu-subtle">Timestamp:</span>
              <span className="text-white">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/management/students')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold transition-all shadow"
            >
              <Eye className="w-4 h-4" />
              <span>View In Student Master</span>
            </button>
            <button
              onClick={() => onNavigate('/management/students/import-history')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-navy-card hover:bg-white/10 text-white text-xs font-medium border border-gold-border/40 transition-colors"
            >
              View Batch History
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
