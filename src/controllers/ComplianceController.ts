import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabaseService';
import { logToFile } from '../utils/logger';

export const checkMFACompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    const supabaseService = new SupabaseService(token);
    
    const result = await supabaseService.checkMFACompliance();
    
    logToFile('MFA', result);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in MFA compliance check:', error);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};

export const checkRLSCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    const supabaseService = new SupabaseService(token);
    
    const result = await supabaseService.checkRLSCompliance();
    
    logToFile('RLS', result);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in RLS compliance check:', error);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};

export const checkPITRCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    const supabaseService = new SupabaseService(token);
    
    const result = await supabaseService.checkPITRCompliance();
    
    logToFile('PITR', result);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in PITR compliance check:', error);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};

export const fixRLS = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    const supabaseService = new SupabaseService(token);
    
    const result = await supabaseService.fixRLSForAllProjects();
    
    logToFile('RLS_FIX', { action: 'Enabled RLS on tables without it', result });
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in fixing RLS:', error);
    
    if (error.response) {

      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};
