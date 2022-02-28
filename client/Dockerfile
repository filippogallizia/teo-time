#FROM node:lts AS development

#WORKDIR /app
#COPY package.json /app/package.json
#COPY package-lock.json /app/package-lock.json
#RUN npm ci
#COPY . /app

#CMD [ "npm", "start" ]

#FROM development AS builder

#RUN npm run build

#FROM nginx:1.13-alpine

#COPY --from=builder /code/build /usr/share/nginx/html



FROM node:16 
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

COPY ./ ./
RUN  npm i
CMD ["npm", "start"]
#CMD ["npm", "run", "build"]

#to see if needed this second step
# production environment
#FROM nginx:stable-alpine
#COPY --from=builder /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]