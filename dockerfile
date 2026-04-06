ARG NEXT_ENV

# Stage 1: Build
FROM node:20.15.1 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


# Stage 2: Development
FROM node:20.15.1 AS dev

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "dev"]


# Stage 3: Production
FROM node:20.15.1 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]


# Final stage
FROM ${NEXT_ENV:-production} AS final