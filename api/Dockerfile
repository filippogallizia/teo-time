FROM node:16 AS development

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD npm run dev



FROM node:12.17.0-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY . .
RUN ls -a
RUN npm install
RUN npm run build
## this is stage two , where the app actually runs
FROM node:12.17.0-alpine AS production
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /app/dist .
RUN npm install pm2 -g
EXPOSE 80
CMD ["pm2-runtime","app.js"]
