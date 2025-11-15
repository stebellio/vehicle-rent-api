FROM node:22-alpine as builder

WORKDIR /app

COPY . .

# intsall dependencies
RUN npm install

# build app
RUN npx prisma generate && \
    npm run build

RUN chmod +x docker-entrypoint.sh

FROM node:22-alpine as production

WORKDIR /app

# Install Openssl
RUN apk add openssl
RUN apk add sqlite

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/docker-entrypoint.sh ./

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]

