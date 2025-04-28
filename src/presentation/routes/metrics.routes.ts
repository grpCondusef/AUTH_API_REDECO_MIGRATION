import { Router } from 'express';
import { metricsController } from '../controllers/metrics/metrics.controllers';

const router = Router();

router.get('/metrics', metricsController);

export default router;
