import { Router } from 'express';
import { listController } from '../controllers/list.controller';

const router = Router();

router.get('/', listController.getList);

export default router;

