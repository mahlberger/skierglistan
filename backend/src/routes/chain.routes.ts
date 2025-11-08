import { Router } from 'express';
import { chainController } from '../controllers/chain.controller';

const router = Router();

router.get('/', chainController.getAll);
router.get('/:id', chainController.getById);
router.post('/', chainController.create);
router.put('/:id', chainController.update);
router.delete('/:id', chainController.delete);

export default router;


