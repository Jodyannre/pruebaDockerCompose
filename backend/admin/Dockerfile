FROM node:16 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
#RUN npm run build
EXPOSE 3001
CMD ["npm","start"]