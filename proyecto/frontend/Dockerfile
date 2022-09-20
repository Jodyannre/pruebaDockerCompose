FROM node:16 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install --force
COPY . .
#RUN npm run build
EXPOSE 5173
CMD ["npm","run","dev"]
#CMD ["npx","vite" ,"--host 0.0.0.0"]