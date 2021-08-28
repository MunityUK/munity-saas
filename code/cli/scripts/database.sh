#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "${0}")"
cd "${SCRIPT_DIR}"

# Determine project root directory
ROOT_DIR=$(pushd . 1> /dev/null ; \
  while [ "$(PWD)" != "/" ]; do \
  test -e .root && grep -q 'Munity-Saas-Root-Dir' < .root && { pwd; break; }; \
  cd .. ; done ; popd \
  1> /dev/null)

# shellcheck disable=SC1091
## Import environment variables from .env file.
source "${ROOT_DIR}/.env"

CONTAINER='munity-db'
IMAGE='mysql/mysql-server:8.0.26'

ENV_VARS=(MYSQL_ROOT_PASSWORD MYSQL_USER MYSQL_PASSWORD MYSQL_DATABASE)

## Ensure environment variables are set.
for env in "${ENV_VARS[@]}"; do
  if [[ -z "${!env}" ]]; then
    echo "${env} is missing or empty. Ensure that you have set your environment variables."
    exit 1
  fi
done

function print() {
  echo "========================================"
  echo "= ${1}"
  echo "========================================"
}

## Kill and remove container if it's up and running.
if [ "$(docker ps -aq -f name=${CONTAINER})" ]; then
  print "Destroying ${CONTAINER} container..."
  docker rm -f "${CONTAINER}"
fi

## Pull the image from DockerHub if it isn't found locally.
if [[ -z "$(docker images -q ${IMAGE})" ]]; then
  print "Pulling $IMAGE image..."
  docker pull "${IMAGE}"
fi

## Create and start the container with MySQL environment variables bootstrapped.
print "Running $CONTAINER container..."
docker run --name=$CONTAINER \
  --env MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD}" \
  --env MYSQL_USER="${MYSQL_USER}" \
  --env MYSQL_PASSWORD="${MYSQL_PASSWORD}" \
  --env MYSQL_DATABASE="${MYSQL_DATABASE}" \
  --detach \
  --publish 3306:3306 \
  "${IMAGE}"
