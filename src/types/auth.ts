// Authentication and User State Types for RVU CAREER HUB

export type AuthRole = 'student' | 'recruiter' | 'placement-cell';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  displayName: string;
  avatar?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  createdAt: string;
  studentId?: string; // For student role
  companyName?: string; // For recruiter role
  department?: string; // For placement cell / recruiter
}

export interface UserSecuritySettings {
  passwordLastChangedAt?: string;
  twoFactorEnabled: boolean;
  passwordStrength: 'weak' | 'fair' | 'strong';
}

export interface NotificationChannels {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationPreferences {
  applicationUpdates: boolean;
  interviewUpdates: boolean;
  placementDrives: boolean;
  deadlines: boolean;
  offers: boolean;
  careerOpportunities: boolean;
  preparationReminders: boolean;
  systemNotifications: boolean;
  channels: NotificationChannels;
}

export interface CareerPreferences {
  preferredJobRoles: string[];
  preferredDomains: string[];
  preferredLocations: string[];
  workModes: ('On-site' | 'Hybrid' | 'Remote')[];
  internshipPreference: boolean;
  fullTimePreference: boolean;
  careerInterests: string[];
}

export interface PrivacySettings {
  profileVisibility: 'all-recruiters' | 'verified-recruiters' | 'private';
  recruiterVisibility: boolean;
  showSkillsToRecruiters: boolean;
  showResumeToRecruiters: boolean;
  careerProfileVisibility: boolean;
}

export interface ConnectedServices {
  googleWorkspace: boolean;
  linkedIn: boolean;
  gitHub: boolean;
  portfolio: boolean;
}

export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  reducedMotion: boolean;
  density: 'comfortable' | 'compact';
  notifications: NotificationPreferences;
  careerPreferences: CareerPreferences;
  privacySettings: PrivacySettings;
  connectedServices: ConnectedServices;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipMasked: string;
  current: boolean;
  lastActive: string;
}

export interface LoginCredentials {
  identifier: string;
  email?: string;
  password?: string;
  role?: AuthRole | 'management';
  rememberMe?: boolean;
  rememberDevice?: boolean;
}

export interface SafeAuthSession {
  authenticated: boolean;
  identifier: string;
  portal: AuthRole | 'management';
  role: AuthRole;
  displayName: string;
  userId: string;
  createdAt: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  redirectRoute?: string;
  error?: string;
}

export interface ChangePasswordResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface MagicLinkRequest {
  email: string;
  role: AuthRole;
}

export interface MagicLinkSendResult {
  success: boolean;
  message: string;
  provider: 'supabase' | 'development_preview';
  email: string;
  role: AuthRole;
  expiresInSeconds?: number;
  previewConfirmationUrl?: string;
  verificationUrl?: string;
  cooldownSeconds?: number;
  error?: string;
  isConfigMissing?: boolean;
}

export interface AuthCallbackOptions {
  token?: string;
  role?: AuthRole;
  searchParams?: URLSearchParams;
  hash?: string;
  hashParams?: URLSearchParams;
}

export interface AuthCallbackResult {
  success: boolean;
  user?: AuthUser;
  redirectRoute?: string;
  targetRoute?: string;
  error?: string;
}


