import { Router } from 'express';
import { ergBrandController } from '../controllers/ergBrand.controller';

const router = Router();

router.get('/', ergBrandController.getAll);
router.get('/:id', ergBrandController.getById);
router.post('/', ergBrandController.create);
router.put('/:id', ergBrandController.update);
router.delete('/:id', ergBrandController.delete);

export default router;


