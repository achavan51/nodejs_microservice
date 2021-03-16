FROM node:alpine

WORKDIR /app

ARG NPM_TOKEN
COPY .npmrc .npmrc
COPY package.json .
RUN npm install --only=prod
RUN rm -f .npmrc
COPY . .

CMD ["npm", "start"]