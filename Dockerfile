FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

RUN npm uninstall bcrypt
RUN npm install bcrypt

COPY . .

RUN npm run build

EXPOSE 8000
CMD ["npm", "run", "start:dev"]
