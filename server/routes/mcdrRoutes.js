import { Router } from 'express';
import mcdrController from '../controllers/mcdrController.js';

const router = Router();

router.get('/', mcdrController.getAllMCDR);
router.get('/:id', mcdrController.getMCDRById);
router.post('/', mcdrController.createMCDR);    
router.put('/:id', mcdrController.updateMCDR);
router.delete('/:id', mcdrController.deleteMCDR);

export default router;

