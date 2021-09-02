import { Complaint, ComplaintStatus, DB_TABLE } from '@munity/utils';

import { execSync } from 'child_process';

import { conn } from '../config';

/**
 * Initialises the Munity MySQL database.
 */
export function initialiseDatabase() {
  ensureEnvironmentVariables();

  const CONTAINER = 'munity-db';
  const IMAGE = 'mysql/mysql-server:8.0.26';

  // Kill and remove container if it's up and running.
  const containerExists = run(`docker ps -aq -f name="${CONTAINER}"`);
  if (containerExists) {
    console.info(`Destroying "${CONTAINER}" container...`);
    run(`docker rm -f "${CONTAINER}"`);
  }

  // Pull the image from DockerHub if it isn't found locally.
  const imageExists = run(`docker images -q "${IMAGE}"`);
  if (!imageExists) {
    console.info(`Pulling "${IMAGE}" image...`);
    run(`docker pull "${IMAGE}"`);
  }

  // Create and start the container with MySQL environment variables bootstrapped.
  console.info(`Running "${CONTAINER}" container...`);
  const command = [
    'docker run',
    `--name="${CONTAINER}"`,
    `--env MYSQL_ROOT_PASSWORD="${process.env.MYSQL_ROOT_PASSWORD}"`,
    `--env MYSQL_USER="${process.env.MYSQL_USER}"`,
    `--env MYSQL_PASSWORD="${process.env.MYSQL_PASSWORD}"`,
    `--env MYSQL_DATABASE="${process.env.MYSQL_DATABASE}"`,
    '--detach',
    `--publish ${process.env.MYSQL_PORT}:3306`,
    `"${IMAGE}"`
  ].join(' ');
  run(command);
}

/**
 * Creates the database tables.
 */
export async function createTable() {
  await conn.createTable(DB_TABLE);
  console.info(`(Re)created the '${DB_TABLE}' table.`);
}

/**
 * Clears all data from the database table.
 */
export async function truncateTable() {
  await conn.truncateTable(DB_TABLE);
  console.info(`Cleared all data from '${DB_TABLE}' table.`);
}

/**
 * Ingests complaint data into the database.
 * @param quantity The quantity of complaints to ingest. Defaults to 1.
 * @param status An optional {@link ComplaintStatus} assigned to all complaints.
 */
export async function ingest(
  quantity = 1,
  status?: ComplaintStatus,
  options?: IngestOptions
) {
  if (options?.clearData) {
    await truncateTable();
  }

  const complaints: Complaint[] = [];

  for (let i = 1; i <= quantity; i++) {
    const complaint = Complaint.random({ status });
    complaint.complaintId = 'COM' + i.toString().padStart(4, '0');
    complaints.push(complaint);
  }

  await conn.insertRecords(DB_TABLE, complaints);
  console.info(`${quantity} record(s) ingested.`);
}

/**
 * Executes a command in the shell.
 * @param command The command to be executed.
 * @returns The output from the command.
 */
function run(command: string) {
  return execSync(command, { encoding: 'utf8' });
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

type IngestOptions = {
  clearData?: boolean;
};
