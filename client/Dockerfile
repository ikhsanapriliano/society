FROM node:20.11-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:20.11-alpine as runner
WORKDIR /app
COPY --from=builder ./app/package.json .
COPY --from=builder ./app/package-lock.json .
COPY --from=builder ./app/next.config.mjs .
COPY --from=builder ./app/public ./public
COPY --from=builder ./app/.next/standalone .
COPY --from=builder ./app/.next/static ./.next/static

CMD [ "npm", "start" ]