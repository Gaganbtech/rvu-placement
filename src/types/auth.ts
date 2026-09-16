// Canonical User Roles for RVU CAREER HUB
export type UserRole = 'student' | 'recruiter' | 'placement';

// Backward-compatible role alias accepting legacy strings
export type AuthRole = UserRole | 'placement-cell' | 'management';

export interface AuthUser {
  id: string; // auth.users id
  profileId?: string; // profiles table id
  email: string;
  role: UserRole;
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
  email?: string;
  identifier?: string; // Backward-compatible alias for email
  password?: string;
  role?: AuthRole | 'management';
  rememberMe?: boolean;
  rememberDevice?: boolean;
}

export interface SafeAuthSession {
  authenticated: boolean;
  userId: string;
  role: UserRole;
  identifier: string;
  portal?: string;
  displayName: string;
  createdAt: string;
  expiresAt: number;
  lastActiveAt: number;
}

export type SecurityAuditEventType = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'ROLE_ESCALATION_BLOCKED'
  | 'SESSION_EXPIRED'
  | 'IDLE_TIMEOUT'
  | 'SESSION_TAMPER_DETECTED';

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  eventType: SecurityAuditEventType;
  actorId?: string;
  actorRole?: UserRole | 'unauthenticated';
  targetPath?: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
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

export interface PasswordResetResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface RegistrationResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailVerification?: boolean;
}

export interface RecruiterAccessRequestData {
  fullName: string;
  email: string;
  companyName: string;
  designation?: string;
  phone?: string;
  message?: string;
}

export interface AccessRequestResult {
  success: boolean;
  message?: string;
  error?: string;
}
