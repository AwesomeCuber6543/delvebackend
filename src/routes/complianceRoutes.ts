import express from 'express';
import { checkMFACompliance, checkRLSCompliance, checkPITRCompliance } from '../controllers/ComplianceController';

const router = express.Router();

// MFA compliance check endpoint
router.get('/mfa-check', checkMFACompliance);

// RLS compliance check endpoint
router.get('/rls-check', checkRLSCompliance);

// PITR compliance check endpoint
router.get('/pitr-check', checkPITRCompliance);

export default router;
