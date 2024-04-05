# rememberry 🫐

Rememberry is a web app that combines the value of spaced repetition of flashcards and visualisation of mind maps.
Every user can create their own maps that have a tree-shaped design where the branches are the topics,
and the leaves at the end are just regular flashcards.
The main goal is that when users are trying to learn for their upcoming exam,
instead of just learning with plain flashcards, they can create a map that immediately shows how certain topics and flashcards are connected.

## Staging deployments

[Website](https://web.stage.rememberry.app/) 
<br>
[Api](https://api.stage.rememberry.app/)

## Prerequisites
- [Node.js](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) - Version 20 (as a runtime)
- [Bun](https://bun.sh/docs/installation) - Version 1.1 (as a bundler for the backend)
- [pnpm](https://pnpm.io/installation) - Version 8.15.5 (as a package manager)
- Docker - Version 25.0.3

> It is recommended to install `node` with nvm and then set the `node` version with `nvm use 20`.

## Development Setup

> Please note that this repository is using `pnpm` as a package manger instead of `npm`.
AND it is using `bun` as a bundler for the backend.

> This tuturial is written on and for unix like systems.

#### Clone the repository
```sh
git clone https://github.com/rememberry-io/rememberry

cd rememberry
```

#### Configure environment
```sh
cp .env.example .env
```

#### Install all dependencies
```bash
pnpm i
```

#### Initialise the database (needs docker)
```bash
pnpm run docker-db-init
```

## Running Services
Currently two services are present in this repository, the backend (built using [tRPC](https://trpc.io/)) and 
the frontend (built using [Next.js](https://nextjs.org/)) and it is possible to either run 
them locally with `pnpm` or in `docker`.

### `PNPM`
For ideal development for either backend or frontend it is recommended to run the service,
that is developed for, with `pnpm` to take advantage of the hot reload.

#### `pnpm` workspace devleopment
To take advantage of the pnpm workspace, use `pnpm --filter=<service>` like: 
`pnpm --filter=backend` depending on which service is interacted with.

#### Add new packages backend
```bash
pnpm add --filter=backend <package-name>
```

#### Add new packages frontend
```bash
pnpm add --filter=frontend <package-name>
```

For simpler development instead of using `pnpm run --filter=<service> dev` it is
possbile to use the alias `pnpm run <service> dev`. The scripts (such as `dev`) are then
defined in the local `package.json` file of the corresponding service and can be run with the alias.

#### Run backend
```bash
pnpm run backend dev
```

#### Run frontend
```bash
pnpm run frontend dev
```

### `Docker`
As mentioned, it is possible to run either the backend or the frontend as a docker container.
For this case two `pnpm` commands are avaiable.

#### Run backend
```bash
pnpm docker-build-backend
```

#### Run frontend
```bash
pnpm docker-build-frontend
```

To start all docker containers (this will also start the database if it has not 
been initialised yet) at once run:
```bash
pnpm docker-build-all
```

This repository is using `docker compose` to run services inside of docker, which 
means using commands such as `docker compose start/stop/down frontend/backend` 
are completely valid and are encouraged to be used or taking advantage of docker 
desktop is also possible.

## New Migrations
In case new migrations are added run the following command
> This will delete all content in the database therefore only for local devleopment

```bash
pnpm run docker-db-reset
```

## Noticable Technologies

- Typescript
- tRPC
- Postgres
- Drizzle
- Nextjs
- Kubernetes
- GitHub Actions

## Contribution

Backend, Frontend, Setup, CI/CD and Hosting:

- Laurin Notemann [Laurin-Notemann](https://github.com/Laurin-Notemann)

Fronted UI:

- Paulo Ramirez [paulocerez](https://github.com/paulocerez)
- Joel Heil-Escobar [Joelheile](https://github.com/Joelheile)

Backend:

- Lennart Pafel [lnart](https://github.com/lnart)
