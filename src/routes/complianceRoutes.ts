import express from 'express';
import { checkMFACompliance, checkRLSCompliance, checkPITRCompliance, fixRLS } from '../controllers/ComplianceController';

const router = express.Router();

// MFA compliance check endpoint
router.get('/mfa-check', checkMFACompliance);

// RLS compliance check endpoint
router.get('/rls-check', checkRLSCompliance);

// PITR compliance check endpoint
router.get('/pitr-check', checkPITRCompliance);

// Fix RLS endpoint
router.post('/fix-rls', fixRLS);

export default router;
