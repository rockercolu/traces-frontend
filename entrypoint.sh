#!/usr/bin/env bash

cd /src/

if ! npm start; then
  echo "Failed to start server"
  exit 1
fi

echo "Server started"
exit 0