FROM node:20-alpine AS dashboard-builder
WORKDIR /app/dashboard
COPY dashboard/package.json ./
# Use npm install to resolve dependencies (package-lock.json may be out of sync)
RUN npm install
COPY dashboard/ ./
RUN npm run build

FROM node:20-alpine AS nestjs-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Copy built dashboard to expected location
COPY --from=dashboard-builder /app/dashboard/build ./dashboard/build
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=nestjs-builder /app/dist ./dist
COPY --from=nestjs-builder /app/node_modules ./node_modules
COPY --from=nestjs-builder /app/dashboard/build ./dashboard/build
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main"]
