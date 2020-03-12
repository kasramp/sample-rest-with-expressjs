#!/bin/bash

docker exec -i mysql-user mysql -u root --password=secret user < db_tables/user.sql