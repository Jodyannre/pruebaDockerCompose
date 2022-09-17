FROM node:16 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
#RUN npm run build
EXPOSE 3005
CMD ["npm","start"]