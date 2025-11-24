# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Pass API_KEY as build argument (Required for Vite to replace process.env.API_KEY)
ARG API_KEY
ENV API_KEY=$API_KEY

# Build the project
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from the build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]