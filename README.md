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
- [Bun](https://bun.sh/docs/installation) - Version 1.1 (as a bundler fors backend)
- [pnpm](https://pnpm.io/installation) - Version 8.15.5 (as a package manager)
- Docker - Version 25.0.3

> It is recommended to install `node` with nvm and then set the `node` version with `nvm use 20`.

## Development Setup

> Please note that this repository is using `pnpm` as a package manger instead of `npm`.
AND it is using `bun` as a bundler for the backend.

> This tuturial is written on and for unix like systems.


### Clone the repository
```sh
git clone https://github.com/rememberry-io/rememberry

cd rememberry
```

### Configure environment
```sh
cp .env.example .env
```

### Install all dependencies
```bash
pnpm i
```

### Initialise the database
```bash
pnpm run docker-db-init
```

### Run backend
#### Run the backend as a docker container (no installation of bun is needed)
> This is not recommended for developing the backend because there is no hot 
reload available and it needs to be rebuilt everytime something was changed 
in the backend

To running and rebuilding (if any changes happened in the backend)
```bash 
pnpm run docker-backend-build
```
<details>
<summary>Commands to control the docker backend container</summary>
<br>

To stop the container
```bash 
pnpm run docker-backend-stop
```

To start the container (it needs to be built before that) 
```bash 
pnpm run docker-backend-start
```

To remove the backend container
```bash 
pnpm run docker-backend-delete
```
</details>

#### Run the backend locally with pnpm
> this is the recommended way if the purpose is to participate in developing the backend
but it needs `bun` to work

```bash 
pnpm run backend dev
```

### Run frontend
```bash 
pnpm run frontend dev
```

<details>
<summary>Additional notes to pnpm commands and the monorepo setup</summary>
In order :
</details>

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

Fronted UI:

- Paulo Ramirez [paulocerez](https://github.com/paulocerez)
- Joel Heil-Escobar [Joelheile](https://github.com/Joelheile)

Backend, Frontend, Setup, CI/CD and Hosting:

- Laurin Notemann [Laurin-Notemann](https://github.com/Laurin-Notemann)

Backend:

- Lennart Pafel [lnart](https://github.com/lnart)
