FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:24-alpine AS productions
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
RUN chown -R nodeuser:nodejs /app
USER nodeuser
EXPOSE 3000

CMD ["node", "dist/main.js"]