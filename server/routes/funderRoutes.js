import { Router } from 'express';
import funderController from '../controllers/fundersController.js';
const router = Router();

router.get('/', funderController.getAllFunders);
router.get('/:id', funderController.getFunderById);
router.post('/', funderController.createFunder);
router.put('/:id', funderController.updateFunder);
router.delete('/:id', funderController.deleteFunder);

export default router;
