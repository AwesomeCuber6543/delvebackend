export interface Organization {
  id: string;
  name: string;
}

export interface OrganizationMember {
  user_id: string;
  user_name: string;
  email: string;
  role_name: string;
  mfa_enabled: boolean;
}

export interface MFACheckResult {
  passing: OrganizationMember[];
  failing: OrganizationMember[];
  summary: {
    totalUsers: number;
    passingCount: number;
    failingCount: number;
    percentageCompliant: number;
  };
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  region: string;
  status: string;
  database: {
    host: string;
    version: string;
    postgres_engine: string;
    release_channel: string;
  };
  created_at: string;
}

export interface Table {
  schemaname: string;
  tablename: string;
  tableowner: string;
  tablespace: string | null;
  hasindexes: boolean;
  hasrules: boolean;
  hastriggers: boolean;
  rowsecurity: boolean;
}

export interface ProjectTableInfo {
  project: Project;
  tables: Table[];
}

export interface RLSCheckResult {
  passing: Table[];
  failing: Table[];
  projectDetails: ProjectTableInfo[];
  summary: {
    totalTables: number;
    passingCount: number;
    failingCount: number;
    percentageCompliant: number;
  };
}

export interface ProjectBackupInfo {
  id: string;
  name: string;
  region: string;
  pitr_enabled: boolean;
  walg_enabled: boolean;
}

export interface PITRCheckResult {
  passing: ProjectBackupInfo[];
  failing: ProjectBackupInfo[];
  summary: {
    totalProjects: number;
    passingCount: number;
    failingCount: number;
    percentageCompliant: number;
  };
}
