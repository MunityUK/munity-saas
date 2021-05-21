# Voicera Web Application

This is the source code repository of the Voicera web application in development.

## Set up development environment

These setup instructions should help you get your development environment up and
running.

> **Note:** You should only need to do this setup once. Skip to [running the app](#running-the-app)
> if you have done this already.

Ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/en/), for running the web application.
- [Docker Desktop](https://www.docker.com/products/docker-desktop), to host the
  MySQL database for ingesting and querying data.
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (optional), the
  GUI which provides a visual view of your database.

### 1. Set environment variables

In the `code` directory:

1. Copy the contents of `.env.sample` into a new file in the same directory
   simply called `.env`.
2. Fill in the empty environment variables with whatever values you choose.

### 2. Install project dependencies

Still in the `code` directory, run the following to install project dependencies:

```
npm install
```

### 3. Set up database:

In the `docker` directory, run the database script to set up the database i.e.

- On Windows, run `database` or click on `database.cmd`.
- On macOS, run `./database.sh`.

You should have a new Docker container named `voicera-db` started. Wait a few
seconds for it to bootstrap MySQL before running the next command.

### 4. Ingest example data

Back in the `code` directory, run the command to ingest example data:

```
npm run ingest
```

> Note: The default number of records ingested is 100. You can change this by
> specifying a number preceded by two dashes e.g.
> ```
> npm run ingest -- 50
> ```

## Running the app:

Back in the `code` directory, run the app with the following:

```
npm run dev
```

In your browser, go to `http://localhost:3000` to view the app.
