import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabaseService';

export const checkMFACompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create a new instance of the SupabaseService with the token
    const supabaseService = new SupabaseService(token);
    
    // Perform the MFA compliance check
    const result = await supabaseService.checkMFACompliance();
    
    // Return the results
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in MFA compliance check:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};

export const checkRLSCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create a new instance of the SupabaseService with the token
    const supabaseService = new SupabaseService(token);
    
    // Perform the RLS compliance check
    const result = await supabaseService.checkRLSCompliance();
    
    // Return the results
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in RLS compliance check:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};

export const checkPITRCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create a new instance of the SupabaseService with the token
    const supabaseService = new SupabaseService(token);
    
    // Perform the PITR compliance check
    const result = await supabaseService.checkPITRCompliance();
    
    // Return the results
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in PITR compliance check:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        error: 'Error from Supabase API',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: 'No response from Supabase API',
        details: 'The service might be unavailable'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};
