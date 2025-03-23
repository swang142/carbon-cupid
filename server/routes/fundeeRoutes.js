import { Router } from 'express';
import fundeeControllers from '../controllers/fundeeControllers.js';

const router = Router();

router.get('/', fundeeControllers.getAllFundees);
router.get('/:id', fundeeControllers.getFundeeById);
router.post('/', fundeeControllers.createFundee);
router.put('/:id', fundeeControllers.updateFundee);
router.delete('/:id', fundeeControllers.deleteFundee);

export default router;
