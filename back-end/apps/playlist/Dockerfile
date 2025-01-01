FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build playlist

CMD [ "node", "dist/apps/playlist/main" ]

# docker build . --file apps/playlist/Dockerfile -t spotify-playlist-nestjs-img
# docker run -d -p 8080:8080 --name spotify-playlist-nestjs-container --network node_network spotify-playlist-nestjs-img