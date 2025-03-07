import { Router } from 'express';
import { getTokenFromKeycloak } from '../../presentation/controllers/getTokenFromKeycloak';
import { validateTokenKeycloak } from '../middlewares/validateTkeycloak';
import { createSuperUser }from '../../../src/presentation/controllers/keycloak/createSuperUser.controllers'

const router = Router()

router.post('/tokenKeycloak/', getTokenFromKeycloak);
router.post('/validatetokenKeycloak/', validateTokenKeycloak);
router.post('/create/superUser/', createSuperUser)

export default router