## @weirdnest/boilerplate

Boilerplate code and resource generator for Nest.js micro-services with `RabbitMQ` and `TypeORM`.

## Features:

- Gateway with REST API and websockets
- Provider/Consumer for RabbitMQ microservices
- Helper to generate new resources
- Tracking requests by id, request context module
- Abstractions for services and repositories
- Logger extension involving context
- Transaction interceptor
- Exception filters

## Structure:

It follows Nest.js multiple apps mono-repository structure.

Libraries are created with `@libs` prefix.

- `apps/app-content` - sample microservice with `Article` resources
- `apps/app-gate` - REST API gateway
- `libs/articles` - resource sample, source for generator
- `libs/shared` - infrastructure layer with shared dependencies
- `scripts/generate.sh` - script to save time when creating new resource. It runs `nest g resource...`, then replaces new content using `awk`, `sed` and the `libs/articles` folder.

One of the ways to extend it - add more libraries for microservices and resources (ex. `libs/api-content`) and more apps accordingly. Along with infrastructure layer (`libs/shared`) there can be application layer (ex. `libs/app`) layer for customised entities, DTO and controllers.

## How to use

### Run sample applications

```bash
bun run start:dev app-gate # API gateway
bun run start:dev app-content # microservice
```

### Generate resource:

Generate `pages` resource in `api-content` project (as per `nest-cli.json`):

```bash
bash scripts/generate.sh -p api-content -r pages
```
