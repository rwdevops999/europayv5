FROM node:23-alpine

# RUN apk update && apk add bash

# switch to directory /europay (in docker image)
WORKDIR  /europay

# copy package.json to /europay
COPY package*.json  ./

COPY . .

RUN npm install -g pnpm

ENV CI=true
RUN pnpm install

EXPOSE 3000

# SHELL ["/bin/bash", "-o", "pipefail", "-c"]

CMD [ "pnpm", "start" ]
