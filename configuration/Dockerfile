# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Instala las dependencias
RUN npm install

# Expone el puerto 3000 para la aplicación
EXPOSE 3000

# Comando por defecto para iniciar el contenedor
CMD ["npm", "run", "dev"]
