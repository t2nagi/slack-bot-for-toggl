#!/bin/bash

npm install
npx sequelize-cli db:migrate
node app.js