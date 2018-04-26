FROM node:8.10.0

RUN mkdir -p /usr/local/oi-tracker
WORKDIR /usr/local/oi-tracker

COPY . .

ENV NODE_ENV=docker
ENV NODE_DEBUG=info

RUN npm run build

CMD ./scripts/run.sh
