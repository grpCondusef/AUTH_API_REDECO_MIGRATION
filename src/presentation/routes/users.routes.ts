import { Router } from 'express';
import { validateAuthorizationHeader } from '../middlewares/validateAutorization';
import { createSuperUser } from '../../presentation/controllers/superUser.controllers';
import { userExists } from '../middlewares/userExists';
import { createUser } from '../../presentation/controllers/users.controllers';
import { updateToken } from '../../presentation/controllers/updateToken';
import { validarJWT } from '../../presentation/middlewares/validateJWT';
import { deleteUSer } from '../../presentation/controllers/deleteUser'
import { loadKeys } from '../../shared/utils/redeco_key';

const router = Router()

router.post('/users/create-super-user/', validateAuthorizationHeader, userExists, createSuperUser);
router.post('/users/create-user/', validarJWT, userExists, createUser);
router.delete('/users/user/', validarJWT, deleteUSer),
router.get('/users/token/', updateToken)
router.post('/users/token/', updateToken)


export default router