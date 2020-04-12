FROM node:12.16.2-alpine as build

# Arguments 
ARG SERVICE_PORT
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV \
    SERVICE_PORT=$SERVICE_PORT \
    APP_DIR="/usr/src/preggies"
RUN mkdir -p $APP_DIR

RUN apk add --no-cache git

WORKDIR $APP_DIR
COPY package.json $APP_DIR

RUN yarn install --prod

COPY . .

RUN yarn build

# Production container
FROM node:12.14.1-alpine

ARG NODE_ENV
ARG SERVICE_PORT

# Configuration
ENV SERVICE_PORT=$SERVICE_PORT \
    SERVICE_USER=preggies \
    SERVICE_USER_ID=1001 \
    SERVICE_GROUP=preggies \
    SERVICE_GROUP_ID=1001 \
    APP_DIR=/usr/src/preggies \
    NODE_ENV=$NODE_ENV

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR
RUN addgroup -g $SERVICE_GROUP_ID $SERVICE_GROUP \
  && adduser -D -u $SERVICE_USER_ID -G $SERVICE_GROUP $SERVICE_USER \
  && chown -R $SERVICE_USER:$SERVICE_GROUP $APP_DIR

USER $SERVICE_USER

COPY --chown=$SERVICE_USER:$SERVICE_GROUP --from=build $APP_DIR/lib $APP_DIR/lib
COPY --chown=$SERVICE_USER:$SERVICE_GROUP --from=build $APP_DIR/node_modules $APP_DIR/node_modules
COPY --chown=$SERVICE_USER:$SERVICE_GROUP --from=build $APP_DIR/package.json $APP_DIR/package.json
COPY --chown=$SERVICE_USER:$SERVICE_GROUP --from=build $APP_DIR/yarn.lock $APP_DIR/yarn.lock

EXPOSE $SERVICE_PORT

CMD ["yarn", "start"]
