# FROM node:18-alpine as builder
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./next.config.mjs .
COPY ./public ./public
COPY ./.next/standalone .
COPY ./.next/static ./.next/static

CMD [ "npm", "start" ]