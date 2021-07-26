#!/bin/bash

set -e

CONTAINER='voicera-db'
IMAGE='mysql/mysql-server:8.0.26'

## Import environment variables from .env file.
source ../.env

## Ensure environment variables are set.
for env in MYSQL_ROOT_PASSWORD MYSQL_USER MYSQL_PASSWORD MYSQL_DATABASE; do
  if [[ -z ${!env} ]]; then
    echo "${env} is missing or empty. Ensure that you have set your environment variables."
    exit 1
  fi
done

## Kill and remove container if it's up and running.
if [ "$(docker ps -aq -f name=$CONTAINER)" ]; then
  echo "Destroying $CONTAINER container..."
  docker rm -f $CONTAINER >/dev/null 2>&1
fi

## Pull the image from DockerHub if it isn't found locally.
if [[ "$(docker images -q $IMAGE >/dev/null 2>&1)" == "" ]]; then
  echo "Pulling $IMAGE image..."
  docker pull $IMAGE >/dev/null 2>&1
fi

## Create and start the container with MySQL environment variables bootstrapped.
echo "Running $CONTAINER container..."
docker run --name=$CONTAINER \
  --env MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  --env MYSQL_USER=$MYSQL_USER \
  --env MYSQL_PASSWORD=$MYSQL_PASSWORD \
  --env MYSQL_DATABASE=$MYSQL_DATABASE \
  --detach \
  --publish 3306:3306 \
  $IMAGE \
  >/dev/null 2>&1

echo "Container starting..."