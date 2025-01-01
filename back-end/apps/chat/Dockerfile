FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build chat

CMD [ "node", "dist/apps/chat/main" ]

# docker build . --file apps/chat/Dockerfile -t spotify-chat-nestjs-img
# docker run -d -p 8080:8080 --name spotify-chat-nestjs-container --network node_network spotify-chat-nestjs-img