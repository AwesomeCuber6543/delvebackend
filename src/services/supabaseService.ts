import { Organization, OrganizationMember, MFACheckResult, Project, Table, RLSCheckResult, ProjectTableInfo, ProjectBackupInfo, PITRCheckResult } from '../types';
import { supabaseApiClient } from '../utils/httpClient';

export class SupabaseService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getOrganizations(): Promise<Organization[]> {
    try {
      const client = supabaseApiClient(this.token);
      const response = await client.get('/organizations');
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  }

  async getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
    try {
      const client = supabaseApiClient(this.token);
      const response = await client.get(`/organizations/${orgId}/members`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for organization ${orgId}:`, error);
      throw error;
    }
  }

  async checkMFACompliance(): Promise<MFACheckResult> {
    try {
      const organizations = await this.getOrganizations();
      
      const passingUsers: OrganizationMember[] = [];
      const failingUsers: OrganizationMember[] = [];
      
      for (const org of organizations) {
        const members = await this.getOrganizationMembers(org.id);
        
        for (const member of members) {
          if (member.mfa_enabled) {
            passingUsers.push(member);
          } else {
            failingUsers.push(member);
          }
        }
      }
      
      const totalUsers = passingUsers.length + failingUsers.length;
      const passingCount = passingUsers.length;
      const failingCount = failingUsers.length;
      const percentageCompliant = totalUsers > 0 
        ? Math.round((passingCount / totalUsers) * 100) 
        : 0;
      
      return {
        passing: passingUsers,
        failing: failingUsers,
        summary: {
          totalUsers,
          passingCount,
          failingCount,
          percentageCompliant
        }
      };
    } catch (error) {
      console.error('Error checking MFA compliance:', error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const client = supabaseApiClient(this.token);
      const response = await client.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProjectTables(projectId: string): Promise<Table[]> {
    try {
      const client = supabaseApiClient(this.token);
      const response = await client.post(`/projects/${projectId}/database/query`, {
        query: "SELECT * FROM pg_tables WHERE schemaname = 'public'"
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching tables for project ${projectId}:`, error);
      throw error;
    }
  }

  async checkRLSCompliance(): Promise<RLSCheckResult> {
    try {
      const projects = await this.getProjects();
      
      const passingTables: Table[] = [];
      const failingTables: Table[] = [];
      const projectDetails: ProjectTableInfo[] = [];
      
      for (const project of projects) {
        const tables = await this.getProjectTables(project.id);
        
        projectDetails.push({
          project,
          tables
        });
        
        for (const table of tables) {
          if (table.rowsecurity) {
            passingTables.push(table);
          } else {
            failingTables.push(table);
          }
        }
      }
      
      const totalTables = passingTables.length + failingTables.length;
      const passingCount = passingTables.length;
      const failingCount = failingTables.length;
      const percentageCompliant = totalTables > 0 
        ? Math.round((passingCount / totalTables) * 100) 
        : 0;
      
      return {
        passing: passingTables,
        failing: failingTables,
        projectDetails,
        summary: {
          totalTables,
          passingCount,
          failingCount,
          percentageCompliant
        }
      };
    } catch (error) {
      console.error('Error checking RLS compliance:', error);
      throw error;
    }
  }

  async getProjectBackupInfo(projectId: string): Promise<ProjectBackupInfo> {
    try {
      const client = supabaseApiClient(this.token);
      const response = await client.get(`/projects/${projectId}/database/backups`);
      const project = await this.getProjectById(projectId);
      
      return {
        id: project.id,
        name: project.name,
        region: project.region,
        pitr_enabled: response.data.pitr_enabled,
        walg_enabled: response.data.walg_enabled
      };
    } catch (error) {
      console.error(`Error fetching backup info for project ${projectId}:`, error);
      throw error;
    }
  }

  async getProjectById(projectId: string): Promise<Project> {
    try {
      const projects = await this.getProjects();
      const project = projects.find(p => p.id === projectId);
      
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      
      return project;
    } catch (error) {
      console.error(`Error fetching project with ID ${projectId}:`, error);
      throw error;
    }
  }

  async checkPITRCompliance(): Promise<PITRCheckResult> {
    try {
      const projects = await this.getProjects();
      
      const passingProjects: ProjectBackupInfo[] = [];
      const failingProjects: ProjectBackupInfo[] = [];
      
      for (const project of projects) {
        const backupInfo = await this.getProjectBackupInfo(project.id);
        
        if (backupInfo.pitr_enabled) {
          passingProjects.push(backupInfo);
        } else {
          failingProjects.push(backupInfo);
        }
      }
      
      const totalProjects = passingProjects.length + failingProjects.length;
      const passingCount = passingProjects.length;
      const failingCount = failingProjects.length;
      const percentageCompliant = totalProjects > 0 
        ? Math.round((passingCount / totalProjects) * 100) 
        : 0;
      
      return {
        passing: passingProjects,
        failing: failingProjects,
        summary: {
          totalProjects,
          passingCount,
          failingCount,
          percentageCompliant
        }
      };
    } catch (error) {
      console.error('Error checking PITR compliance:', error);
      throw error;
    }
  }

  async fixRLSForAllProjects(): Promise<{ success: boolean; message: string }> {
    try {
      const projects = await this.getProjects();
      
      let projectsProcessed = 0;
      
      for (const project of projects) {
        try {
          const client = supabaseApiClient(this.token);
          await client.post(`/projects/${project.id}/database/query`, {
            query: "DO $$ DECLARE table_rec RECORD; BEGIN FOR table_rec IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity LOOP EXECUTE FORMAT('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_rec.tablename); END LOOP; END; $$;"
          });
          
          projectsProcessed++;
        } catch (projectError) {
          console.error(`Error fixing RLS for project ${project.id}:`, projectError);
        }
      }
      
      return {
        success: true,
        message: `Successfully processed ${projectsProcessed} out of ${projects.length} projects.`
      };
    } catch (error) {
      console.error('Error fixing RLS for all projects:', error);
      throw error;
    }
  }
}
