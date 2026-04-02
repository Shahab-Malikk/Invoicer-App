ARG VITE_ENV

# Stage 1: Build the application
FROM node:20.15.1 AS build

# Ensure node modules binaries are in PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for caching dependencies
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the application using environment variables
RUN npm run build

# Stage 2: Development Environment (Node.js)
FROM node:20.15.1 AS dev

# Set the working directory
WORKDIR /app

# Copy the application and node_modules from the build stage
COPY --from=build /app /app

# Expose the Vite dev server port
EXPOSE 3004

# Start the development server
CMD ["npm", "run", "start:dev", "--", "--host"]

# # Stage 3: Production Environment (Nginx)
# FROM nginx:stable-alpine AS production

# # Copy the build output from the previous stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy custom Nginx configuration if needed
# COPY nginx/nginx.config /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]

# # Final stage: Use VITE_ENV to decide the base image
# # Default to production
# FROM ${VITE_ENV:-production} AS final