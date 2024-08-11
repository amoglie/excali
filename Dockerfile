# Usamos una imagen base de Node.js
FROM node:20.10.0

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Compilamos la aplicación (si es necesario, por ejemplo, si usas TypeScript o un bundler como Webpack)
# RUN npm run build

# Especifica el puerto en el que se ejecuta tu aplicación (por defecto 3000 para apps Node.js)
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
