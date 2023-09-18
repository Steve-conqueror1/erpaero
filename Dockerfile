FROM node:16.16.0
WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
COPY . .
RUN npm ci
RUN npm run build

CMD ["npm", "start"]