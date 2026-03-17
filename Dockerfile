# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy rest of code
COPY . .

# Build app (Vite → dist)
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Add custom config (fix React routing)
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]