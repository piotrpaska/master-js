FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN prisma migrate deploy

RUN npm run build

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 4000
EXPOSE 5000

CMD ["node", "dist/main.js"]