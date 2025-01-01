FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build song

CMD [ "node", "dist/apps/song/main" ]

# docker build . --file apps/song/Dockerfile -t spotify-song-nestjs-img
# docker run -d -p 8080:8080 --name spotify-song-nestjs-container --network node_network spotify-song-nestjs-img