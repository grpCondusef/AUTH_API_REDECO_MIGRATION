import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = 3000; // fuerza el puerto correcto
const HOST = '0.0.0.0'; // permite conexiones desde otros contenedores

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
