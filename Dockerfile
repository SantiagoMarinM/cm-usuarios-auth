FROM node:18-alpine

WORKDIR /root/

COPY package.json yarn.lock ./

ENV HUSKY=0
RUN yarn install --production=true

COPY ./dist ./dist/

COPY .env ./

CMD [ "yarn", "start" ]