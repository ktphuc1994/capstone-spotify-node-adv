FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./libs/shared/src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build auth

CMD [ "node", "dist/apps/auth/main" ]

# docker build . --file apps/auth/Dockerfile -t spotify-backend-auth-nestjs-img
# docker run -d --name spotify-backend-auth-nestjs-container --network node_network spotify-backend-auth-nestjs-img