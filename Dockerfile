FROM node:18-alpine

WORKDIR /root/

COPY package.json yarn.lock ./

ENV HUSKY=0
RUN yarn install --production=true

COPY ./dist ./dist/

COPY .env ./

COPY src/infrastructure/app/server/fastify/openapi.json dist/infrastructure/app/server/fastify/

CMD [ "yarn", "start" ]