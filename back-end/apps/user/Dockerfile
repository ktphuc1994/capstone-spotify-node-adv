FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build user

CMD [ "node", "dist/apps/user/main" ]

# docker build . --file apps/user/Dockerfile -t spotify-user-nestjs-img
# docker run -d -p 8080:8080 --name spotify-user-nestjs-container --network node_network spotify-user-nestjs-img