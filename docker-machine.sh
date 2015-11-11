#!/usr/bin/env bash

set -ex

# use this in other scripts that needs to 
# know the docker machine name
export DOCKER_MACHINE_NAME="defaults"

function sanity_check() {
  if ! command -v docker-machine; then
    echo "Please install docker before proceeding..."
    exit 1
  else
    echo "Yay! Docker machine is installed..."
  fi
}

function start_docker() {
  DOCKERMACHINE=$(docker-machine ls | grep -i running | head -n1 | cut -d " " -f1)

  if [ -z ${DOCKERMACHINE+x} ]; then
    echo "Docker is not running... let's fire it up..."

    if ! docker-machine restart "${DOCKER_MACHINE_NAME}"; then
      echo "Unable to start docker. Please investigate."
      exit 1
    fi
  else
    echo "Looks like docker is running... ${DOCKERMACHINE}"

    # re-export the machine name
    export DOCKER_MACHINE_NAME=${DOCKERMACHINE}
  fi
}

function docker_eval_env() {
  eval $(docker-machine env ${DOCKER_MACHINE_NAME})
}

# remove exited containers so we don't
# need to delete containers we've already
# built which becomes repetitive and annoying
function docker_rm_exited_container() {
  if ! docker rm -f `docker ps --no-trunc -aq`; then
    echo "Unable to remove exited containers. You may need to do this manually :-("
  fi
}

# remove dangling images to keep the system
# clean
function docker_rm_dangling() {
  if ! docker images -qf dangling=true | xargs docker rmi -f; then
    echo "Unable to remove dangling containers. You may need to do this manually :-("
  fi
}

sanity_check
start_docker
docker_eval_env
docker_rm_exited_container
docker_rm_dangling