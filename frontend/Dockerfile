FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g serve

COPY . .

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
