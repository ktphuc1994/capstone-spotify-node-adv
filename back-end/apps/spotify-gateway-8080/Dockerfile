FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build spotify-gateway-8080

CMD [ "node", "dist/apps/spotify-gateway-8080/main" ]

# docker build . --file apps/spotify-gateway-8080/Dockerfile -t spotify-backend-gateway-nestjs-img
# docker run -d -p 8080:8080 --name spotify-backend-gateway-nestjs-container --network node_network spotify-backend-gateway-nestjs-img