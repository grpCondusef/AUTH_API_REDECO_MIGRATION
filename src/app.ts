import express from 'express'
import cors from 'cors'
import '../src/shared/utils/redeco_key';
import usersRoutes from '../src/presentation/routes/users.routes'
import keyCloakRoutes from '../src/presentation/routes/keyCloak.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use(usersRoutes, keyCloakRoutes)

export default app