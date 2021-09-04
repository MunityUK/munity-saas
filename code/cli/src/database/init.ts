import { execSync } from 'child_process';

import { createTable } from '.';
import { Logger } from '../helpers';

/**
 * Initialises the Munity MySQL database.
 * @param options Options passed into the initialisation command.
 */
export async function initialiseDatabase(options?: InitOptions) {
  const CONTAINER = 'munity-db';
  const IMAGE = 'mysql/mysql-server:8.0.26';

  ensureEnvironmentVariables();
  removeContainerIfExists(CONTAINER);
  pullImageIfNecessary(IMAGE);
  runContainer(CONTAINER, IMAGE);
  await waitUntilDatabaseReady(CONTAINER);

  if (!options?.noTables) {
    await createTable();
  }
}

/**
 * Ensures thats all MYSQL environment variables are set.
 * @throws An error if any environment variables are not set.
 */
function ensureEnvironmentVariables() {
  const allVariablesSet = Object.entries(process.env)
    .filter(([key]) => key.startsWith('MYSQL'))
    .every(([, value]) => value);
  if (!allVariablesSet) {
    throw new Error('Ensure that all of your environment variables are set.');
  }
}

/**
 * // Kill and remove container if it's up and running.
 * @param container The container name.
 */
function removeContainerIfExists(container: string) {
  const containerExists = run(`docker ps -aq -f name="${container}"`);
  if (containerExists) {
    Logger.progress(`Destroying '${container}' container...`);
    run(`docker rm -f "${container}"`);
    Logger.outcome(`Container destroyed.`);
  }
}

/**
 * Pull the image from DockerHub if it isn't found locally.
 * @param image The Docker image to pull.
 */
function pullImageIfNecessary(image: string) {
  const imageExists = run(`docker images -q "${image}"`);
  if (!imageExists) {
    Logger.progress(`Pulling "${image}" image...`);
    run(`docker pull "${image}"`);
    Logger.outcome(`Image downloaded.`);
  }
}

/**
 * Create and start the container with MySQL environment variables bootstrapped.
 * @param container The container to run.
 * @param image The Docker image to run.
 */
function runContainer(container: string, image: string) {
  Logger.progress(`Running '${container}' container...`);
  const command = [
    'docker run',
    `--name="${container}"`,
    `--env MYSQL_ROOT_PASSWORD="${process.env.MYSQL_ROOT_PASSWORD}"`,
    `--env MYSQL_USER="${process.env.MYSQL_USER}"`,
    `--env MYSQL_PASSWORD="${process.env.MYSQL_PASSWORD}"`,
    `--env MYSQL_DATABASE="${process.env.MYSQL_DATABASE}"`,
    '--detach',
    '--health-cmd="mysqladmin ping --silent"',
    `--publish ${process.env.MYSQL_PORT}:3306`,
    `"${image}"`
  ].join(' ');
  run(command);
  Logger.outcome(`Container running.`);
}

/**
 * Waits until MySQL database server is running and heathy.
 * @param container The name of the container running MySQL.
 */
async function waitUntilDatabaseReady(container: string) {
  Logger.progress('Waiting for database to initialise...');
  const command = `docker container inspect ${container} --format='{{json .State.Health}}'`;
  const interval = 5000;
  await new Promise<void>((resolve, reject) => {
    let state = '';
    const id = setInterval(runInspect, interval);

    function runInspect() {
      const output = run(command);
      const { Status } = JSON.parse(output);
      state = Status;
      if (state === 'starting') {
        Logger.progress(`Waiting...`);
      } else {
        clearInterval(id);
        if (state === 'healthy') {
          Logger.success(`MySQL server is healthy.`);
          resolve();
        } else {
          Logger.error(`MySQL server has failed.`);
          reject();
        }
      }
    }
  });
  Logger.outcome('Database initialised.');
}

/**
 * Executes a command in the shell.
 * @param command The command to be executed.
 * @returns The output from the command.
 */
function run(command: string) {
  return execSync(command, { encoding: 'utf8', windowsHide: true });
}

type InitOptions = {
  noTables?: boolean;
};
