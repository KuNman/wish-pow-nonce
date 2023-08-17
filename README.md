## Available endpoints
- PUT / 
  - 201: wish is created
- GET /?uuid=[WISH_UUID]
  - 200: wish is computed
  - 204: wish is waiting for being computed

## System requirements
- Docker
- Node >16
- Npm

## Prerequisites
```bash
# install node modules
$ npm install
```
```bash
# fill application environment variables
$ cp .env.example .env
```

## Running the app
```bash
# start docker container with database
$ docker compose up
# run database migrations
$ npm run typeorm:run-migrations
# start app in dev mode
$ npm run start:dev
```

## Tests
```bash
# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e
```


