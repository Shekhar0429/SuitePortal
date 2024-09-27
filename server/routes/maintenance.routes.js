import express from 'express';
import * as maintenanceController from '../controllers/maintenance.controller.js';

const router = express.Router();

// Routes handler for maintenance requests
router.post('/', maintenanceController.createMaintenanceRequest);
router.get('/', maintenanceController.getMaintenanceRequests);
router.put('/:id/close', maintenanceController.closeMaintenanceRequest);

export default router;
