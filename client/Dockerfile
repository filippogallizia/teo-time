## this first part is used just in dev
FROM node:16 AS development

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN  npm i
CMD ["npm", "start"]



FROM node:16 AS builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.13-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT
CMD nginx -g 'daemon off;'




