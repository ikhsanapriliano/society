FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /app
COPY --from=builder ./package.json .
COPY --from=builder ./package-lock.json .
COPY --from=builder ./next.config.mjs .
COPY --from=builder ./public ./public
COPY --from=builder ./.next/standalone .
COPY --from=builder ./.next/static ./.next/static

CMD [ "npm", "start" ]