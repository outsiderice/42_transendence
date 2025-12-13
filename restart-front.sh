#!/bin/bash

docker-compose down

docker image rm -f t_frontend

docker-compose up
