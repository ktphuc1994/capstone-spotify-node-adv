FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build artist

CMD [ "node", "dist/apps/artist//main" ]

# docker build . --file apps/artist/Dockerfile -t spotify-artist-nestjs-img
# docker run -d -p 8080:8080 --name spotify-artist-nestjs-container --network node_network spotify-artist-nestjs-img