from node:12.16.2-alpine3.9

workdir /app

copy package.json .

run npm install --only=prod

copy . .

cmd ["npm", "start"]