FROM node:20.15.1-alpine AS deps
WORKDIR /app

# Install dependencies from lockfile for deterministic, cache-friendly builds
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund \
    && npm cache clean --force


FROM node:20.15.1-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

COPY --from=deps /app/node_modules ./node_modules
COPY . ./
RUN npm run build


FROM node:20.15.1-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

EXPOSE 3000
CMD ["npm", "run", "dev"]


FROM node:20.15.1-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]