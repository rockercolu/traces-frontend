#!/usr/bin/env bash

set -ex

BASEDIR="$( cd "$( dirname "$0" )" && pwd )"

# source our helper script
. ${BASEDIR}/docker-machine.sh

# registry username
RUSERNAME="${DOCKER_USERNAME:-steven}"

# project name for container
PNAME="${PROJECT_NAME:-citeshare}"

# container tag
PTAG="${PROJECT_TAG:-latest}"

# path to docker file
DPATH="${DOCKER_FILE:-`pwd`}"

docker build -t ${RUSERNAME}/${PNAME}:${PTAG} ${DPATH}