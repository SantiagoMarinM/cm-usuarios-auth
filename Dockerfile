FROM node:18-alpine

WORKDIR /root/

COPY package.json yarn.lock ./

RUN npm_config_lifecycle_event=ignore yarn install --production=true

COPY ./dist ./dist/

COPY .env ./

CMD [ "yarn", "start" ]