FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g prisma

RUN npx prisma generate

#RUN prisma migrate deploy

RUN npm run build

COPY --chmod=0755 entrypoint.sh /app/entrypoint.sh

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 4000
EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/main.js"]